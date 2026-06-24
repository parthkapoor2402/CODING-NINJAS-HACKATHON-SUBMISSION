import { describe, expect, it } from 'vitest';
import { evaluateCatalog } from '@/domain/reward-catalog';

const items = [
  {
    id: 'perk-coffee',
    name: 'Cafe discount',
    description: 'Local partner',
    pointsCost: 100,
    minTrustScore: 70,
  },
  {
    id: 'perk-transit',
    name: 'Transit credit',
    description: 'Metro pass',
    pointsCost: 200,
    minTrustScore: 80,
  },
];

describe('reward-catalog', () => {
  it('U59: catalog item locked below points or trust', () => {
    const states = evaluateCatalog(items, 50, 75, false);
    expect(states.every((s) => s.locked)).toBe(true);
    expect(states[0].reason).toBe('insufficient_points');
  });

  it('U60: catalog item unlocked when points and trust qualify', () => {
    const states = evaluateCatalog(items, 150, 75, false);
    expect(states[0].locked).toBe(false);
    expect(states[1].locked).toBe(true);
  });
});
