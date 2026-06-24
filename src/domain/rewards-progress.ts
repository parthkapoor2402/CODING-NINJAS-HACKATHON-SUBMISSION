import type { Badge } from '@/types';
import type { CatalogLockState } from '@/domain/reward-catalog';
import type { RewardEvent } from '@/types';
import {
  DUPLICATE_DEFENDER_THRESHOLD,
  STREAK_BADGE_THRESHOLD,
  VERIFIER_BADGE_THRESHOLD,
  WARD_PATROL_THRESHOLD,
  unlockedBadgeIds,
  type BadgeUnlockInput,
} from '@/domain/badge-unlocks';
import { computeStreak } from '@/domain/streaks';
import {
  getNextLadderTier,
  ladderProgress,
} from '@/domain/civic-ladder';
import type { LeaderboardEntry } from '@/services/types/backend';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface BadgeProgress {
  badgeId: string;
  name: string;
  description: string;
  criteria: string;
  current: number;
  target: number;
  progressPercent: number;
  earned: boolean;
  gapLabel: string;
}

export interface BadgeJourneyGroup {
  id: string;
  label: string;
  description: string;
  items: BadgeProgress[];
}

export interface NextUnlockItem {
  id: string;
  title: string;
  kind: 'badge' | 'perk' | 'rank';
  progressPercent: number;
  howToUnlock: string;
  gapLabel: string;
}

export interface LeaderboardInsights {
  yourRank: number;
  totalParticipants: number;
  gapToNextRank: number | null;
  nextRankName: string | null;
  localPercentile: number;
  weeklyVerifiedContribution: number;
}

export function weeklyVerifiedContribution(rewards: RewardEvent[]): number {
  const cutoff = Date.now() - WEEK_MS;
  return rewards
    .filter((r) => r.verified && new Date(r.createdAt).getTime() >= cutoff)
    .reduce((sum, r) => sum + r.points, 0);
}

export function computeBadgeProgress(
  badge: Badge,
  input: BadgeUnlockInput,
): BadgeProgress {
  const earned = unlockedBadgeIds(input).includes(badge.id);
  let current = 0;
  let target = 1;

  switch (badge.id) {
    case 'badge-first-report':
      current = input.verifiedReportCount;
      target = 1;
      break;
    case 'badge-duplicate-defender':
      current = input.corroborationCount;
      target = DUPLICATE_DEFENDER_THRESHOLD;
      break;
    case 'badge-streak':
      current = Math.min(computeStreak(input.activityDates), STREAK_BADGE_THRESHOLD);
      target = STREAK_BADGE_THRESHOLD;
      break;
    case 'badge-ward-patrol':
      current = input.verifiedReportCount;
      target = WARD_PATROL_THRESHOLD;
      break;
    case 'badge-verifier':
      current = input.corroborationCount;
      target = VERIFIER_BADGE_THRESHOLD;
      break;
    default:
      current = earned ? 1 : 0;
      target = 1;
  }

  const progressPercent = earned ? 100 : Math.min(99, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);

  let gapLabel = 'Unlocked';
  if (!earned) {
    if (badge.id === 'badge-streak') {
      gapLabel =
        remaining === 1
          ? '1 more active day'
          : `${remaining} more active days`;
    } else if (badge.id.includes('verifier') || badge.id.includes('duplicate')) {
      gapLabel =
        remaining === 1
          ? '1 confirmation away'
          : `${remaining} confirmations away`;
    } else {
      gapLabel =
        remaining === 1
          ? '1 verified report away'
          : `${remaining} verified reports away`;
    }
  }

  return {
    badgeId: badge.id,
    name: badge.name,
    description: badge.description,
    criteria: badge.criteria,
    current: Math.min(current, target),
    target,
    progressPercent,
    earned,
    gapLabel,
  };
}

const JOURNEY_GROUPS: Array<{
  id: string;
  label: string;
  description: string;
  badgeIds: string[];
}> = [
  {
    id: 'getting-started',
    label: 'Getting started',
    description: 'Your first verified civic impact.',
    badgeIds: ['badge-first-report'],
  },
  {
    id: 'neighborhood-helper',
    label: 'Neighborhood helper',
    description: 'Sustained presence on your block.',
    badgeIds: ['badge-ward-patrol', 'badge-streak'],
  },
  {
    id: 'trusted-verifier',
    label: 'Trusted verifier',
    description: 'Neighbors rely on your confirmations.',
    badgeIds: ['badge-verifier'],
  },
  {
    id: 'follow-through',
    label: 'Follow-through',
    description: 'See issues through to resolution.',
    badgeIds: [],
  },
  {
    id: 'duplicate-defender',
    label: 'Duplicate defender',
    description: 'Support existing reports — reduce noise.',
    badgeIds: ['badge-duplicate-defender'],
  },
];

export function buildBadgeJourney(
  badges: Badge[],
  input: BadgeUnlockInput,
  resolvedFollowed: number,
): BadgeJourneyGroup[] {
  const byId = new Map(badges.map((b) => [b.id, b]));

  return JOURNEY_GROUPS.map((group) => {
    if (group.id === 'follow-through') {
      const target = 1;
      const current = Math.min(resolvedFollowed, target);
      const earned = current >= target;
      return {
        id: group.id,
        label: group.label,
        description: group.description,
        items: [
          {
            badgeId: 'm-resolution',
            name: 'Fix followed through',
            description: 'Track an issue through to resolution.',
            criteria: '1 resolved issue tracked',
            current,
            target,
            progressPercent: earned ? 100 : current * 100,
            earned,
            gapLabel: earned ? 'Unlocked' : 'Follow a report to resolution',
          },
        ],
      };
    }

    const items = group.badgeIds
      .map((id) => byId.get(id))
      .filter((b): b is Badge => Boolean(b))
      .map((b) => computeBadgeProgress(b, input));

    return {
      id: group.id,
      label: group.label,
      description: group.description,
      items,
    };
  });
}

export function buildNextUnlocks(
  badges: Badge[],
  input: BadgeUnlockInput,
  catalog: CatalogLockState[],
  contributionUnits: number,
  verifiedPoints: number,
  trustScore: number,
): NextUnlockItem[] {
  const items: NextUnlockItem[] = [];

  for (const badge of badges) {
    const progress = computeBadgeProgress(badge, input);
    if (progress.earned) continue;
    items.push({
      id: progress.badgeId,
      title: progress.name,
      kind: 'badge',
      progressPercent: progress.progressPercent,
      howToUnlock: progress.description,
      gapLabel: progress.gapLabel,
    });
  }

  for (const { item, locked } of catalog) {
    if (!locked) continue;
    const pointsGap = Math.max(0, item.pointsCost - verifiedPoints);
    const trustGap = Math.max(0, item.minTrustScore - trustScore);
    const pointsProgress =
      item.pointsCost > 0
        ? Math.min(99, Math.round((verifiedPoints / item.pointsCost) * 100))
        : 100;
    const trustProgress =
      item.minTrustScore > 0
        ? Math.min(99, Math.round((trustScore / item.minTrustScore) * 100))
        : 100;
    const progressPercent = Math.round((pointsProgress + trustProgress) / 2);

    let gapLabel = '';
    if (pointsGap > 0 && trustGap > 0) {
      gapLabel = `${pointsGap} verified pts · trust +${trustGap}`;
    } else if (pointsGap > 0) {
      gapLabel = `${pointsGap} verified points away`;
    } else if (trustGap > 0) {
      gapLabel = `Trust score +${trustGap} needed`;
    }

    items.push({
      id: item.id,
      title: item.name,
      kind: 'perk',
      progressPercent,
      howToUnlock: item.description,
      gapLabel,
    });
  }

  const nextTier = getNextLadderTier(contributionUnits);
  if (nextTier) {
    const remaining = nextTier.minContribution - contributionUnits;
    items.push({
      id: `rank-${nextTier.id}`,
      title: `${nextTier.label} rank`,
      kind: 'rank',
      progressPercent: ladderProgress(contributionUnits),
      howToUnlock: nextTier.description,
      gapLabel:
        remaining <= 0
          ? 'Ready to advance'
          : `${remaining} contribution units away`,
    });
  }

  return items
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .slice(0, 3);
}

export function computeLeaderboardInsights(
  entries: LeaderboardEntry[],
  currentUserId: string,
  weeklyContribution: number,
): LeaderboardInsights {
  const sorted = [...entries].sort((a, b) => b.contributionScore - a.contributionScore);
  const yourIndex = sorted.findIndex((e) => e.userId === currentUserId);
  const yourRank = yourIndex >= 0 ? yourIndex + 1 : sorted.length + 1;
  const total = sorted.length;
  const above = yourIndex > 0 ? sorted[yourIndex - 1] : null;
  const you = sorted[yourIndex];

  return {
    yourRank,
    totalParticipants: total,
    gapToNextRank:
      above && you ? Math.max(0, above.contributionScore - you.contributionScore) : null,
    nextRankName: above?.displayName ?? null,
    localPercentile:
      total > 0 && yourIndex >= 0
        ? Math.round(((total - yourRank) / total) * 100)
        : 0,
    weeklyVerifiedContribution: weeklyContribution,
  };
}

export function nextUnlockHeadline(items: NextUnlockItem[]): string {
  if (items.length === 0) return 'All current unlocks achieved — keep building impact';
  const top = items[0];
  return top.gapLabel;
}
