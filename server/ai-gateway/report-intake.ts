import type { ReportIntakeResult } from '../../shared/report-intake.ts';
import { buildVisionMessages, grokChatCompletion, TEXT_MODEL } from './grok-provider.ts';
import {
  buildIntakeExplanation,
  buildSuggestedTitle,
  buildSummary,
  extractSafetyCues,
  inferCategory,
  inferSeverity,
} from './intake-heuristics.ts';
import { INTAKE_SYSTEM_PROMPT, buildIntakeUserPrompt } from './prompts.ts';
import { parseModelJson, validateReportIntakeOutput } from './validator.ts';
import type { CategorizeInput, ModelExecutionResult } from './mock-provider.ts';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function heuristicAnalyzeIntake(
  input: CategorizeInput & { hasVideo?: boolean },
): Promise<ModelExecutionResult> {
  await delay(80);
  const safetyCues = extractSafetyCues(input.description);
  const categoryResult = inferCategory(input.description, input.categoryHint);
  const severityResult = inferSeverity(input.description, safetyCues);
  const data = validateReportIntakeOutput(
    {
      category: categoryResult.category,
      categoryConfidence: categoryResult.confidence,
      categoryRationale: categoryResult.rationale,
      severity: severityResult.severity,
      severityConfidence: severityResult.confidence,
      severityRationale: severityResult.rationale,
      suggestedTitle: buildSuggestedTitle(input.description, categoryResult.category),
      summary: buildSummary(input.description),
      safetyCues,
      explanation: buildIntakeExplanation(
        categoryResult.category,
        severityResult.severity,
        safetyCues,
        categoryResult.rationale,
      ),
    },
    input.description,
  );

  return {
    data: data as unknown as Record<string, unknown>,
    confidence: data.confidence.overall,
    model: 'mock-rules',
  };
}

export async function grokAnalyzeIntake(
  input: CategorizeInput & { hasVideo?: boolean },
): Promise<ModelExecutionResult> {
  const messages = buildVisionMessages(
    INTAKE_SYSTEM_PROMPT,
    buildIntakeUserPrompt(input.description, input.categoryHint, input.hasVideo),
    input.imageUrl,
  );
  const raw = await grokChatCompletion(messages, { json: true, model: TEXT_MODEL });
  const parsed = parseModelJson(raw);
  const safetyFromModel = Array.isArray(parsed.safetyCues)
    ? (parsed.safetyCues as unknown[]).map(String)
    : [];
  const mergedCues = [...new Set([...safetyFromModel, ...extractSafetyCues(input.description)])].slice(
    0,
    5,
  );
  const data = validateReportIntakeOutput({ ...parsed, safetyCues: mergedCues }, input.description);
  return {
    data: data as unknown as Record<string, unknown>,
    confidence: data.confidence.overall,
    model: 'grok-vision',
  };
}

export function toReportIntakeResult(data: Record<string, unknown>): ReportIntakeResult {
  return validateReportIntakeOutput(data, String(data.summary ?? ''));
}
