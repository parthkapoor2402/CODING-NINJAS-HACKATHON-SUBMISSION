import { describe, expect, it } from 'vitest';
import {
  countNudgesForReport,
  countRecentNudges,
  shouldSuppressNudge,
} from '@/domain/verification-nudges';

describe('verification nudges', () => {
  it('suppresses after per-report nudge cap', () => {
    const history = [
      { reportId: 'report-003', shownAt: new Date().toISOString(), action: 'shown' as const },
      { reportId: 'report-003', shownAt: new Date().toISOString(), action: 'shown' as const },
    ];
    expect(countNudgesForReport('report-003', history)).toBe(2);
    const result = shouldSuppressNudge('report-003', { history, snoozedUntil: {}, recentVerifyCount24h: 0 });
    expect(result.suppress).toBe(true);
  });

  it('suppresses snoozed reports', () => {
    const until = new Date(Date.now() + 60_000).toISOString();
    const result = shouldSuppressNudge('report-003', {
      history: [],
      snoozedUntil: { 'report-003': until },
      recentVerifyCount24h: 0,
    });
    expect(result.suppress).toBe(true);
  });

  it('allows nudge when under caps', () => {
    const result = shouldSuppressNudge('report-003', {
      history: [],
      snoozedUntil: {},
      recentVerifyCount24h: 1,
    });
    expect(result.suppress).toBe(false);
  });

  it('counts recent nudges in 24h window', () => {
    const history = [
      { reportId: 'a', shownAt: new Date().toISOString(), action: 'shown' as const },
      { reportId: 'b', shownAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), action: 'shown' as const },
    ];
    expect(countRecentNudges(history)).toBe(1);
  });
});
