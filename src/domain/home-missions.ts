import { listActiveChallenges } from '@/domain/community-challenges';
import { ROUTES } from '@/lib/constants';
import type { Report, User } from '@/types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ROAD_CATEGORIES = new Set(['pothole', 'streetlight', 'infrastructure']);

export interface HomeImpactMetrics {
  openNearby: number;
  underReview: number;
  resolvedThisWeek: number;
  yourVerifiedImpact: number;
}

export type HeroAccent = 'teal' | 'blue' | 'amber';

export interface DynamicHeroContent {
  headline: string;
  subline: string;
  accent: HeroAccent;
  ctaLabel: string;
  ctaRoute: string;
}

export type MissionIcon = 'verify' | 'support' | 'track' | 'challenge';

export interface CivicMission {
  id: string;
  title: string;
  description: string;
  cta: string;
  route: string;
  icon: MissionIcon;
  completed?: boolean;
  progressLabel?: string;
}

export interface NeighborhoodActivity {
  id: string;
  message: string;
  timeLabel: string;
  reportId?: string;
  kind: 'community' | 'crew' | 'system';
}

function isOpen(report: Report): boolean {
  return report.status !== 'merged' && report.status !== 'resolved';
}

function isVerifiableBy(report: Report, userId: string | undefined): boolean {
  if (!userId) return false;
  return report.status === 'pending_verification' && report.reporterId !== userId;
}

function userReports(reports: Report[], userId: string | undefined): Report[] {
  if (!userId) return [];
  return reports
    .filter((r) => r.reporterId === userId && r.status !== 'merged')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function computeHomeImpact(
  reports: Report[],
  user: User | null,
): HomeImpactMetrics {
  const now = Date.now();
  const open = reports.filter(isOpen);
  const ward12Open = open.filter((r) => r.location.wardId === 'ward-12');

  return {
    openNearby: ward12Open.length > 0 ? ward12Open.length : open.length,
    underReview: reports.filter(
      (r) =>
        r.status === 'pending_verification' ||
        r.status === 'verified' ||
        r.status === 'acknowledged',
    ).length,
    resolvedThisWeek: reports.filter((r) => {
      if (!r.resolvedAt) return false;
      return now - new Date(r.resolvedAt).getTime() <= WEEK_MS;
    }).length,
    yourVerifiedImpact: user?.trust.contributionScore ?? 0,
  };
}

export function computeDynamicHero(
  reports: Report[],
  user: User | null,
): DynamicHeroContent {
  const verifiable = reports.filter((r) => isVerifiableBy(r, user?.id));
  const mine = userReports(reports, user?.id);

  if (verifiable.length > 0) {
    const n = verifiable.length;
    return {
      headline:
        n === 1
          ? '1 issue near you needs confirmation'
          : `${n} issues near you need confirmation`,
      subline: 'Neighbors are waiting — a quick confirm helps crews prioritize real problems.',
      accent: 'teal',
      ctaLabel: 'Confirm nearby',
      ctaRoute: ROUTES.community,
    };
  }

  const pendingMine = mine.find((r) => r.status === 'pending_verification');
  if (pendingMine) {
    const need = Math.max(0, 2 - pendingMine.corroborationCount);
    return {
      headline:
        need > 0
          ? `Your report needs ${need} more neighbor confirmation${need === 1 ? '' : 's'}`
          : 'Your report is ready for crew review',
      subline: pendingMine.location.address ?? pendingMine.description.slice(0, 60),
      accent: 'amber',
      ctaLabel: 'Track my report',
      ctaRoute: ROUTES.track,
    };
  }

  const advancing = mine.find((r) =>
    ['verified', 'acknowledged', 'in_progress'].includes(r.status),
  );
  if (advancing) {
    const step =
      advancing.status === 'verified'
        ? 'crew assignment'
        : advancing.status === 'acknowledged'
          ? 'field inspection'
          : 'resolution';
    return {
      headline: `Your last report is one step from ${step}`,
      subline: advancing.location.address ?? advancing.description.slice(0, 60),
      accent: 'blue',
      ctaLabel: 'View progress',
      ctaRoute: ROUTES.issueDetail(advancing.id),
    };
  }

  const roadHazards = reports.filter(
    (r) => isOpen(r) && ROAD_CATEGORIES.has(r.category),
  );
  const remaining = roadHazards.length;
  const clearing = Math.max(0, 3 - remaining);

  return {
    headline:
      remaining <= 3
        ? `Ward 12 is close to clearing ${remaining} open road hazard${remaining === 1 ? '' : 's'}`
        : `${remaining} road hazards open in Ward 12`,
    subline:
      clearing > 0
        ? `${clearing} cleared this month — your confirm or report keeps momentum going.`
        : 'Verify or report what you see to help your block move faster.',
    accent: 'teal',
    ctaLabel: 'See nearby issues',
    ctaRoute: ROUTES.nearby,
  };
}

export function computeCivicMissions(
  reports: Report[],
  user: User | null,
  completedIds: Set<string> = new Set(),
): CivicMission[] {
  const missions: CivicMission[] = [];
  const verifiable = reports.filter((r) => isVerifiableBy(r, user?.id));
  const mine = userReports(reports, user?.id);
  const challenges = listActiveChallenges();

  if (verifiable.length > 0) {
    missions.push({
      id: 'verify-nearby',
      title: 'Verify a nearby issue',
      description: `${verifiable.length} report${verifiable.length === 1 ? '' : 's'} need neighbor eyes before crews act.`,
      cta: 'Open verify queue',
      route: ROUTES.community,
      icon: 'verify',
      completed: completedIds.has('verify-nearby'),
      progressLabel: `${verifiable.length} waiting`,
    });
  }

  const supportTarget = reports.find(
    (r) => r.status === 'verified' && r.category === 'pothole' && r.corroborationCount < 6,
  );
  if (supportTarget) {
    missions.push({
      id: 'support-existing',
      title: 'Support an existing report',
      description: 'Strengthen the school-crossing pothole — corroboration beats duplicate noise.',
      cta: 'Support report',
      route: ROUTES.issueDetail(supportTarget.id),
      icon: 'support',
      completed: completedIds.has('support-existing'),
      progressLabel: `${supportTarget.corroborationCount} confirmed`,
    });
  }

  const openMine = mine.find((r) => r.status !== 'resolved' && r.status !== 'rejected');
  if (openMine) {
    const tracking = openMine.status === 'in_progress' || openMine.status === 'resolved';
    missions.push({
      id: 'track-resolution',
      title: tracking ? 'Follow your open fix' : 'Complete your tracked resolution',
      description: openMine.location.address ?? openMine.description.slice(0, 72),
      cta: 'Open tracker',
      route: ROUTES.track,
      icon: 'track',
      completed: completedIds.has('track-resolution'),
      progressLabel: openMine.status.replace(/_/g, ' '),
    });
  }

  const schoolChallenge = challenges.find((c) => c.scope === 'school');
  if (schoolChallenge) {
    missions.push({
      id: 'school-challenge',
      title: 'Help your school block challenge',
      description: schoolChallenge.description,
      cta: 'View challenge',
      route: ROUTES.rewards,
      icon: 'challenge',
      completed: completedIds.has('school-challenge'),
      progressLabel: `${schoolChallenge.progressPercent}% ward progress`,
    });
  }

  if (missions.length < 2) {
    missions.push({
      id: 'report-new',
      title: 'Report something on your route',
      description: 'Photo + location in under a minute — crews act faster with evidence.',
      cta: 'Start report',
      route: ROUTES.report,
      icon: 'track',
      completed: false,
    });
  }

  return missions.slice(0, 4);
}

export function computeNeighborhoodActivity(reports: Report[]): NeighborhoodActivity[] {
  const items: NeighborhoodActivity[] = [];

  const confirmed = reports.find(
    (r) => r.status === 'verified' && r.corroborationCount >= 4,
  );
  if (confirmed) {
    items.push({
      id: 'act-confirm',
      message: `${confirmed.corroborationCount} neighbors confirmed ${confirmed.location.address ?? 'a nearby issue'}`,
      timeLabel: '2h ago',
      reportId: confirmed.id,
      kind: 'community',
    });
  }

  const assigned = reports.find((r) => r.status === 'in_progress' && r.assignedWorkerId);
  if (assigned) {
    items.push({
      id: 'act-assign',
      message: `Crew assigned to ${assigned.location.address ?? 'active repair'}`,
      timeLabel: 'Today',
      reportId: assigned.id,
      kind: 'crew',
    });
  }

  const resolved = reports.find((r) => r.status === 'resolved');
  if (resolved) {
    items.push({
      id: 'act-resolve',
      message: `${resolved.location.address ?? 'Market cleanup'} marked resolved`,
      timeLabel: 'This week',
      reportId: resolved.id,
      kind: 'crew',
    });
  }

  const pending = reports.find((r) => r.status === 'pending_verification');
  if (pending) {
    items.push({
      id: 'act-pending',
      message: `Park Lane streetlight needs confirmation — ${pending.corroborationCount} so far`,
      timeLabel: 'Yesterday',
      reportId: pending.id,
      kind: 'system',
    });
  }

  return items.slice(0, 4);
}

/** Approximate distance for demo ordering (seed neighborhood). */
export function estimateDistanceKm(index: number, report: Report): number {
  const wardOffset = report.location.wardId === 'ward-12' ? 0 : 0.1;
  return 0.15 + index * 0.12 + wardOffset;
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}
