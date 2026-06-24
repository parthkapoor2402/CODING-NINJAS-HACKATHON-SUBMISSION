import { describe, expect, it } from 'vitest';
import { contributionFromQualifyingActions, contributionFromRewards } from '@/domain/contribution-score';
import type { RewardEvent } from '@/types';

describe('contribution-score', () => {
  it('U51: verified contributions count toward score', () => {
    const events: RewardEvent[] = [
      {
        id: '1',
        userId: 'u1',
        type: 'verified_report',
        points: 50,
        verified: true,
        createdAt: '2026-06-01T00:00:00Z',
      },
      {
        id: '2',
        userId: 'u1',
        type: 'corroboration',
        points: 25,
        verified: true,
        createdAt: '2026-06-02T00:00:00Z',
      },
    ];
    expect(contributionFromRewards(events)).toBe(15);
  });

  it('U52: blocked duplicate/suspicious actions excluded', () => {
    const score = contributionFromQualifyingActions([
      { action: 'verified_report', verified: true, isDuplicateSubmission: true },
      { action: 'verified_report', verified: false, suspiciousFlagged: true },
      { action: 'support_existing', verified: true },
    ]);
    expect(score).toBe(4);
  });
});
