import { categoryMismatchHint } from '@/domain/duplicate-detection';
import type { ReportDraft } from '@/types/reporting';

export interface SuspiciousAssessment {
  flagged: boolean;
  reasons: string[];
  requiresVerification: boolean;
  rewardEligible: boolean;
}

export function assessSuspiciousReport(
  draft: ReportDraft,
  options?: {
    recentReportCount?: number;
    duplicateRiskScore?: number;
  },
): SuspiciousAssessment {
  const reasons: string[] = [];
  const recentCount = options?.recentReportCount ?? 0;
  const duplicateRisk = options?.duplicateRiskScore ?? 0;

  if (draft.mediaAttachments.some((a) => a.lowQualityWarning)) {
    reasons.push('Evidence may be too low-resolution for reliable verification.');
  }

  if (draft.mediaAttachments.length === 0 && draft.textOnlyFallback) {
    reasons.push('No photo or video attached — neighbors will rely on your description alone.');
  }

  if (
    draft.category &&
    draft.description.trim().length >= 10 &&
    categoryMismatchHint(draft.category, draft.description)
  ) {
    reasons.push('Description may not match the selected category — please double-check.');
  }

  if (draft.description.trim().length < 20 && draft.mediaAttachments.length === 0) {
    reasons.push('Very little detail provided for crews to act on.');
  }

  if (recentCount >= 3) {
    reasons.push('Several reports from your account today — extra verification may apply.');
  }

  if (duplicateRisk >= 70) {
    reasons.push('This may duplicate an existing nearby report — rewards apply only to unique verified issues.');
  }

  const flagged = reasons.length > 0;
  const requiresVerification = flagged || duplicateRisk >= 70;

  return {
    flagged,
    reasons,
    requiresVerification,
    rewardEligible: !requiresVerification && draft.mediaAttachments.length > 0,
  };
}
