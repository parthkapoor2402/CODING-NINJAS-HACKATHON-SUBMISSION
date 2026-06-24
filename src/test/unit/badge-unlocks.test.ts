import { describe, expect, it } from 'vitest';
import {
  BADGE_FIRST_REPORT,
  BADGE_DUPLICATE_DEFENDER,
  BADGE_STREAK,
  unlockedBadgeIds,
} from '@/domain/badge-unlocks';

describe('badge-unlocks', () => {
  it('U55: first verified report badge unlocks at one verified report', () => {
    const ids = unlockedBadgeIds({
      verifiedReportCount: 1,
      corroborationCount: 0,
      activityDates: [],
    });
    expect(ids).toContain(BADGE_FIRST_REPORT);
  });

  it('U56: streak badge unlocks at seven-day streak', () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date('2026-06-01T12:00:00Z');
      d.setDate(d.getDate() + i);
      return d.toISOString();
    });
    const ids = unlockedBadgeIds({
      verifiedReportCount: 0,
      corroborationCount: 0,
      activityDates: dates,
    });
    expect(ids).toContain(BADGE_STREAK);
    expect(unlockedBadgeIds({
      verifiedReportCount: 0,
      corroborationCount: 5,
      activityDates: dates,
    })).toContain(BADGE_DUPLICATE_DEFENDER);
  });
});
