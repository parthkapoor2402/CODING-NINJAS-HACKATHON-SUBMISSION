import { describe, expect, it } from 'vitest';
import { buildSeedReports } from '@/services/mock/seed/reports';
import { seedUsers } from '@/services/mock/seed/users';
import {
  buildOrchestratedVerifyQueue,
  formatConfirmationsLabel,
  formatNearYouLabel,
  isConfidenceSufficient,
  isVerifiableOpportunity,
} from '@/domain/verification-orchestrator';

describe('verification orchestrator', () => {
  const reports = buildSeedReports();
  const parent = seedUsers.find((u) => u.id === 'user-parent-1')!;

  const baseCtx = {
    dismissedIds: [] as string[],
    nudgeContext: { history: [], snoozedUntil: {}, recentVerifyCount24h: 0 },
  };

  it('ranks verifiable opportunities for parent', () => {
    const queue = buildOrchestratedVerifyQueue(reports, parent, baseCtx);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue[0].report.id).toBe('report-003');
    expect(queue[0].nearYouLabel).toMatch(/Near/i);
    expect(queue[0].confirmationsLabel).toMatch(/Needs/);
    expect(queue[0].impactMessage).toMatch(/verification/i);
  });

  it('excludes own reports for citizen', () => {
    const citizen = seedUsers.find((u) => u.id === 'user-citizen-1')!;
    const queue = buildOrchestratedVerifyQueue(reports, citizen, baseCtx);
    expect(queue.every((o) => o.report.reporterId !== citizen.id)).toBe(true);
  });

  it('suppresses when confidence is sufficient', () => {
    const verified = reports.find((r) => r.id === 'report-001')!;
    expect(isConfidenceSufficient(verified)).toBe(true);
    expect(isVerifiableOpportunity(verified, parent, new Set())).toBe(false);
  });

  it('formats UX labels', () => {
    expect(formatNearYouLabel(0.2, 'Park Lane')).toBe('Near you');
    expect(formatConfirmationsLabel(2)).toBe('Needs 2 more confirmations');
    expect(formatConfirmationsLabel(1)).toBe('Needs 1 more confirmation');
  });

  it('applies fatigue suppression via nudge context', () => {
    const history = Array.from({ length: 5 }, (_, i) => ({
      reportId: `r-${i}`,
      shownAt: new Date().toISOString(),
      action: 'shown' as const,
    }));
    const queue = buildOrchestratedVerifyQueue(reports, parent, {
      ...baseCtx,
      nudgeContext: { history, snoozedUntil: {}, recentVerifyCount24h: 0 },
    });
    expect(queue).toHaveLength(0);
  });
});
