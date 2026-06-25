import type { Report } from '../../src/types/index.ts';
import { haversineM } from '../data/open-reports.ts';

const DUPLICATE_RADIUS_M = 250;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

export function textSimilarity(a: string, b: string): number {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) {
    if (tb.has(t)) overlap += 1;
  }
  return overlap / Math.max(ta.size, tb.size);
}

export interface ScoredMatch {
  reportId: string;
  title: string;
  score: number;
  distanceM: number;
  category: string;
  status: string;
  description: string;
}

export function scoreReportMatch(
  description: string,
  category: string,
  lat: number,
  lng: number,
  report: Report,
): ScoredMatch {
  const distanceM = haversineM(lat, lng, report.location.lat, report.location.lng);
  const categoryMatch = report.category === category ? 35 : 0;
  const textScore = textSimilarity(description, report.description) * 45;
  const distanceScore = Math.max(0, 20 - distanceM / 15);
  const score = Math.round(categoryMatch + textScore + distanceScore);
  const title = report.description.split('\n')[0]?.slice(0, 60) ?? report.description.slice(0, 60);
  return {
    reportId: report.id,
    title,
    score,
    distanceM: Math.round(distanceM),
    category: report.category,
    status: report.status,
    description: report.description,
  };
}

export function findNearbyMatches(
  description: string,
  category: string,
  lat: number,
  lng: number,
  openReports: Report[],
): ScoredMatch[] {
  return openReports
    .map((r) => scoreReportMatch(description, category, lat, lng, r))
    .filter((m) => m.distanceM <= DUPLICATE_RADIUS_M && m.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export { DUPLICATE_RADIUS_M };
