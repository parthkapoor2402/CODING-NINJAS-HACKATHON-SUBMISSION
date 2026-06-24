import type { TrustSnapshot } from '@/types';
import { TRUST_SCORE_PER_VERIFICATION, VERIFICATION_SUPPORT_BONUS } from '@/domain/trust-updates';

export const BASE_TRUST = 50;
export const CONTRIBUTION_TRUST_FACTOR = 0.1;
export const ABUSE_TRUST_PENALTY = 5;

export function recomputeTrustScore(
  trust: TrustSnapshot,
  verifiedContributionUnits: number,
): number {
  const verificationComponent = trust.verificationScore * 0.3;
  const contributionComponent = verifiedContributionUnits * CONTRIBUTION_TRUST_FACTOR;
  const abusePenalty = trust.abuseFlags.length * ABUSE_TRUST_PENALTY;
  const duplicatePenalty = Math.floor(trust.duplicateRisk / 20);
  const raw = BASE_TRUST + verificationComponent + contributionComponent - abusePenalty - duplicatePenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function applyVerificationToTrust(trust: TrustSnapshot): TrustSnapshot {
  const verificationScore = trust.verificationScore + VERIFICATION_SUPPORT_BONUS;
  const trustScore = Math.min(100, trust.trustScore + TRUST_SCORE_PER_VERIFICATION);
  return {
    ...trust,
    verificationScore,
    trustScore,
    contributionScore: trust.contributionScore + 1,
  };
}

export function applyAbuseTrustPenalty(trust: TrustSnapshot, flag: string): TrustSnapshot {
  const abuseFlags = trust.abuseFlags.includes(flag)
    ? trust.abuseFlags
    : [...trust.abuseFlags, flag];
  return {
    ...trust,
    abuseFlags,
    trustScore: Math.max(0, trust.trustScore - ABUSE_TRUST_PENALTY),
    duplicateRisk: Math.min(100, trust.duplicateRisk + 10),
  };
}
