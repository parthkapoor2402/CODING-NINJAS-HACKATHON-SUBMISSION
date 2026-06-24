import { describe, expect, it } from 'vitest';
import { computeStreak } from '@/domain/streaks';

describe('streaks', () => {
  it('U57: consecutive days increment streak', () => {
    const dates = [
      '2026-06-01T10:00:00Z',
      '2026-06-02T10:00:00Z',
      '2026-06-03T10:00:00Z',
    ];
    expect(computeStreak(dates)).toBe(3);
  });

  it('U58: missed day resets streak', () => {
    const dates = [
      '2026-06-01T10:00:00Z',
      '2026-06-02T10:00:00Z',
      '2026-06-04T10:00:00Z',
      '2026-06-05T10:00:00Z',
    ];
    expect(computeStreak(dates)).toBe(2);
  });
});
