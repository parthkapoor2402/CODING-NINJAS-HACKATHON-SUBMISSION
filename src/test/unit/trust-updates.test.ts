import { describe, expect, it } from 'vitest';
import {
  applyVerificationTrust,
  TRUST_SCORE_PER_VERIFICATION,
  VERIFICATION_SUPPORT_BONUS,
} from '@/domain/trust-updates';
import type { TrustSnapshot } from '@/types';

const baseTrust: TrustSnapshot = {
  trustScore: 70,
  contributionScore: 10,
  verificationScore: 20,
  duplicateRisk: 0,
  abuseFlags: [],
};

describe('trust-updates', () => {
  it('U44: apply verification bonus — verificationScore increases', () => {
    const updated = applyVerificationTrust(baseTrust);
    expect(updated.verificationScore).toBe(baseTrust.verificationScore + VERIFICATION_SUPPORT_BONUS);
  });

  it('U45: recompute trust score — trustScore reflects verification delta', () => {
    const updated = applyVerificationTrust(baseTrust);
    expect(updated.trustScore).toBe(baseTrust.trustScore + TRUST_SCORE_PER_VERIFICATION);
    expect(updated.contributionScore).toBe(baseTrust.contributionScore + 1);
  });
});
