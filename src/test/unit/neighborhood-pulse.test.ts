import { describe, expect, it } from 'vitest';
import { buildSeedReports } from '@/services/mock/seed/reports';
import { seedUsers } from '@/services/mock/seed/users';
import {
  buildNeighborhoodPulse,
  buildWardImpactNugget,
  computeWardResponsiveness,
  countIssuesConfirmedToday,
  enrichActiveResidents,
} from '@/domain/neighborhood-pulse';

describe('neighborhood-pulse', () => {
  const reports = buildSeedReports();
  const parent = seedUsers.find((u) => u.id === 'user-parent-1')!;
  const citizen = seedUsers.find((u) => u.id === 'user-citizen-1')!;

  it('derives ward responsiveness from report pipeline states', () => {
    const pct = computeWardResponsiveness(reports, 'ward-12');
    expect(pct).toBeGreaterThanOrEqual(52);
    expect(pct).toBeLessThanOrEqual(96);
  });

  it('returns a believable confirmed-today floor for demo ward', () => {
    expect(countIssuesConfirmedToday(reports, 'ward-12')).toBeGreaterThanOrEqual(2);
  });

  it('builds home pulse with microcopy and ward impact', () => {
    const pulse = enrichActiveResidents(
      buildNeighborhoodPulse({ reports, user: parent, surface: 'home' }),
      seedUsers,
      reports,
    );
    expect(pulse.metrics.wardLabel).toBe('Ward 12');
    expect(pulse.metrics.activeResidentsThisWeek).toBeGreaterThanOrEqual(14);
    expect(pulse.microcopy.headline).toBeTruthy();
    expect(pulse.wardImpact?.contributionScore).toBe(parent.trust.contributionScore);
  });

  it('tailors verify microcopy when queue has items', () => {
    const pulse = buildNeighborhoodPulse({ reports, user: parent, surface: 'verify' });
    expect(pulse.microcopy.subline).toMatch(/curated ward signal/i);
  });

  it('tailors rewards microcopy to challenge momentum', () => {
    const pulse = buildNeighborhoodPulse({ reports, user: citizen, surface: 'rewards' });
    expect(pulse.microcopy.headline).toMatch(/confirmation|verified|week/i);
    expect(pulse.metrics.challengeProgressPercent).toBeGreaterThan(0);
  });

  it('describes citizen ward impact from reports in ward-12', () => {
    const nugget = buildWardImpactNugget(reports, citizen, 0, 80);
    expect(nugget?.yourReportsInWard).toBeGreaterThan(0);
    expect(nugget?.headline).toMatch(/Ward 12|ward/i);
  });
});
