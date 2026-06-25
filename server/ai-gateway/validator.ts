const CIVIC_CATEGORIES = [
  'pothole',
  'water_leak',
  'streetlight',
  'garbage',
  'sanitation',
  'infrastructure',
  'other',
] as const;

const SEVERITIES = ['low', 'medium', 'high'] as const;

export type CivicCategory = (typeof CIVIC_CATEGORIES)[number];
export type CivicSeverity = (typeof SEVERITIES)[number];

export function clamp01(value: unknown, fallback = 0.5): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(1, Math.max(0, n));
}

export function clampRiskScore(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

export function asCategory(value: unknown): CivicCategory {
  const s = String(value ?? 'other');
  return (CIVIC_CATEGORIES as readonly string[]).includes(s) ? (s as CivicCategory) : 'other';
}

export function asSeverity(value: unknown): CivicSeverity {
  const s = String(value ?? 'medium');
  return (SEVERITIES as readonly string[]).includes(s) ? (s as CivicSeverity) : 'medium';
}

export function parseModelJson(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('MODEL_JSON_MISSING');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('MODEL_JSON_INVALID');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('MODEL_JSON_NOT_OBJECT');
  }
  return parsed as Record<string, unknown>;
}

export function validateCategorizeOutput(
  parsed: Record<string, unknown>,
): { category: CivicCategory; confidence: number; rationale?: string } {
  return {
    category: asCategory(parsed.category),
    confidence: clamp01(parsed.confidence, 0.7),
    rationale:
      typeof parsed.rationale === 'string' ? parsed.rationale.slice(0, 280) : undefined,
  };
}

export function validateSeverityOutput(
  parsed: Record<string, unknown>,
): { severity: CivicSeverity; confidence: number; rationale?: string } {
  return {
    severity: asSeverity(parsed.severity),
    confidence: clamp01(parsed.confidence, 0.7),
    rationale:
      typeof parsed.rationale === 'string' ? parsed.rationale.slice(0, 280) : undefined,
  };
}

export function validateDuplicateOutput(parsed: Record<string, unknown>): {
  riskScore: number;
  matches: { reportId: string; score: number; distanceM: number }[];
} {
  const matchesRaw = Array.isArray(parsed.matches) ? parsed.matches : [];
  const matches = matchesRaw
    .filter((m): m is Record<string, unknown> => Boolean(m) && typeof m === 'object')
    .map((m) => ({
      reportId: sanitizeId(m.reportId),
      score: clampRiskScore(m.score, 0),
      distanceM: Math.max(0, Number(m.distanceM) || 0),
    }))
    .filter((m) => m.reportId.length > 0);

  return {
    riskScore: clampRiskScore(parsed.riskScore, 0),
    matches,
  };
}

export function validateReportCopyOutput(
  parsed: Record<string, unknown>,
  fallbackDescription: string,
): { title: string; summary: string; description: string } {
  const title =
    typeof parsed.title === 'string' && parsed.title.trim()
      ? parsed.title.trim().slice(0, 60)
      : fallbackDescription.slice(0, 60);
  const summary =
    typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim().slice(0, 500)
      : fallbackDescription.slice(0, 500);
  const description =
    typeof parsed.description === 'string' && parsed.description.trim()
      ? parsed.description.trim().slice(0, 2000)
      : fallbackDescription.slice(0, 2000);
  return { title, summary, description };
}

export function validateSummarizeOutput(
  parsed: Record<string, unknown>,
  fallback: string,
): string {
  if (typeof parsed.summary === 'string' && parsed.summary.trim()) {
    return parsed.summary.trim().slice(0, 500);
  }
  if (typeof parsed.description === 'string' && parsed.description.trim()) {
    return parsed.description.trim().slice(0, 500);
  }
  return fallback.slice(0, 500);
}

export function validateReportIntakeOutput(
  parsed: Record<string, unknown>,
  fallbackDescription: string,
): {
  category: CivicCategory;
  severity: CivicSeverity;
  suggestedTitle: string;
  summary: string;
  safetyCues: string[];
  confidence: { category: number; severity: number; overall: number };
  explanation: string;
  categoryRationale?: string;
  severityRationale?: string;
} {
  const category = asCategory(parsed.category);
  const severity = asSeverity(parsed.severity);
  const categoryConfidence = clamp01(parsed.categoryConfidence ?? parsed.confidence, 0.55);
  const severityConfidence = clamp01(parsed.severityConfidence ?? parsed.confidence, 0.6);
  const overall = Math.round(((categoryConfidence + severityConfidence) / 2) * 100) / 100;

  const suggestedTitle =
    typeof parsed.suggestedTitle === 'string' && parsed.suggestedTitle.trim()
      ? parsed.suggestedTitle.trim().slice(0, 60)
      : typeof parsed.title === 'string' && parsed.title.trim()
        ? parsed.title.trim().slice(0, 60)
        : fallbackDescription.slice(0, 60);

  const summary =
    typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim().slice(0, 500)
      : fallbackDescription.slice(0, 500);

  const safetyCuesRaw = Array.isArray(parsed.safetyCues) ? parsed.safetyCues : [];
  const safetyCues = safetyCuesRaw
    .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    .map((c) => c.trim().slice(0, 120))
    .slice(0, 5);

  const explanation =
    typeof parsed.explanation === 'string' && parsed.explanation.trim()
      ? parsed.explanation.trim().slice(0, 500)
      : typeof parsed.categoryRationale === 'string'
        ? parsed.categoryRationale.slice(0, 500)
        : 'Suggestions based on your description and any safety cues.';

  return {
    category,
    severity,
    suggestedTitle,
    summary,
    safetyCues,
    confidence: { category: categoryConfidence, severity: severityConfidence, overall },
    explanation,
    categoryRationale:
      typeof parsed.categoryRationale === 'string'
        ? parsed.categoryRationale.slice(0, 280)
        : undefined,
    severityRationale:
      typeof parsed.severityRationale === 'string'
        ? parsed.severityRationale.slice(0, 280)
        : typeof parsed.rationale === 'string'
          ? parsed.rationale.slice(0, 280)
          : undefined,
  };
}

function sanitizeId(value: unknown): string {
  return String(value ?? '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 64);
}
