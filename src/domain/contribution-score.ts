import type { RewardEvent } from '@/types';
import { evaluateRewardGrant, type RewardActionType } from '@/domain/reward-eligibility';

const ACTION_WEIGHT: Record<string, number> = {
  verified_report: 10,
  corroboration: 5,
  support_existing: 4,
  resolution: 8,
  submitted_report: 0,
};

export function contributionFromRewards(events: RewardEvent[]): number {
  return events
    .filter((e) => e.verified)
    .reduce((sum, e) => sum + (ACTION_WEIGHT[e.type] ?? 1), 0);
}

export function contributionFromQualifyingActions(
  actions: Array<{
    action: RewardActionType;
    verified: boolean;
    isDuplicateSubmission?: boolean;
    suspiciousFlagged?: boolean;
  }>,
): number {
  let total = 0;
  for (const a of actions) {
    const grant = evaluateRewardGrant({
      action: a.action,
      verified: a.verified,
      isDuplicateSubmission: a.isDuplicateSubmission,
      suspiciousFlagged: a.suspiciousFlagged,
    });
    if (grant.grant && grant.verified) {
      total += ACTION_WEIGHT[a.action] ?? 1;
    }
  }
  return total;
}
