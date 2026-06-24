import type { DuplicateCheckInput, DuplicateMatch, DuplicateRiskResult } from '@/services/ai/types';
import { services } from '@/services/registry';
import type { IssueCategory, Report } from '@/types';

const DUPLICATE_RADIUS_M = 250;
const HIGH_RISK_THRESHOLD = 70;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function textSimilarity(a: string, b: string): number {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) {
    if (tb.has(t)) overlap += 1;
  }
  return overlap / Math.max(ta.size, tb.size);
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function scoreReportMatch(
  input: DuplicateCheckInput,
  report: Report,
  distanceM: number,
): DuplicateMatch {
  const categoryMatch = report.category === input.category ? 35 : 0;
  const textScore = textSimilarity(input.description, report.description) * 45;
  const distanceScore = Math.max(0, 20 - distanceM / 15);
  const score = Math.round(categoryMatch + textScore + distanceScore);
  return { reportId: report.id, score, distanceM: Math.round(distanceM) };
}

export async function findLocalDuplicateMatches(
  input: DuplicateCheckInput,
): Promise<DuplicateMatch[]> {
  const nearby = await services.reports.findNearby(input.lat, input.lng, DUPLICATE_RADIUS_M);
  const open = nearby.filter(
    (r) => r.status !== 'merged' && r.status !== 'resolved' && r.status !== 'rejected',
  );
  return open
    .map((r) => scoreReportMatch(input, r, haversineM(input.lat, input.lng, r.location.lat, r.location.lng)))
    .filter((m) => m.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export async function checkDuplicateRisk(input: DuplicateCheckInput): Promise<DuplicateRiskResult> {
  const localMatches = await findLocalDuplicateMatches(input);
  const localRisk = localMatches[0]?.score ?? 0;

  try {
    const ai = await services.ai.detectDuplicateRisk(input);
    const merged = [...localMatches];
    for (const m of ai.matches) {
      const existing = merged.find((x) => x.reportId === m.reportId);
      if (existing) {
        existing.score = Math.max(existing.score, m.score);
      } else {
        merged.push(m);
      }
    }
    merged.sort((a, b) => b.score - a.score);
    return {
      riskScore: Math.max(localRisk, ai.riskScore),
      matches: merged.slice(0, 3),
    };
  } catch {
    return { riskScore: localRisk, matches: localMatches };
  }
}

export function isHighDuplicateRisk(result: DuplicateRiskResult): boolean {
  return result.riskScore >= HIGH_RISK_THRESHOLD && result.matches.length > 0;
}

export function categoryMismatchHint(
  selectedCategory: IssueCategory,
  description: string,
): boolean {
  const text = description.toLowerCase();
  const hints: Record<IssueCategory, string[]> = {
    pothole: ['pothole', 'road', 'asphalt', 'crack'],
    water_leak: ['water', 'leak', 'pipe', 'flood'],
    streetlight: ['light', 'lamp', 'dark', 'streetlight'],
    garbage: ['garbage', 'trash', 'waste', 'dump'],
    sanitation: ['sewage', 'smell', 'drain', 'sanitation'],
    infrastructure: ['bridge', 'sidewalk', 'fence', 'sign'],
    other: [],
  };
  if (selectedCategory === 'other') return false;
  const words = hints[selectedCategory];
  return words.length > 0 && !words.some((w) => text.includes(w));
}

export { HIGH_RISK_THRESHOLD, DUPLICATE_RADIUS_M };
