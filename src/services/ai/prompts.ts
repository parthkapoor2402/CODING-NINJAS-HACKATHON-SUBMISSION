import type { IssueCategory } from '@/types';

export const CIVIC_CATEGORIES: IssueCategory[] = [
  'pothole',
  'water_leak',
  'streetlight',
  'garbage',
  'sanitation',
  'infrastructure',
  'other',
];

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

export function buildCategorizeUserPrompt(description: string, categoryHint?: IssueCategory): string {
  return `Description: ${description}
${categoryHint ? `User hint category: ${categoryHint}` : ''}
Classify this civic issue.`;
}

export function buildSeverityUserPrompt(description: string, category: IssueCategory): string {
  return `Category: ${category}
Description: ${description}
Estimate severity.`;
}

export function buildSummarizeUserPrompt(description: string, category?: IssueCategory): string {
  return `Category: ${category ?? 'unknown'}
Citizen notes: ${description}
Generate title and summaries.`;
}
