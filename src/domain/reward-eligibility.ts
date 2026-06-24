import type { UserRole } from '@/types';

export type RewardActionType =
  | 'verified_report'
  | 'corroboration'
  | 'support_existing'
  | 'resolution'
  | 'submitted_report';

export const POINTS_VERIFIED_REPORT = 50;
export const POINTS_CORROBORATION = 25;
export const POINTS_SUPPORT_EXISTING = 15;
export const POINTS_RESOLUTION = 30;
export const YOUTH_MAX_CORROBORATION_POINTS = 10;

export interface RewardGrantInput {
  action: RewardActionType;
  verified: boolean;
  duplicateRisk?: number;
  suspiciousFlagged?: boolean;
  isDuplicateSubmission?: boolean;
  userRole?: UserRole;
  abuseFrozen?: boolean;
}

export interface RewardGrantResult {
  grant: boolean;
  points: number;
  verified: boolean;
  reason?: string;
}

export function evaluateRewardGrant(input: RewardGrantInput): RewardGrantResult {
  if (input.abuseFrozen) {
    return { grant: false, points: 0, verified: false, reason: 'rewards_frozen' };
  }

  if (input.isDuplicateSubmission || (input.duplicateRisk ?? 0) >= 70) {
    return { grant: false, points: 0, verified: false, reason: 'duplicate' };
  }

  if (input.suspiciousFlagged && !input.verified) {
    return { grant: false, points: 0, verified: false, reason: 'suspicious_pending' };
  }

  if (input.action === 'submitted_report') {
    return {
      grant: true,
      points: POINTS_VERIFIED_REPORT,
      verified: false,
      reason: 'pending_verification',
    };
  }

  if (!input.verified) {
    return { grant: false, points: 0, verified: false, reason: 'not_verified' };
  }

  let points = 0;
  switch (input.action) {
    case 'verified_report':
      points = POINTS_VERIFIED_REPORT;
      break;
    case 'corroboration':
      points = POINTS_CORROBORATION;
      break;
    case 'support_existing':
      points = POINTS_SUPPORT_EXISTING;
      break;
    case 'resolution':
      points = POINTS_RESOLUTION;
      break;
    default:
      points = 0;
  }

  if (input.userRole === 'youth' && (input.action === 'corroboration' || input.action === 'support_existing')) {
    points = Math.min(points, YOUTH_MAX_CORROBORATION_POINTS);
  }

  return { grant: points > 0, points, verified: true };
}

export function sumRedeemablePoints(
  events: Array<{ points: number; verified: boolean }>,
): number {
  return events.filter((e) => e.verified).reduce((sum, e) => sum + e.points, 0);
}
