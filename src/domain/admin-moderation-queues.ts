import type { SuspiciousCase } from '@/types';

export function isAbuseReviewCase(caseItem: SuspiciousCase): boolean {
  if (caseItem.kind === 'velocity' || caseItem.kind === 'reward_farming') return true;
  if (!caseItem.reportId) return true;
  return /velocity|reward abuse|reward farming|account-level/i.test(caseItem.reason);
}

export function isSuspiciousReportCase(caseItem: SuspiciousCase): boolean {
  return !!caseItem.reportId && !isAbuseReviewCase(caseItem);
}

export function partitionModerationCases(cases: SuspiciousCase[]): {
  suspicious: SuspiciousCase[];
  abuse: SuspiciousCase[];
} {
  const suspicious: SuspiciousCase[] = [];
  const abuse: SuspiciousCase[] = [];

  for (const caseItem of cases) {
    if (isAbuseReviewCase(caseItem)) {
      abuse.push(caseItem);
    } else {
      suspicious.push(caseItem);
    }
  }

  return { suspicious, abuse };
}
