import type { AIService } from '@/services/ai/types';
import type { IssueCategory, Severity } from '@/types';
import {
  buildCategorizeUserPrompt,
  buildSeverityUserPrompt,
  buildSummarizeUserPrompt,
  CATEGORIZE_SYSTEM_PROMPT,
  CIVIC_CATEGORIES,
  DUPLICATE_SYSTEM_PROMPT,
  SEVERITY_SYSTEM_PROMPT,
  SUMMARIZE_SYSTEM_PROMPT,
} from '@/services/ai/prompts';
import {
  fileToDataUrl,
  grokChatCompletion,
  TEXT_MODEL,
  type GrokMessage,
} from '@/services/ai/grok-client';

function parseJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Grok response');
  return JSON.parse(jsonMatch[0]) as T;
}

function asCategory(value: string): IssueCategory {
  return CIVIC_CATEGORIES.includes(value as IssueCategory) ? (value as IssueCategory) : 'other';
}

function asSeverity(value: string): Severity {
  if (value === 'low' || value === 'high') return value;
  return 'medium';
}

async function buildVisionMessages(
  system: string,
  text: string,
  imageDataUrl?: string,
): Promise<GrokMessage[]> {
  const userContent = imageDataUrl
    ? [
        { type: 'text' as const, text },
        { type: 'image_url' as const, image_url: { url: imageDataUrl, detail: 'low' as const } },
      ]
    : text;

  return [
    { role: 'system', content: system },
    { role: 'user', content: userContent },
  ];
}

async function fetchImageDataUrl(imageUrl?: string): Promise<string | undefined> {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('data:')) return imageUrl;
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return fileToDataUrl(new File([blob], 'evidence.jpg', { type: blob.type || 'image/jpeg' }));
  } catch {
    return undefined;
  }
}

export const grokAIService: AIService = {
  async categorize(input) {
    const imageDataUrl = await fetchImageDataUrl(input.imageUrl);
    const messages = await buildVisionMessages(
      CATEGORIZE_SYSTEM_PROMPT,
      buildCategorizeUserPrompt(input.description, input.categoryHint),
      imageDataUrl,
    );
    const raw = await grokChatCompletion(messages, { json: true });
    const parsed = parseJson<{ category: string; confidence: number }>(raw);
    return {
      category: asCategory(parsed.category),
      confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.7)),
    };
  },

  async estimateSeverity(input) {
    const imageDataUrl = await fetchImageDataUrl(input.imageUrl);
    const messages = await buildVisionMessages(
      SEVERITY_SYSTEM_PROMPT,
      buildSeverityUserPrompt(input.description, input.categoryHint ?? 'other'),
      imageDataUrl,
    );
    const raw = await grokChatCompletion(messages, { json: true });
    const parsed = parseJson<{ severity: string; confidence: number; rationale?: string }>(raw);
    return {
      severity: asSeverity(parsed.severity),
      confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.7)),
      rationale: parsed.rationale,
    };
  },

  async detectDuplicateRisk(input) {
    const raw = await grokChatCompletion(
      [
        { role: 'system', content: DUPLICATE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Category: ${input.category}
Description: ${input.description}
Location: ${input.lat}, ${input.lng}
Estimate duplicate risk against nearby open reports.`,
        },
      ],
      { json: true, model: TEXT_MODEL },
    );
    const parsed = parseJson<{
      riskScore: number;
      matches: { reportId: string; score: number; distanceM: number }[];
    }>(raw);
    return {
      riskScore: Math.min(100, Math.max(0, parsed.riskScore ?? 0)),
      matches: parsed.matches ?? [],
    };
  },

  async summarize(description) {
    const raw = await grokChatCompletion(
      [
        { role: 'system', content: SUMMARIZE_SYSTEM_PROMPT },
        { role: 'user', content: buildSummarizeUserPrompt(description) },
      ],
      { json: true, model: TEXT_MODEL },
    );
    const parsed = parseJson<{ title?: string; summary?: string; description?: string }>(raw);
    return parsed.summary ?? parsed.description ?? description;
  },
};

/** Extended Grok helpers for full report assist */
export async function grokGenerateReportCopy(
  description: string,
  category?: IssueCategory,
  imageDataUrl?: string,
): Promise<{ title: string; summary: string; description: string }> {
  const messages = await buildVisionMessages(
    SUMMARIZE_SYSTEM_PROMPT,
    buildSummarizeUserPrompt(description, category),
    imageDataUrl,
  );
  const raw = await grokChatCompletion(messages, { json: true, model: TEXT_MODEL });
  const parsed = parseJson<{ title?: string; summary?: string; description?: string }>(raw);
  return {
    title: parsed.title ?? description.slice(0, 60),
    summary: parsed.summary ?? description,
    description: parsed.description ?? description,
  };
}
