import { findLocalDuplicateMatches } from '@/domain/duplicate-detection';
import { hasLowQualityWarning } from '@/features/reporting/report-media';
import type {
  DuplicateClassification,
  DuplicateTrustAction,
  DuplicateTrustMetadata,
  DuplicateTrustPayload,
  RewardEligibilityTier,
} from '@/types/duplicate-trust';
import { services } from '@/services/registry';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s*:\s*/i,
  /you\s+are\s+now\s+/i,
  /<script/i,
];

function classifyFromScore(topScore: number, trustSuspicious: boolean): DuplicateClassification {
  if (trustSuspicious && topScore < 50) return 'suspicious_low_signal';
  if (topScore >= 75) return 'high_confidence_duplicate';
  if (topScore >= 50) return 'possible_duplicate';
  if (trustSuspicious) return 'suspicious_low_signal';
  return 'likely_unique';
}

function resolveAction(
  classification: DuplicateClassification,
  opts: { velocitySpike: boolean; duplicateAbuse: boolean; promptInjection: boolean; hasMatch: boolean },
): DuplicateTrustAction {
  if (opts.velocitySpike || opts.duplicateAbuse || opts.promptInjection) return 'manual_review';
  if (
    (classification === 'high_confidence_duplicate' || classification === 'possible_duplicate') &&
    opts.hasMatch
  ) {
    return 'support_existing';
  }
  if (classification === 'suspicious_low_signal') {
    return opts.velocitySpike ? 'hold_reward_eligibility' : 'submit_needs_verification';
  }
  return 'submit_normally';
}

function resolveRewardEligibility(
  action: DuplicateTrustAction,
  classification: DuplicateClassification,
): RewardEligibilityTier {
  if (action === 'hold_reward_eligibility' || action === 'manual_review') return 'hold';
  if (classification === 'high_confidence_duplicate') return 'reduced';
  if (classification === 'suspicious_low_signal') return 'none';
  if (classification === 'possible_duplicate') return 'reduced';
  return 'full';
}

function buildUserMessage(
  classification: DuplicateClassification,
  topTitle?: string,
): string {
  switch (classification) {
    case 'high_confidence_duplicate':
      return topTitle
        ? `A similar report is already open nearby (${topTitle}). Supporting it helps crews respond faster — your voice still matters.`
        : 'A similar open report may already exist nearby. Consider supporting it before filing again.';
    case 'possible_duplicate':
      return 'This might overlap with a nearby open report. Supporting the existing issue can be faster than starting a new thread.';
    case 'suspicious_low_signal':
      return 'We need a bit more detail or evidence before routing this for full rewards. You can still submit — extra verification may apply.';
    default:
      return 'This looks like a new issue for your ward. Submit when you are ready.';
  }
}

/** Client-side duplicate & trust analysis when gateway is disabled. */
export async function analyzeDuplicateTrustLocally(
  payload: DuplicateTrustPayload,
): Promise<DuplicateTrustMetadata> {
  const fullDescription = `${payload.title ?? ''} ${payload.description}`.trim();
  const localMatches = await findLocalDuplicateMatches({
    description: fullDescription,
    category: payload.category as import('@/types').IssueCategory,
    lat: payload.lat,
    lng: payload.lng,
  });

  const openNearby = await services.reports.findNearby(payload.lat, payload.lng, 250);
  const titleById = new Map(
    openNearby.map((r) => [r.id, r.description.split('\n')[0]?.slice(0, 60) ?? r.description.slice(0, 60)]),
  );

  const matches = localMatches.map((m) => ({
    reportId: m.reportId,
    title: titleById.get(m.reportId) ?? 'Nearby report',
    score: m.score,
    distanceM: m.distanceM,
    category: payload.category,
    status: openNearby.find((r) => r.id === m.reportId)?.status ?? 'submitted',
  }));

  const signals: string[] = [];
  const fullText = fullDescription;

  if (INJECTION_PATTERNS.some((p) => p.test(fullText))) {
    signals.push('Unusual instruction-like text detected — sanitized for review');
  }

  const reportsToday = payload.reportsToday ?? 0;
  if (reportsToday >= 3) signals.push(`${reportsToday} reports from this account today`);
  if (reportsToday >= 5) signals.push('High submission velocity');

  const dupAttempts = payload.duplicateAttemptsToday ?? 0;
  if (dupAttempts >= 2) signals.push('Multiple nearby duplicate checks today');

  if (payload.lowQualityEvidence) signals.push('Low-resolution or weak evidence');
  if (payload.textOnlyFallback && !payload.mediaFingerprints?.length) {
    signals.push('Text-only report without photo or video');
  }
  if (fullText.length < 20) signals.push('Very short description');

  const fingerprints = payload.mediaFingerprints ?? [];
  const names = fingerprints.map((f) => `${f.fileName}:${f.sizeBytes}`);
  if (names.length !== new Set(names).size) {
    signals.push('Repeated identical media fingerprints in draft');
  }

  const velocitySpike = reportsToday >= 5;
  const duplicateAbuse = dupAttempts >= 3;
  const promptInjection = INJECTION_PATTERNS.some((p) => p.test(fullText));
  const lowSignal =
    payload.lowQualityEvidence ||
    (payload.textOnlyFallback && fingerprints.length === 0) ||
    fullText.length < 15;
  const trustSuspicious = velocitySpike || duplicateAbuse || promptInjection || lowSignal;

  const topScore = matches[0]?.score ?? 0;
  const riskScore = Math.max(topScore, velocitySpike ? 60 : 0, duplicateAbuse ? 70 : 0);
  const classification = classifyFromScore(topScore, trustSuspicious);
  const recommendedAction = resolveAction(classification, {
    velocitySpike,
    duplicateAbuse,
    promptInjection,
    hasMatch: matches.length > 0,
  });
  const rewardEligibility = resolveRewardEligibility(recommendedAction, classification);

  const comparisonNarrative =
    matches[0] != null
      ? `Nearby open report "${matches[0].title}" (${matches[0].distanceM}m away, ${matches[0].score}% similarity) may describe the same issue.`
      : undefined;

  const adminRationale = [
    `Classification: ${classification.replace(/_/g, ' ')}`,
    `Risk score: ${riskScore}/100`,
    `Recommended action: ${recommendedAction.replace(/_/g, ' ')}`,
    ...(matches[0]
      ? [
          `Top match: ${matches[0].reportId} (${matches[0].score}% score, ${matches[0].distanceM}m, ${matches[0].category})`,
        ]
      : []),
    ...signals.map((s) => `Trust signal: ${s}`),
  ];

  return {
    classification,
    recommendedAction,
    riskScore,
    matches,
    trustSignals: signals,
    userMessage: buildUserMessage(classification, matches[0]?.title),
    adminRationale,
    comparisonNarrative,
    rewardEligibility,
    supportExistingReportId:
      recommendedAction === 'support_existing' ? matches[0]?.reportId : undefined,
    model: 'mock-rules',
    fallbackUsed: false,
    analyzedAt: new Date().toISOString(),
  };
}

export function duplicateTrustFromDraft(
  draft: import('@/types/reporting').ReportDraft,
  options?: { reportsToday?: number; duplicateAttemptsToday?: number; reporterId?: string },
): DuplicateTrustPayload {
  return {
    description: draft.description,
    title: draft.title,
    category: draft.category ?? 'other',
    lat: draft.location?.lat ?? 0,
    lng: draft.location?.lng ?? 0,
    reporterId: options?.reporterId,
    mediaFingerprints: draft.mediaAttachments.map((a) => ({
      fileName: a.fileName,
      sizeBytes: a.sizeBytes,
      mimeType: a.mimeType,
    })),
    lowQualityEvidence: hasLowQualityWarning(draft.mediaAttachments),
    textOnlyFallback: draft.textOnlyFallback,
    reportsToday: options?.reportsToday,
    duplicateAttemptsToday: options?.duplicateAttemptsToday,
  };
}
