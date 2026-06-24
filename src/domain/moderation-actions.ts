import type { SuspiciousCase } from '@/types';

export function dismissSuspiciousCase(caseItem: SuspiciousCase): SuspiciousCase {
  return { ...caseItem, status: 'dismissed' };
}

export function resolveSuspiciousCase(caseItem: SuspiciousCase): SuspiciousCase {
  return { ...caseItem, status: 'resolved' };
}

export function startSuspiciousReview(caseItem: SuspiciousCase): SuspiciousCase {
  return { ...caseItem, status: 'reviewing' };
}
