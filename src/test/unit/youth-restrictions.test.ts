import { describe, expect, it } from 'vitest';
import {
  canYouthRedeem,
  getYouthPointCap,
  toFamilySafeContributions,
} from '@/domain/youth-restrictions';
import { evaluateRewardGrant } from '@/domain/reward-eligibility';
import type { RewardEvent } from '@/types';

describe('youth-restrictions', () => {
  it('U62: youth cannot redeem rewards', () => {
    expect(canYouthRedeem('youth')).toBe(false);
    expect(canYouthRedeem('parent')).toBe(true);
    expect(canYouthRedeem('citizen')).toBe(true);
  });

  it('U63: youth support credit capped', () => {
    const cap = getYouthPointCap('youth');
    const grant = evaluateRewardGrant({
      action: 'support_existing',
      verified: true,
      userRole: 'youth',
    });
    expect(cap).toBe(10);
    expect(grant.points).toBeLessThanOrEqual(cap!);
  });

  it('U66: family-safe contributions hide sensitive labels for youth', () => {
    const events: RewardEvent[] = [
      {
        id: 'r1',
        userId: 'user-youth-1',
        type: 'corroboration',
        points: 10,
        reportId: 'report-secret',
        verified: true,
        createdAt: '2026-06-01T00:00:00Z',
      },
    ];
    const safe = toFamilySafeContributions(events, 'youth');
    expect(safe[0].label).toMatch(/helped confirm/i);
    expect(safe[0].label).not.toContain('report-secret');
  });
});
