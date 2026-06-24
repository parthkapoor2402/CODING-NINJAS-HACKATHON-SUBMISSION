import type { RewardEvent } from '@/types';
import type { RewardGrantResult } from '@/domain/reward-eligibility';

const WITHHELD: Record<string, string> = {
  duplicate: 'No points — this matched an existing nearby report. Support the original instead.',
  suspicious_pending: 'Held until extra review clears. We do not reward unverified suspicious filings.',
  pending_verification: 'Submitted successfully. Points unlock after neighbors verify the issue is real.',
  not_verified: 'Not verified yet — raw submissions do not earn redeemable points.',
  rewards_frozen: 'Rewards paused while we review unusual activity on your account.',
};

const EARNED: Record<string, string> = {
  verified_report: 'Neighbors verified your report as a real, useful issue.',
  corroboration: 'You confirmed an issue you could see — strengthens crew prioritization.',
  support_existing: 'You supported an existing report instead of creating duplicate noise.',
  resolution: 'A reported issue you followed was marked fixed.',
  submitted_report: 'Pending — verification required before points count.',
};

export function explainWithheldReason(reason: RewardGrantResult['reason']): string {
  if (!reason) return 'Points not granted for this action.';
  return WITHHELD[reason] ?? 'This action did not qualify for redeemable points.';
}

export function explainRewardEvent(event: RewardEvent): string {
  if (!event.verified) {
    if (event.type === 'submitted_report') return WITHHELD.pending_verification;
    return WITHHELD.not_verified;
  }
  return EARNED[event.type] ?? 'Verified civic contribution.';
}

export function explainTrustForRewards(trustScore: number, minRequired: number): string {
  if (trustScore >= minRequired) {
    return `Your trust score (${trustScore}) meets the ${minRequired}+ threshold for partner perks.`;
  }
  return `Partner perks require trust ${minRequired}+. Yours is ${trustScore} — keep verifying and supporting real issues.`;
}

export function explainVerificationValue(): string {
  return 'Community verification separates real neighborhood problems from noise. Confirm only what you can see — it helps crews and protects reward integrity.';
}
