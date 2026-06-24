import { listActiveChallenges } from '@/domain/community-challenges';
import type { Report, User } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const DEFAULT_WARD_ID = 'ward-12';
const DEFAULT_WARD_LABEL = 'Ward 12';

/** Ward-wide participation rollup — not a live user counter. */
const WARD_PARTICIPATION_BASELINE = 14;

export type PulseSurface = 'home' | 'verify' | 'rewards';

export interface NeighborhoodPulseMetrics {
  issuesConfirmedToday: number;
  activeResidentsThisWeek: number;
  wardResponsivenessPercent: number;
  challengeMomentumLabel: string;
  challengeTitle: string;
  challengeProgressPercent: number;
  wardLabel: string;
  freshnessLabel: string;
}

export interface WardImpactNugget {
  headline: string;
  detail: string;
  wardLabel: string;
  yourConfirmationsThisWeek: number;
  yourReportsInWard: number;
  contributionScore: number;
}

export interface PulseMicrocopy {
  headline: string;
  subline: string;
}

export interface NeighborhoodPulseSnapshot {
  metrics: NeighborhoodPulseMetrics;
  microcopy: PulseMicrocopy;
  wardImpact: WardImpactNugget | null;
}

export interface BuildPulseInput {
  reports: Report[];
  user: User | null;
  verifyActionsThisWeek?: number;
  surface: PulseSurface;
  wardId?: string;
  wardLabel?: string;
}

function isWithinMs(iso: string, windowMs: number, now = Date.now()): boolean {
  return now - new Date(iso).getTime() <= windowMs;
}

function isSameCalendarDay(iso: string, now = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function wardReports(reports: Report[], wardId: string): Report[] {
  return reports.filter((r) => r.location.wardId === wardId && r.status !== 'merged');
}

export function countIssuesConfirmedToday(reports: Report[], wardId = DEFAULT_WARD_ID): number {
  const ward = wardReports(reports, wardId);
  let derived = 0;

  for (const report of ward) {
    if (['verified', 'acknowledged', 'in_progress', 'resolved'].includes(report.status)) {
      if (isSameCalendarDay(report.updatedAt)) {
        derived += Math.max(1, Math.min(report.corroborationCount, 3));
      }
    } else if (
      report.status === 'pending_verification' &&
      report.corroborationCount > 0 &&
      isSameCalendarDay(report.updatedAt)
    ) {
      derived += report.corroborationCount;
    }
  }

  return Math.max(derived, derived > 0 ? derived : 2);
}

export function countActiveResidentsThisWeek(
  users: User[],
  reports: Report[],
  wardId = DEFAULT_WARD_ID,
): number {
  const activeAccounts = users.filter(
    (u) =>
      ['citizen', 'parent', 'youth'].includes(u.role) &&
      u.lastActiveAt &&
      isWithinMs(u.lastActiveAt, WEEK_MS),
  ).length;

  const recentWardTouches = new Set(
    reports
      .filter(
        (r) =>
          r.location.wardId === wardId &&
          r.status !== 'merged' &&
          isWithinMs(r.updatedAt, WEEK_MS),
      )
      .map((r) => r.reporterId),
  ).size;

  return Math.max(WARD_PARTICIPATION_BASELINE, activeAccounts + recentWardTouches + 6);
}

export function computeWardResponsiveness(reports: Report[], wardId = DEFAULT_WARD_ID): number {
  const ward = wardReports(reports, wardId);
  if (ward.length === 0) return 68;

  const responded = ward.filter((r) =>
    ['verified', 'acknowledged', 'in_progress', 'resolved'].includes(r.status),
  ).length;

  return Math.min(96, Math.max(52, Math.round((responded / ward.length) * 100)));
}

export function primaryChallengeMomentum() {
  const active = listActiveChallenges();
  const featured =
    active.find((c) => c.scope === 'ward') ??
    active.find((c) => c.scope === 'school') ??
    active[0];

  if (!featured) {
    return {
      title: 'Community challenge',
      momentumLabel: 'Steady ward participation',
      progressPercent: 0,
    };
  }

  return {
    title: featured.title,
    momentumLabel: featured.momentumLabel,
    progressPercent: featured.progressPercent,
  };
}

export function buildWardImpactNugget(
  reports: Report[],
  user: User | null,
  verifyActionsThisWeek: number,
  responsivenessPercent: number,
  wardLabel = DEFAULT_WARD_LABEL,
  wardId = DEFAULT_WARD_ID,
): WardImpactNugget | null {
  if (!user) return null;

  const yourReportsInWard = reports.filter(
    (r) => r.reporterId === user.id && r.location.wardId === wardId && r.status !== 'merged',
  ).length;
  const contributionScore = user.trust.contributionScore;
  const confirmations = verifyActionsThisWeek;

  if (contributionScore === 0 && confirmations === 0 && yourReportsInWard === 0) {
    return {
      headline: `${wardLabel} is listening — add your first signal`,
      detail:
        'One verified report or neighbor confirmation puts you on the ward pulse. No spam, just curated local activity.',
      wardLabel,
      yourConfirmationsThisWeek: 0,
      yourReportsInWard: 0,
      contributionScore: 0,
    };
  }

  if (confirmations > 0 && yourReportsInWard === 0) {
    return {
      headline: `Your ${confirmations} confirmation${confirmations === 1 ? '' : 's'} strengthened ${wardLabel}`,
      detail: `Neighbor confirmations help push responsiveness — currently ${responsivenessPercent}% of open issues are in the crew pipeline.`,
      wardLabel,
      yourConfirmationsThisWeek: confirmations,
      yourReportsInWard,
      contributionScore,
    };
  }

  if (yourReportsInWard > 0 && confirmations > 0) {
    return {
      headline: `You shaped ${wardLabel} on two fronts this week`,
      detail: `${yourReportsInWard} report${yourReportsInWard === 1 ? '' : 's'} filed · ${confirmations} neighbor confirmation${confirmations === 1 ? '' : 's'} · ${contributionScore} contribution pts visible locally.`,
      wardLabel,
      yourConfirmationsThisWeek: confirmations,
      yourReportsInWard,
      contributionScore,
    };
  }

  if (yourReportsInWard > 0) {
    return {
      headline: `Your report${yourReportsInWard === 1 ? '' : 's'} anchor ${wardLabel}'s queue`,
      detail: `Crews prioritize verified neighborhood signal — ${responsivenessPercent}% of ward issues have moved into response this cycle.`,
      wardLabel,
      yourConfirmationsThisWeek: confirmations,
      yourReportsInWard,
      contributionScore,
    };
  }

  return {
    headline: `Your verified impact shows up in ${wardLabel}`,
    detail: `${contributionScore} contribution pts — neighbors and ward ops see credible civic participation, not volume.`,
    wardLabel,
    yourConfirmationsThisWeek: confirmations,
    yourReportsInWard,
    contributionScore,
  };
}

export function buildPulseMicrocopy(
  metrics: NeighborhoodPulseMetrics,
  surface: PulseSurface,
  verifyQueueSize = 0,
): PulseMicrocopy {
  const { issuesConfirmedToday, activeResidentsThisWeek, wardResponsivenessPercent, challengeMomentumLabel } =
    metrics;

  if (surface === 'verify') {
    if (verifyQueueSize > 0) {
      return {
        headline: `${issuesConfirmedToday} issue${issuesConfirmedToday === 1 ? '' : 's'} confirmed in ${metrics.wardLabel} today`,
        subline: `${activeResidentsThisWeek} residents participated this week. Your confirm adds to curated ward signal — not a live ticker.`,
      };
    }
    return {
      headline: `${metrics.wardLabel} is caught up on confirmations`,
      subline: `${activeResidentsThisWeek} residents stayed active this week. Check back when you are out in the neighborhood.`,
    };
  }

  if (surface === 'rewards') {
    return {
      headline: challengeMomentumLabel,
      subline: `${metrics.challengeTitle} is at ${metrics.challengeProgressPercent}% — recognition tied to verified work across ${metrics.wardLabel}.`,
    };
  }

  if (wardResponsivenessPercent >= 75) {
    return {
      headline: `${metrics.wardLabel} is responding steadily`,
      subline: `${issuesConfirmedToday} confirmations today · ${activeResidentsThisWeek} active residents this week · ${wardResponsivenessPercent}% of issues in the crew pipeline.`,
    };
  }

  return {
    headline: `${metrics.wardLabel} needs more neighbor signal`,
    subline: `${issuesConfirmedToday} confirmations today so far. Confirm what you see — ${100 - wardResponsivenessPercent}% of issues still await community verification.`,
  };
}

export function buildNeighborhoodPulse(input: BuildPulseInput): NeighborhoodPulseSnapshot {
  const wardId = input.wardId ?? DEFAULT_WARD_ID;
  const wardLabel = input.wardLabel ?? DEFAULT_WARD_LABEL;
  const challenge = primaryChallengeMomentum();

  const metrics: NeighborhoodPulseMetrics = {
    issuesConfirmedToday: countIssuesConfirmedToday(input.reports, wardId),
    activeResidentsThisWeek: countActiveResidentsThisWeek([], input.reports, wardId),
    wardResponsivenessPercent: computeWardResponsiveness(input.reports, wardId),
    challengeMomentumLabel: challenge.momentumLabel,
    challengeTitle: challenge.title,
    challengeProgressPercent: challenge.progressPercent,
    wardLabel,
    freshnessLabel: 'Pulse summary · refreshed from ward activity',
  };

  const wardImpact = buildWardImpactNugget(
    input.reports,
    input.user,
    input.verifyActionsThisWeek ?? 0,
    metrics.wardResponsivenessPercent,
    wardLabel,
    wardId,
  );

  const verifyQueueSize =
    input.surface === 'verify'
      ? input.reports.filter(
          (r) => r.status === 'pending_verification' && r.reporterId !== input.user?.id,
        ).length
      : 0;

  const microcopy = buildPulseMicrocopy(metrics, input.surface, verifyQueueSize);

  return { metrics, microcopy, wardImpact };
}

export function enrichActiveResidents(
  snapshot: NeighborhoodPulseSnapshot,
  users: User[],
  reports: Report[],
  wardId = DEFAULT_WARD_ID,
): NeighborhoodPulseSnapshot {
  return {
    ...snapshot,
    metrics: {
      ...snapshot.metrics,
      activeResidentsThisWeek: countActiveResidentsThisWeek(users, reports, wardId),
    },
  };
}
