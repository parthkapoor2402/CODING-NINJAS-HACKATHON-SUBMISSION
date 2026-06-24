import { describe, expect, it } from 'vitest';
import { buildSeedReports } from '@/services/mock/seed/reports';
import { seedUsers } from '@/services/mock/seed/users';
import { computeCivicMissions, computeDynamicHero } from '@/domain/home-missions';
import { computeNextActionPrompt } from '@/domain/next-action';
import { ROUTES } from '@/lib/constants';

describe('next-action', () => {
  const reports = buildSeedReports();
  const parent = seedUsers.find((u) => u.id === 'user-parent-1')!;

  it('prioritizes verify when confirmations are needed', () => {
    const hero = computeDynamicHero(reports, parent);
    const missions = computeCivicMissions(reports, parent);
    const prompt = computeNextActionPrompt(hero, missions, parent);
    expect(prompt.route).toBe(ROUTES.community);
    expect(prompt.urgency).toBe('high');
  });
});
