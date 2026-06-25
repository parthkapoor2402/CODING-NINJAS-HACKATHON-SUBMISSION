import { buildVisionMessages, grokChatCompletion, TEXT_MODEL } from './grok-provider.ts';
import {
  buildCategorizeUserPrompt,
  buildSeverityUserPrompt,
  buildSummarizeUserPrompt,
  CATEGORIZE_SYSTEM_PROMPT,
  DUPLICATE_SYSTEM_PROMPT,
  SEVERITY_SYSTEM_PROMPT,
  SUMMARIZE_SYSTEM_PROMPT,
} from './prompts.ts';
import {
  parseModelJson,
  validateCategorizeOutput,
  validateDuplicateOutput,
  validateReportCopyOutput,
  validateSeverityOutput,
  validateSummarizeOutput,
} from './validator.ts';
import type {
  CategorizeInput,
  DuplicateInput,
  ModelExecutionResult,
  SeverityInput,
} from './mock-provider.ts';

async function runGrokJson(
  messages: ReturnType<typeof buildVisionMessages>,
  model?: string,
): Promise<Record<string, unknown>> {
  const raw = await grokChatCompletion(messages, { json: true, model });
  return parseModelJson(raw);
}

export async function grokCategorize(input: CategorizeInput): Promise<ModelExecutionResult> {
  const messages = buildVisionMessages(
    CATEGORIZE_SYSTEM_PROMPT,
    buildCategorizeUserPrompt(input.description, input.categoryHint),
    input.imageUrl,
  );
  const parsed = await runGrokJson(messages);
  const validated = validateCategorizeOutput(parsed);
  return {
    data: validated,
    confidence: validated.confidence,
    model: 'grok-vision',
  };
}

export async function grokEstimateSeverity(input: SeverityInput): Promise<ModelExecutionResult> {
  const messages = buildVisionMessages(
    SEVERITY_SYSTEM_PROMPT,
    buildSeverityUserPrompt(input.description, input.categoryHint ?? 'other'),
    input.imageUrl,
  );
  const parsed = await runGrokJson(messages);
  const validated = validateSeverityOutput(parsed);
  return {
    data: validated,
    confidence: validated.confidence,
    model: 'grok-vision',
  };
}

export async function grokDetectDuplicateRisk(input: DuplicateInput): Promise<ModelExecutionResult> {
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
  const parsed = parseModelJson(raw);
  const validated = validateDuplicateOutput(parsed);
  return {
    data: validated,
    confidence: validated.riskScore / 100,
    model: 'grok-text',
  };
}

export async function grokSummarize(description: string): Promise<ModelExecutionResult> {
  const raw = await grokChatCompletion(
    [
      { role: 'system', content: SUMMARIZE_SYSTEM_PROMPT },
      { role: 'user', content: buildSummarizeUserPrompt(description) },
    ],
    { json: true, model: TEXT_MODEL },
  );
  const parsed = parseModelJson(raw);
  const summary = validateSummarizeOutput(parsed, description);
  return { data: { summary }, confidence: null, model: 'grok-text' };
}

export async function grokGenerateCopy(
  description: string,
  category?: string,
  imageUrl?: string,
): Promise<ModelExecutionResult> {
  const messages = buildVisionMessages(
    SUMMARIZE_SYSTEM_PROMPT,
    buildSummarizeUserPrompt(description, category),
    imageUrl,
  );
  const parsed = await runGrokJson(messages, TEXT_MODEL);
  const validated = validateReportCopyOutput(parsed, description);
  return { data: validated, confidence: null, model: 'grok-vision' };
}
