import type { IssueCategory, Severity } from '@/types';
import type { ReportIntakeMetadata, ReportIntakePayload } from '@/types/report-intake';
import { invokeAgent } from '@/services/ai/agent-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';
import { analyzeReportIntakeLocally } from '@/domain/report-intake-heuristics';

function mapGatewayData(
  data: Record<string, unknown>,
  meta: { auditId: string; requestId: string; model: string; fallbackUsed: boolean },
): ReportIntakeMetadata {
  const confidence = (data.confidence as Record<string, number>) ?? {};
  return {
    auditId: meta.auditId,
    requestId: meta.requestId,
    model: meta.model,
    fallbackUsed: meta.fallbackUsed,
    analyzedAt: new Date().toISOString(),
    category: String(data.category) as IssueCategory,
    severity: String(data.severity) as Severity,
    suggestedTitle: String(data.suggestedTitle ?? ''),
    summary: String(data.summary ?? ''),
    safetyCues: Array.isArray(data.safetyCues) ? data.safetyCues.map(String) : [],
    confidence: {
      category: Number(confidence.category ?? 0.5),
      severity: Number(confidence.severity ?? 0.5),
      overall: Number(confidence.overall ?? 0.5),
    },
    explanation: String(data.explanation ?? ''),
    categoryRationale:
      typeof data.categoryRationale === 'string' ? data.categoryRationale : undefined,
    severityRationale:
      typeof data.severityRationale === 'string' ? data.severityRationale : undefined,
  };
}

/** Report Intake Agent — single structured analysis via secure gateway or local heuristics. */
export async function analyzeReportIntake(
  payload: ReportIntakePayload,
): Promise<ReportIntakeMetadata> {
  if (!isAiGatewayEnabled()) {
    return analyzeReportIntakeLocally(payload);
  }

  const response = await invokeAgent<Record<string, unknown>>(
    'report_intake',
    'analyze',
    {
      description: payload.description,
      categoryHint: payload.categoryHint,
      imageUrl: payload.imageUrl,
      hasVideo: payload.hasVideo,
      location: payload.location,
    },
    { trigger: 'report_details_step' },
  );

  if (!response.data) {
    return analyzeReportIntakeLocally(payload);
  }

  return mapGatewayData(response.data, {
    auditId: response.auditId,
    requestId: response.requestId,
    model: response.model,
    fallbackUsed: response.fallbackUsed,
  });
}

export function intakeToSuggestions(intake: ReportIntakeMetadata) {
  return {
    category: intake.category,
    categoryConfidence: intake.confidence.category,
    severity: intake.severity,
    severityConfidence: intake.confidence.severity,
    severityRationale: intake.severityRationale,
    summary: intake.summary,
    suggestedTitle: intake.suggestedTitle,
    safetyCues: intake.safetyCues,
    explanation: intake.explanation,
    intakeMetadata: intake,
  };
}
