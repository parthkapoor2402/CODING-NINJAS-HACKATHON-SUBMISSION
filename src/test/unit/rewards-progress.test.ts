import { describe, expect, it } from 'vitest';
import { seedBadges } from '@/services/mock/seed/rewards';
import {
  buildBadgeJourney,
  buildNextUnlocks,
  computeBadgeProgress,
  computeLeaderboardInsights,
  weeklyVerifiedContribution,
} from '@/domain/rewards-progress';
import { evaluateCatalog } from '@/domain/reward-catalog';
import { seedCatalog } from '@/services/mock/seed/rewards';

describe('rewards-progress', () => {
  const emptyInput = {
    verifiedReportCount: 0,
    corroborationCount: 0,
    activityDates: [] as string[],
  };

  it('computes badge progress with gap labels', () => {
    const badge = seedBadges.find((b) => b.id === 'badge-verifier')!;
    const progress = computeBadgeProgress(badge, {
      verifiedReportCount: 1,
      corroborationCount: 8,
      activityDates: [],
    });
    expect(progress.progressPercent).toBe(80);
    expect(progress.gapLabel).toBe('2 confirmations away');
  });

  it('builds journey groups including follow-through', () => {
    const groups = buildBadgeJourney(seedBadges, emptyInput, 0);
    expect(groups.map((g) => g.id)).toEqual([
      'getting-started',
      'neighborhood-helper',
      'trusted-verifier',
      'follow-through',
      'duplicate-defender',
    ]);
    const followThrough = groups.find((g) => g.id === 'follow-through');
    expect(followThrough?.items[0].gapLabel).toMatch(/follow/i);
  });

  it('returns top 3 next unlocks sorted by progress', () => {
    const catalog = evaluateCatalog(seedCatalog, 105, 78, false);
    const unlocks = buildNextUnlocks(seedBadges, emptyInput, catalog, 50, 105, 78);
    expect(unlocks.length).toBeLessThanOrEqual(3);
    if (unlocks.length >= 2) {
      expect(unlocks[0].progressPercent).toBeGreaterThanOrEqual(unlocks[1].progressPercent);
    }
  });

  it('computes leaderboard insights with gap to next rank', () => {
    const entries = [
      { userId: 'a', displayName: 'Asha', contributionScore: 240, trustScore: 78 },
      { userId: 'b', displayName: 'Priya', contributionScore: 120, trustScore: 82 },
    ];
    const insights = computeLeaderboardInsights(entries, 'b', 25);
    expect(insights.yourRank).toBe(2);
    expect(insights.gapToNextRank).toBe(120);
    expect(insights.weeklyVerifiedContribution).toBe(25);
  });

  it('sums weekly verified contribution from reward events', () => {
    const now = new Date().toISOString();
    const old = '2026-01-01T00:00:00Z';
    const total = weeklyVerifiedContribution([
      { id: '1', userId: 'u', type: 'corroboration', points: 25, verified: true, createdAt: now },
      { id: '2', userId: 'u', type: 'corroboration', points: 10, verified: true, createdAt: old },
      { id: '3', userId: 'u', type: 'corroboration', points: 10, verified: false, createdAt: now },
    ]);
    expect(total).toBe(25);
  });
});
