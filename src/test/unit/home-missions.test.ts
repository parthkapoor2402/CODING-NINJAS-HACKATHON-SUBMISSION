import { describe, expect, it } from 'vitest';
import { buildSeedReports } from '@/services/mock/seed/reports';
import { seedUsers } from '@/services/mock/seed/users';
import {
  computeCivicMissions,
  computeDynamicHero,
  computeHomeImpact,
} from '@/domain/home-missions';

describe('home-missions', () => {
  const reports = buildSeedReports();
  const parent = seedUsers.find((u) => u.id === 'user-parent-1')!;
  const citizen = seedUsers.find((u) => u.id === 'user-citizen-1')!;

  it('computes impact metrics from reports', () => {
    const impact = computeHomeImpact(reports, parent);
    expect(impact.openNearby).toBeGreaterThan(0);
    expect(impact.underReview).toBeGreaterThan(0);
    expect(impact.yourVerifiedImpact).toBe(parent.trust.contributionScore);
  });

  it('shows confirmation hero for parent with verifiable issues', () => {
    const hero = computeDynamicHero(reports, parent);
    expect(hero.headline).toMatch(/needs confirmation/i);
    expect(hero.ctaRoute).toContain('/app/community');
  });

  it('shows report progress hero for citizen with own pending report', () => {
    const hero = computeDynamicHero(reports, citizen);
    expect(hero.headline).toMatch(/report/i);
  });

  it('returns up to 4 civic missions', () => {
    const missions = computeCivicMissions(reports, parent);
    expect(missions.length).toBeGreaterThanOrEqual(2);
    expect(missions.length).toBeLessThanOrEqual(4);
    expect(missions.some((m) => m.id === 'verify-nearby')).toBe(true);
  });
});
