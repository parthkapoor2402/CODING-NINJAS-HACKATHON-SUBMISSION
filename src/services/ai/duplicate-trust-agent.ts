import type { DuplicateTrustMetadata, DuplicateTrustPayload } from '@/types/duplicate-trust';
import { invokeAgent } from '@/services/ai/agent-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';
import { analyzeDuplicateTrustLocally } from '@/domain/duplicate-trust-local';

function mapGatewayData(
  data: Record<string, unknown>,
  meta: { auditId: string; requestId: string; model: string; fallbackUsed: boolean },
): DuplicateTrustMetadata {
  return {
    classification: String(data.classification) as DuplicateTrustMetadata['classification'],
    recommendedAction: String(data.recommendedAction) as DuplicateTrustMetadata['recommendedAction'],
    riskScore: Number(data.riskScore ?? 0),
    matches: Array.isArray(data.matches)
      ? (data.matches as Record<string, unknown>[]).map((m) => ({
          reportId: String(m.reportId),
          title: String(m.title ?? ''),
          score: Number(m.score ?? 0),
          distanceM: Number(m.distanceM ?? 0),
          category: String(m.category ?? ''),
          status: String(m.status ?? ''),
          comparisonSummary:
            typeof m.comparisonSummary === 'string' ? m.comparisonSummary : undefined,
        }))
      : [],
    trustSignals: Array.isArray(data.trustSignals) ? data.trustSignals.map(String) : [],
    userMessage: String(data.userMessage ?? ''),
    adminRationale: Array.isArray(data.adminRationale) ? data.adminRationale.map(String) : [],
    comparisonNarrative:
      typeof data.comparisonNarrative === 'string' ? data.comparisonNarrative : undefined,
    rewardEligibility: String(data.rewardEligibility ?? 'full') as DuplicateTrustMetadata['rewardEligibility'],
    supportExistingReportId:
      typeof data.supportExistingReportId === 'string' ? data.supportExistingReportId : undefined,
    auditId: meta.auditId,
    requestId: meta.requestId,
    model: meta.model,
    fallbackUsed: meta.fallbackUsed,
    analyzedAt: new Date().toISOString(),
  };
}

/** Duplicate & Trust Agent — grounded retrieval + scoring via secure gateway or local heuristics. */
export async function analyzeDuplicateTrust(
  payload: DuplicateTrustPayload,
  options?: { actorId?: string },
): Promise<DuplicateTrustMetadata> {
  if (!isAiGatewayEnabled()) {
    return analyzeDuplicateTrustLocally(payload);
  }

  try {
    const response = await invokeAgent<Record<string, unknown>>(
      'duplicate_trust',
      'analyze',
      {
        description: payload.description,
        title: payload.title,
        category: payload.category,
        lat: payload.lat,
        lng: payload.lng,
        reporterId: payload.reporterId,
        mediaFingerprints: payload.mediaFingerprints,
        lowQualityEvidence: payload.lowQualityEvidence,
        textOnlyFallback: payload.textOnlyFallback,
        reportsToday: payload.reportsToday,
        duplicateAttemptsToday: payload.duplicateAttemptsToday,
      },
      {
        trigger: 'report_review_step',
        actor: payload.reporterId
          ? { id: payload.reporterId, role: 'citizen' }
          : options?.actorId
            ? { id: options.actorId, role: 'citizen' }
            : undefined,
      },
    );

    if (!response.data) {
      return analyzeDuplicateTrustLocally(payload);
    }

    return mapGatewayData(response.data, {
      auditId: response.auditId,
      requestId: response.requestId,
      model: response.model,
      fallbackUsed: response.fallbackUsed,
    });
  } catch {
    return analyzeDuplicateTrustLocally(payload);
  }
}

export function duplicateTrustToDraftUpdates(result: DuplicateTrustMetadata): {
  duplicateWarning?: { reportId: string; score: number };
  suspiciousFlag: {
    flagged: boolean;
    reasons: string[];
    requiresVerification: boolean;
    rewardEligible: boolean;
  };
  rewardEligible: boolean;
} {
  const showDuplicate =
    (result.classification === 'high_confidence_duplicate' ||
      result.classification === 'possible_duplicate') &&
    result.matches[0];

  const duplicateWarning = showDuplicate
    ? { reportId: result.matches[0]!.reportId, score: result.riskScore }
    : undefined;

  const reasons = [...result.trustSignals];
  if (result.comparisonNarrative && showDuplicate) {
    reasons.push(result.comparisonNarrative);
  }
  if (result.classification === 'suspicious_low_signal') {
    reasons.push('Additional verification may apply before full rewards.');
  }

  const requiresVerification =
    result.recommendedAction === 'submit_needs_verification' ||
    result.recommendedAction === 'manual_review' ||
    result.recommendedAction === 'hold_reward_eligibility';

  const rewardEligible =
    result.rewardEligibility === 'full' || result.rewardEligibility === 'reduced';

  return {
    duplicateWarning,
    suspiciousFlag: {
      flagged: reasons.length > 0 || result.classification === 'suspicious_low_signal',
      reasons,
      requiresVerification,
      rewardEligible,
    },
    rewardEligible,
  };
}
