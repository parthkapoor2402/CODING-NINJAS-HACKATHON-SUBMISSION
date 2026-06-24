import type { TrustSnapshot } from '@/types';

export const VERIFICATION_SUPPORT_BONUS = 5;
export const TRUST_SCORE_PER_VERIFICATION = 3;

export function applyVerificationTrust(trust: TrustSnapshot): TrustSnapshot {
  const verificationScore = trust.verificationScore + VERIFICATION_SUPPORT_BONUS;
  const trustScore = Math.min(100, trust.trustScore + TRUST_SCORE_PER_VERIFICATION);
  return {
    ...trust,
    verificationScore,
    trustScore,
    contributionScore: trust.contributionScore + 1,
  };
}

/** Duplicate/spam filings should not inflate rewards. */
export function applyDuplicateTrustPenalty(trust: TrustSnapshot): TrustSnapshot {
  return {
    ...trust,
    trustScore: Math.max(0, trust.trustScore - 2),
    duplicateRisk: Math.min(100, trust.duplicateRisk + 8),
  };
}
