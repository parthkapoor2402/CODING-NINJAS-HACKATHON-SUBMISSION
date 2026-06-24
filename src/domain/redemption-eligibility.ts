import type { UserRole } from '@/types';
import { canYouthRedeem } from '@/domain/youth-restrictions';

export interface RedemptionCheckInput {
  userRole: UserRole;
  redeemablePoints: number;
  pointsCost: number;
  trustScore: number;
  minTrustScore: number;
  rewardsFrozen: boolean;
}

export interface RedemptionCheckResult {
  eligible: boolean;
  reason?: string;
}

export function explainRedemptionBlock(reason?: string): string {
  const copy: Record<string, string> = {
    youth_restricted: 'Youth accounts cannot redeem partner perks — a parent or guardian manages family rewards.',
    rewards_frozen: 'Redemption paused while unusual activity is reviewed.',
    trust_too_low: 'Your trust score is below the perk threshold. Keep verifying real issues.',
    insufficient_points: 'Not enough verified points yet — pending submissions do not count.',
    already_redeemed: 'You have already redeemed this perk.',
  };
  return copy[reason ?? ''] ?? 'Not eligible to redeem right now.';
}

export function checkRedemptionEligibility(input: RedemptionCheckInput): RedemptionCheckResult {
  if (!canYouthRedeem(input.userRole)) {
    return { eligible: false, reason: 'youth_restricted' };
  }
  if (input.rewardsFrozen) {
    return { eligible: false, reason: 'rewards_frozen' };
  }
  if (input.trustScore < input.minTrustScore) {
    return { eligible: false, reason: 'trust_too_low' };
  }
  if (input.redeemablePoints < input.pointsCost) {
    return { eligible: false, reason: 'insufficient_points' };
  }
  return { eligible: true };
}
