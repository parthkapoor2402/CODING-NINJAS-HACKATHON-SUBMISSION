import type { Badge } from '@/types';
import { computeStreak } from '@/domain/streaks';

export const BADGE_FIRST_REPORT = 'badge-first-report';
export const BADGE_DUPLICATE_DEFENDER = 'badge-duplicate-defender';
export const BADGE_STREAK = 'badge-streak';
export const BADGE_WARD_PATROL = 'badge-ward-patrol';
export const BADGE_VERIFIER = 'badge-verifier';

export const DUPLICATE_DEFENDER_THRESHOLD = 5;
export const STREAK_BADGE_THRESHOLD = 7;
export const WARD_PATROL_THRESHOLD = 3;
export const VERIFIER_BADGE_THRESHOLD = 10;

export interface BadgeUnlockInput {
  verifiedReportCount: number;
  corroborationCount: number;
  activityDates: string[];
}

export function unlockedBadgeIds(input: BadgeUnlockInput): string[] {
  const unlocked: string[] = [];
  if (input.verifiedReportCount >= 1) {
    unlocked.push(BADGE_FIRST_REPORT);
  }
  if (input.corroborationCount >= DUPLICATE_DEFENDER_THRESHOLD) {
    unlocked.push(BADGE_DUPLICATE_DEFENDER);
  }
  if (computeStreak(input.activityDates) >= STREAK_BADGE_THRESHOLD) {
    unlocked.push(BADGE_STREAK);
  }
  if (input.verifiedReportCount >= WARD_PATROL_THRESHOLD) {
    unlocked.push(BADGE_WARD_PATROL);
  }
  if (input.corroborationCount >= VERIFIER_BADGE_THRESHOLD) {
    unlocked.push(BADGE_VERIFIER);
  }
  return unlocked;
}

export function filterUnlockedBadges(badges: Badge[], input: BadgeUnlockInput): Badge[] {
  const ids = new Set(unlockedBadgeIds(input));
  return badges.filter((b) => ids.has(b.id));
}
