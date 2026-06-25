export const CIVIC_CATEGORIES = [
  'pothole',
  'water_leak',
  'streetlight',
  'garbage',
  'sanitation',
  'infrastructure',
  'other',
] as const;

export const CATEGORIZE_SYSTEM_PROMPT = `You classify civic infrastructure issues for a neighborhood reporting app.
Return JSON only: {"category":"<one of: pothole|water_leak|streetlight|garbage|sanitation|infrastructure|other>","confidence":0.0-1.0,"rationale":"one short sentence"}
Use citizen language. If uncertain, use "other" with lower confidence.`;

export const SEVERITY_SYSTEM_PROMPT = `You assess civic issue severity for dispatch prioritization.
Return JSON only: {"severity":"low|medium|high","confidence":0.0-1.0,"rationale":"one short citizen-friendly sentence"}
High = safety risk, school zones, blocking traffic, active water leak. Low = cosmetic/minor.`;

export const SUMMARIZE_SYSTEM_PROMPT = `You write concise civic report copy for citizens.
Return JSON only: {"title":"max 60 chars","summary":"2-3 sentences, factual, no blame","description":"slightly longer detail for crews"}
Tone: calm, specific, actionable. No hashtags or emojis.`;

export const DUPLICATE_SYSTEM_PROMPT = `You estimate duplicate-report risk for nearby civic issues.
Return JSON only: {"riskScore":0-100,"matches":[{"reportId":"string","score":0-100,"distanceM":number}]}
High risk when same category + similar description + close location.`;

export function buildCategorizeUserPrompt(description: string, categoryHint?: string): string {
  return `Description: ${description}
${categoryHint ? `User hint category: ${categoryHint}` : ''}
Classify this civic issue.`;
}

export function buildSeverityUserPrompt(description: string, category: string): string {
  return `Category: ${category}
Description: ${description}
Estimate severity.`;
}

export function buildSummarizeUserPrompt(description: string, category?: string): string {
  return `Category: ${category ?? 'unknown'}
Description: ${description}
Write civic report copy.`;
}

export const INTAKE_SYSTEM_PROMPT = `You analyze citizen civic issue reports and return structured intake suggestions.
Return JSON only:
{
  "category":"pothole|water_leak|streetlight|garbage|sanitation|infrastructure|other",
  "categoryConfidence":0.0-1.0,
  "categoryRationale":"one short sentence",
  "severity":"low|medium|high",
  "severityConfidence":0.0-1.0,
  "severityRationale":"one short citizen-friendly sentence",
  "suggestedTitle":"max 60 chars",
  "summary":"2-3 concise sentences for crews",
  "safetyCues":["short plain-language risk cues"],
  "explanation":"2-3 sentences explaining why you suggested category and severity — calm, no blame"
}
Use citizen language. If uncertain on category, use "other" with lower confidence.`;

export function buildIntakeUserPrompt(
  description: string,
  categoryHint?: string,
  hasVideo?: boolean,
): string {
  return `Description: ${description}
${categoryHint ? `User hint category: ${categoryHint}` : ''}
${hasVideo ? 'User attached video evidence (analyze description primarily).' : ''}
Analyze this report and suggest structured intake fields.`;
}
