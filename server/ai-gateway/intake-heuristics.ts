import type { CivicCategory, CivicSeverity } from './validator.ts';

const SAFETY_PATTERNS: { pattern: RegExp; cue: string }[] = [
  { pattern: /\bschool\b/i, cue: 'Near a school zone' },
  { pattern: /\b(child|children|kid)\b/i, cue: 'Children may be affected' },
  { pattern: /\bdangerous\b/i, cue: 'Described as dangerous' },
  { pattern: /\btraffic\b/i, cue: 'Traffic impact mentioned' },
  { pattern: /\bblock(ing|ed)?\b/i, cue: 'Possible obstruction' },
  { pattern: /\bflood|leak|water\b/i, cue: 'Active water or leak risk' },
  { pattern: /\bcrosswalk|pedestrian\b/i, cue: 'Pedestrian safety concern' },
  { pattern: /\bnight|dark\b/i, cue: 'Visibility or lighting concern' },
];

export function extractSafetyCues(description: string): string[] {
  const cues = new Set<string>();
  for (const { pattern, cue } of SAFETY_PATTERNS) {
    if (pattern.test(description)) cues.add(cue);
  }
  return [...cues].slice(0, 5);
}

export function inferCategory(description: string, categoryHint?: string): {
  category: CivicCategory;
  confidence: number;
  rationale: string;
} {
  const text = description.toLowerCase();
  if (text.includes('pothole') || text.includes('road') || text.includes('pavement')) {
    return {
      category: 'pothole',
      confidence: 0.91,
      rationale: 'Road or pothole keywords in your description',
    };
  }
  if (text.includes('water') || text.includes('leak') || text.includes('pipe')) {
    return {
      category: 'water_leak',
      confidence: 0.88,
      rationale: 'Water or leak keywords in your description',
    };
  }
  if (text.includes('light') || text.includes('lamp') || text.includes('streetlight')) {
    return {
      category: 'streetlight',
      confidence: 0.85,
      rationale: 'Lighting-related keywords in your description',
    };
  }
  if (text.includes('garbage') || text.includes('waste') || text.includes('trash')) {
    return {
      category: 'garbage',
      confidence: 0.87,
      rationale: 'Waste or garbage keywords in your description',
    };
  }
  if (text.includes('sanitation') || text.includes('sewage')) {
    return {
      category: 'sanitation',
      confidence: 0.84,
      rationale: 'Sanitation keywords in your description',
    };
  }
  if (categoryHint) {
    return {
      category: categoryHint as CivicCategory,
      confidence: 0.6,
      rationale: 'Based on your earlier category selection',
    };
  }
  return {
    category: 'other',
    confidence: 0.45,
    rationale: 'Not enough detail to match a specific category — please confirm',
  };
}

export function inferSeverity(
  description: string,
  safetyCues: string[],
): { severity: CivicSeverity; confidence: number; rationale: string } {
  const text = description.toLowerCase();
  const highSignals =
    safetyCues.length >= 2 ||
    /\b(dangerous|urgent|emergency|injury|accident)\b/i.test(text) ||
    (/\bschool\b/i.test(text) && /\b(pothole|leak|block)\b/i.test(text));

  if (highSignals) {
    return {
      severity: 'high',
      confidence: 0.82,
      rationale: 'Safety-related language or multiple risk cues detected',
    };
  }
  if (/\bminor|small|cosmetic\b/i.test(text)) {
    return {
      severity: 'low',
      confidence: 0.7,
      rationale: 'Issue described as minor or cosmetic',
    };
  }
  return {
    severity: 'medium',
    confidence: 0.65,
    rationale: 'Standard neighborhood issue without urgent safety signals',
  };
}

export function buildSuggestedTitle(description: string, category: CivicCategory): string {
  const trimmed = description.trim();
  if (trimmed.length <= 60) return trimmed;
  const prefix = category.replace('_', ' ');
  return `${prefix.charAt(0).toUpperCase()}${prefix.slice(1)} — ${trimmed.slice(0, 40)}…`;
}

export function buildSummary(description: string): string {
  const trimmed = description.trim();
  return trimmed.length > 200 ? `${trimmed.slice(0, 197)}…` : trimmed;
}

export function buildIntakeExplanation(
  category: CivicCategory,
  severity: CivicSeverity,
  safetyCues: string[],
  categoryRationale: string,
): string {
  const parts = [
    `Suggested **${category.replace('_', ' ')}** because ${categoryRationale.toLowerCase()}.`,
    `Severity set to **${severity}** from your description and any safety cues.`,
  ];
  if (safetyCues.length > 0) {
    parts.push(`Noted: ${safetyCues.join('; ')}.`);
  }
  return parts.join(' ').replace(/\*\*/g, '');
}

export function computeOverallConfidence(category: number, severity: number): number {
  return Math.round(((category + severity) / 2) * 100) / 100;
}
