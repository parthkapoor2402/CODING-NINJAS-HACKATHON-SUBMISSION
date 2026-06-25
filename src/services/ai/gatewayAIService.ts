import type { IssueCategory, Severity } from '@/types';
import type { AIService } from '@/services/ai/types';
import { invokeAgent } from '@/services/ai/agent-client';

/** AIService implementation that routes all model work through the secure server gateway. */
export const gatewayAIService: AIService = {
  async categorize(input) {
    const res = await invokeAgent<{ category: IssueCategory; confidence: number }>(
      'report_intake',
      'categorize',
      {
        description: input.description,
        categoryHint: input.categoryHint,
        imageUrl: input.imageUrl,
        location: input.location,
      },
      { trigger: 'report_details_step' },
    );
    if (!res.data) throw new Error('Empty gateway categorization');
    return { category: res.data.category, confidence: res.data.confidence };
  },

  async estimateSeverity(input) {
    const res = await invokeAgent<{
      severity: Severity;
      confidence: number;
      rationale?: string;
    }>(
      'report_intake',
      'estimate_severity',
      {
        description: input.description,
        categoryHint: input.categoryHint,
        imageUrl: input.imageUrl,
        location: input.location,
      },
      { trigger: 'report_details_step' },
    );
    if (!res.data) throw new Error('Empty gateway severity');
    return {
      severity: res.data.severity,
      confidence: res.data.confidence,
      rationale: res.data.rationale,
    };
  },

  async detectDuplicateRisk(input) {
    const res = await invokeAgent<{
      riskScore: number;
      matches: { reportId: string; score: number; distanceM: number }[];
    }>(
      'duplicate_trust',
      'detect_risk',
      {
        description: input.description,
        category: input.category,
        lat: input.lat,
        lng: input.lng,
        imageHash: input.imageHash,
      },
      { trigger: 'duplicate_check' },
    );
    if (!res.data) throw new Error('Empty gateway duplicate result');
    return {
      riskScore: res.data.riskScore,
      matches: res.data.matches,
    };
  },

  async summarize(description) {
    const res = await invokeAgent<{ summary: string }>(
      'report_intake',
      'summarize',
      { description },
      { trigger: 'report_summarize' },
    );
    if (!res.data?.summary) return description;
    return res.data.summary;
  },
};

export async function gatewayGenerateReportCopy(
  description: string,
  category?: IssueCategory,
  imageUrl?: string,
): Promise<{ title: string; summary: string; description: string }> {
  const res = await invokeAgent<{ title: string; summary: string; description: string }>(
    'report_intake',
    'generate_copy',
    { description, categoryHint: category, imageUrl },
    { trigger: 'report_copy_generation' },
  );
  if (!res.data) {
    return { title: description.slice(0, 60), summary: description, description };
  }
  return res.data;
}
