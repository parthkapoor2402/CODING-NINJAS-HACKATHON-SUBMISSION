import { describe, expect, it } from 'vitest';
import {
  applyAbuseTrustPenalty,
  recomputeTrustScore,
} from '@/domain/trust-score';
import type { TrustSnapshot } from '@/types';

const baseTrust: TrustSnapshot = {
  trustScore: 70,
  contributionScore: 20,
  verificationScore: 30,
  duplicateRisk: 0,
  abuseFlags: [],
};

describe('trust-score', () => {
  it('U53: recompute trust from verification and contribution signals', () => {
    const lower = recomputeTrustScore({ ...baseTrust, verificationScore: 20 }, 5);
    const higher = recomputeTrustScore({ ...baseTrust, verificationScore: 50 }, 20);
    expect(higher).toBeGreaterThan(lower);
  });

  it('U54: abuse penalty reduces trust', () => {
    const penalized = applyAbuseTrustPenalty(baseTrust, 'velocity_spike');
    expect(penalized.trustScore).toBeLessThan(baseTrust.trustScore);
    expect(penalized.abuseFlags).toContain('velocity_spike');
  });
});
