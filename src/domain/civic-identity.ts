import type { Report, RewardEvent, TrustSnapshot, User } from '@/types';
import { getCurrentLadderTier, ladderProgress } from '@/domain/civic-ladder';
import { sumRedeemablePoints } from '@/domain/reward-eligibility';
import { computeStreak } from '@/domain/streaks';

export interface CivicStrength {
  id: 'reporting' | 'verification' | 'follow-through';
  label: string;
  description: string;
  current: number;
  target: number;
  progressPercent: number;
  strengthLabel: 'Emerging' | 'Building' | 'Strong' | 'Trusted';
}

export interface TrustMetric {
  id: string;
  label: string;
  value: number;
  max: number;
  hint: string;
}

export interface ActivitySummaryItem {
  id: string;
  title: string;
  detail: string;
  when: string;
  verified: boolean;
}

export interface CivicIdentitySnapshot {
  civicRank: string;
  rankProgress: number;
  verifiedImpact: number;
  neighborhood: string;
  streakDays: number;
}

function strengthLabel(percent: number): CivicStrength['strengthLabel'] {
  if (percent >= 80) return 'Trusted';
  if (percent >= 50) return 'Strong';
  if (percent >= 25) return 'Building';
  return 'Emerging';
}

export function deriveNeighborhoodAffiliation(reports: Report[]): string {
  const wardCounts = new Map<string, number>();
  for (const report of reports) {
    const ward = report.location.wardId;
    if (!ward) continue;
    wardCounts.set(ward, (wardCounts.get(ward) ?? 0) + 1);
  }

  if (wardCounts.size === 0) {
    return 'Ward 12 · Lakeview area';
  }

  const top = [...wardCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const label = top.replace('ward-', 'Ward ');
  return `${label} neighborhood`;
}

export function buildCivicIdentitySnapshot(
  user: User,
  rewards: RewardEvent[],
  reports: Report[],
  extraActivityDates: string[] = [],
): CivicIdentitySnapshot {
  const contributionUnits = user.trust.contributionScore;
  const rank = getCurrentLadderTier(contributionUnits);
  const activityDates = [...rewards.map((r) => r.createdAt), ...extraActivityDates];

  return {
    civicRank: rank.label,
    rankProgress: ladderProgress(contributionUnits),
    verifiedImpact: sumRedeemablePoints(rewards),
    neighborhood: deriveNeighborhoodAffiliation(reports),
    streakDays: computeStreak(activityDates),
  };
}

export function buildCivicStrengths(
  rewards: RewardEvent[],
  reports: Report[],
): CivicStrength[] {
  const verifiedReports = rewards.filter((r) => r.type === 'verified_report' && r.verified).length;
  const verifications = rewards.filter(
    (r) => (r.type === 'corroboration' || r.type === 'support_existing') && r.verified,
  ).length;
  const followThrough = rewards.filter((r) => r.type === 'resolution' && r.verified).length;
  const resolvedReports = reports.filter((r) => r.status === 'resolved').length;
  const followCurrent = Math.max(followThrough, resolvedReports > 0 ? 1 : 0);

  const reportingTarget = 3;
  const verificationTarget = 10;
  const followTarget = 1;

  const reportingPct = Math.min(100, Math.round((verifiedReports / reportingTarget) * 100));
  const verificationPct = Math.min(100, Math.round((verifications / verificationTarget) * 100));
  const followPct = Math.min(100, Math.round((followCurrent / followTarget) * 100));

  return [
    {
      id: 'reporting',
      label: 'Reporting',
      description: 'Verified issues you put on the civic record.',
      current: verifiedReports,
      target: reportingTarget,
      progressPercent: reportingPct,
      strengthLabel: strengthLabel(reportingPct),
    },
    {
      id: 'verification',
      label: 'Verification',
      description: 'Useful confirmations that strengthen neighborhood signal.',
      current: verifications,
      target: verificationTarget,
      progressPercent: verificationPct,
      strengthLabel: strengthLabel(verificationPct),
    },
    {
      id: 'follow-through',
      label: 'Follow-through',
      description: 'Issues tracked through to resolution.',
      current: followCurrent,
      target: followTarget,
      progressPercent: followPct,
      strengthLabel: strengthLabel(followPct),
    },
  ];
}

export function buildTrustMetrics(trust: TrustSnapshot): TrustMetric[] {
  return [
    {
      id: 'trust',
      label: 'Trust score',
      value: trust.trustScore,
      max: 100,
      hint: 'Reliability signal for crews and partner perks.',
    },
    {
      id: 'contribution',
      label: 'Contribution',
      value: trust.contributionScore,
      max: Math.max(240, trust.contributionScore),
      hint: 'Verified civic actions that advance your rank.',
    },
    {
      id: 'verification',
      label: 'Verification pts',
      value: trust.verificationScore,
      max: Math.max(100, trust.verificationScore),
      hint: 'Points from confirming issues you did not report.',
    },
  ];
}

export function summarizeActivityHistory(
  rewards: RewardEvent[],
  limit = 4,
): ActivitySummaryItem[] {
  const sorted = [...rewards].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return sorted.slice(0, limit).map((event) => ({
    id: event.id,
    title: formatActivityTitle(event),
    detail: formatActivityDetail(event),
    when: event.createdAt,
    verified: event.verified,
  }));
}

function formatActivityTitle(event: RewardEvent): string {
  const labels: Record<string, string> = {
    verified_report: 'Verified report',
    corroboration: 'Neighbor confirmation',
    support_existing: 'Supported existing issue',
    resolution: 'Resolution followed',
    submitted_report: 'Report submitted',
  };
  const base = labels[event.type] ?? 'Civic action';
  return event.verified ? `${base} · +${event.points} pts` : base;
}

function formatActivityDetail(event: RewardEvent): string {
  if (!event.verified) {
    return 'Pending neighborhood or admin verification.';
  }
  if (event.type === 'verified_report') {
    return 'Neighbors confirmed your report as real and useful.';
  }
  if (event.type === 'corroboration' || event.type === 'support_existing') {
    return 'You strengthened an issue crews can prioritize.';
  }
  if (event.type === 'resolution') {
    return 'An issue you followed reached a verified fix.';
  }
  return 'Verified contribution on record.';
}

export function familyModeCopy(role: User['role']): { title: string; subtitle: string } {
  if (role === 'parent') {
    return {
      title: 'Family & youth hub',
      subtitle: 'Review proposals, school challenges, and supervised rewards.',
    };
  }
  if (role === 'youth') {
    return {
      title: 'Supervised civic mode',
      subtitle: 'Propose reports, verify with guidance, earn capped recognition.',
    };
  }
  return {
    title: 'Family & youth mode',
    subtitle: 'Household civic participation with parent oversight.',
  };
}
