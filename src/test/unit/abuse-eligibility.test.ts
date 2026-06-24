import { describe, expect, it } from 'vitest';
import { assessAbuseEligibility } from '@/domain/abuse-eligibility';

describe('abuse-eligibility', () => {
  it('U64: velocity abuse freezes rewards', () => {
    const result = assessAbuseEligibility({
      reportsLastHour: 6,
      duplicateAttempts: 0,
      existingAbuseFlags: [],
    });
    expect(result.rewardsFrozen).toBe(true);
    expect(result.newFlags).toContain('velocity_spike');
  });

  it('U65: duplicate abuse reduces eligibility', () => {
    const result = assessAbuseEligibility({
      reportsLastHour: 1,
      duplicateAttempts: 4,
      existingAbuseFlags: [],
    });
    expect(result.rewardsFrozen).toBe(false);
    expect(result.eligibilityMultiplier).toBe(0.5);
    expect(result.newFlags).toContain('duplicate_abuse');
  });
});
