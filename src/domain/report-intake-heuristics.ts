import type { IssueCategory, Severity } from '@/types';
import type { ReportIntakeMetadata, ReportIntakePayload } from '@/types/report-intake';

/** Client-side mirror of server intake heuristics when gateway is disabled. */
export function analyzeReportIntakeLocally(payload: ReportIntakePayload): ReportIntakeMetadata {
  const text = payload.description.toLowerCase();
  const safetyCues: string[] = [];
  if (/\bschool\b/i.test(text)) safetyCues.push('Near a school zone');
  if (/\bdangerous\b/i.test(text)) safetyCues.push('Described as dangerous');
  if (/\btraffic\b/i.test(text)) safetyCues.push('Traffic impact mentioned');
  if (/\bwater|leak\b/i.test(text)) safetyCues.push('Active water or leak risk');

  let category: IssueCategory = 'other';
  let categoryConfidence = 0.45;
  let categoryRationale = 'Not enough detail to match a specific category — please confirm';

  if (text.includes('pothole') || text.includes('road')) {
    category = 'pothole';
    categoryConfidence = 0.91;
    categoryRationale = 'Road or pothole keywords in your description';
  } else if (text.includes('water') || text.includes('leak')) {
    category = 'water_leak';
    categoryConfidence = 0.88;
    categoryRationale = 'Water or leak keywords in your description';
  } else if (text.includes('light')) {
    category = 'streetlight';
    categoryConfidence = 0.85;
    categoryRationale = 'Lighting-related keywords in your description';
  } else if (text.includes('garbage') || text.includes('waste')) {
    category = 'garbage';
    categoryConfidence = 0.87;
    categoryRationale = 'Waste or garbage keywords in your description';
  } else if (payload.categoryHint) {
    category = payload.categoryHint;
    categoryConfidence = 0.6;
    categoryRationale = 'Based on your earlier category selection';
  }

  let severity: Severity = 'medium';
  let severityConfidence = 0.65;
  let severityRationale = 'Standard neighborhood issue without urgent safety signals';
  if (safetyCues.length >= 2 || /\b(dangerous|school)\b/i.test(text)) {
    severity = 'high';
    severityConfidence = 0.82;
    severityRationale = 'Safety-related language or multiple risk cues detected';
  }

  const overall = Math.round(((categoryConfidence + severityConfidence) / 2) * 100) / 100;
  const explanation = [
    `Suggested ${category.replace('_', ' ')} because ${categoryRationale.toLowerCase()}.`,
    `Severity set to ${severity} from your description.`,
    safetyCues.length ? `Noted: ${safetyCues.join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    model: 'mock-rules',
    fallbackUsed: false,
    analyzedAt: new Date().toISOString(),
    category,
    severity,
    suggestedTitle: payload.description.trim().slice(0, 60),
    summary:
      payload.description.trim().length > 200
        ? `${payload.description.trim().slice(0, 197)}…`
        : payload.description.trim(),
    safetyCues,
    confidence: { category: categoryConfidence, severity: severityConfidence, overall },
    explanation,
    categoryRationale,
    severityRationale,
  };
}
