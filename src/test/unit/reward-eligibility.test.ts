import { describe, expect, it } from 'vitest';
import {
  evaluateRewardGrant,
  POINTS_CORROBORATION,
  POINTS_SUPPORT_EXISTING,
  POINTS_VERIFIED_REPORT,
  sumRedeemablePoints,
} from '@/domain/reward-eligibility';

describe('reward-eligibility', () => {
  it('U46: qualifying verified action grants points', () => {
    const result = evaluateRewardGrant({ action: 'verified_report', verified: true });
    expect(result.grant).toBe(true);
    expect(result.points).toBe(POINTS_VERIFIED_REPORT);
    expect(result.verified).toBe(true);
  });

  it('U47: duplicate submission grants zero', () => {
    const result = evaluateRewardGrant({
      action: 'verified_report',
      verified: true,
      isDuplicateSubmission: true,
    });
    expect(result.grant).toBe(false);
    expect(result.points).toBe(0);
    expect(result.reason).toBe('duplicate');
  });

  it('U48: suspicious flagged before validation grants zero', () => {
    const result = evaluateRewardGrant({
      action: 'verified_report',
      verified: false,
      suspiciousFlagged: true,
    });
    expect(result.grant).toBe(false);
    expect(result.points).toBe(0);
    expect(result.reason).toBe('suspicious_pending');
  });

  it('U49: pending submission withholds redeemable points', () => {
    const pending = evaluateRewardGrant({ action: 'submitted_report', verified: false });
    expect(pending.verified).toBe(false);
    expect(sumRedeemablePoints([{ points: pending.points, verified: pending.verified }])).toBe(0);
  });

  it('U50: support existing earns partial credit not full report points', () => {
    const support = evaluateRewardGrant({ action: 'support_existing', verified: true });
    const report = evaluateRewardGrant({ action: 'verified_report', verified: true });
    expect(support.points).toBe(POINTS_SUPPORT_EXISTING);
    expect(support.points).toBeLessThan(report.points);
    expect(support.points).toBeLessThan(POINTS_CORROBORATION);
  });
});
