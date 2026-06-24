import { describe, expect, it } from 'vitest';
import { checkRedemptionEligibility } from '@/domain/redemption-eligibility';

describe('redemption-eligibility', () => {
  it('U61: redemption blocked when frozen or below thresholds', () => {
    expect(
      checkRedemptionEligibility({
        userRole: 'citizen',
        redeemablePoints: 100,
        pointsCost: 100,
        trustScore: 75,
        minTrustScore: 70,
        rewardsFrozen: true,
      }).eligible,
    ).toBe(false);

    expect(
      checkRedemptionEligibility({
        userRole: 'citizen',
        redeemablePoints: 50,
        pointsCost: 100,
        trustScore: 75,
        minTrustScore: 70,
        rewardsFrozen: false,
      }).reason,
    ).toBe('insufficient_points');
  });
});
