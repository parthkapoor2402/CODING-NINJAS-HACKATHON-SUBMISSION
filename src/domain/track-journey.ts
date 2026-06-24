import type { IssueCategory, IssueUpdate, Report } from '@/types';
import { getTimelineStepIndex, TIMELINE_STEPS, type TimelineStepLabel } from '@/lib/issue-timeline';
import { categoryLabel } from '@/utils/labels';

const DAY_MS = 24 * 60 * 60 * 1000;

const ROUTING_TEAM: Record<IssueCategory, string> = {
  pothole: 'road maintenance',
  water_leak: 'water utility',
  streetlight: 'lighting crew',
  garbage: 'sanitation crew',
  sanitation: 'drainage team',
  infrastructure: 'public works',
  other: 'ward ops',
};

export interface SocialProofChip {
  id: string;
  label: string;
  tone: 'community' | 'official' | 'routing';
}

export interface ImpactSummary {
  headline: string;
  detail: string;
}

export interface ResolutionImpact {
  daysToResolve: number | null;
  trustGain: number;
  neighborConfirmations: number;
  routingTeam: string;
}

export function routingTeamFor(category: IssueCategory): string {
  return ROUTING_TEAM[category] ?? ROUTING_TEAM.other;
}

export function currentTimelineStep(
  report: Pick<Report, 'status' | 'assignedWorkerId' | 'reopenedAt'>,
): TimelineStepLabel {
  return TIMELINE_STEPS[getTimelineStepIndex(report)];
}

export function buildSocialProof(
  report: Pick<
    Report,
    'status' | 'corroborationCount' | 'category' | 'assignedWorkerId' | 'severity' | 'location'
  >,
): SocialProofChip[] {
  const chips: SocialProofChip[] = [];

  if (report.corroborationCount > 0) {
    const n = report.corroborationCount;
    chips.push({
      id: 'neighbors',
      label: n === 1 ? '1 neighbor confirmed' : `${n} neighbors confirmed`,
      tone: 'community',
    });
  }

  const escalated =
    report.status === 'verified' ||
    report.status === 'acknowledged' ||
    report.status === 'in_progress' ||
    report.status === 'resolved';

  if (escalated) {
    chips.push({
      id: 'escalated',
      label: `Escalated to ${report.location.wardId?.replace('ward-', 'Ward ') ?? 'ward ops'}`,
      tone: 'official',
    });
  }

  if (
    report.status === 'verified' ||
    report.status === 'acknowledged' ||
    report.status === 'in_progress' ||
    report.status === 'resolved' ||
    report.assignedWorkerId
  ) {
    chips.push({
      id: 'routed',
      label: `Routed to ${routingTeamFor(report.category)}`,
      tone: 'routing',
    });
  } else if (report.severity === 'high' && report.status === 'pending_verification') {
    chips.push({
      id: 'priority',
      label: 'High-severity — fast-track review',
      tone: 'official',
    });
  }

  return chips;
}

export function buildImpactSummary(
  report: Pick<
    Report,
    'status' | 'corroborationCount' | 'category' | 'description' | 'assignedWorkerId' | 'reopenedAt'
  >,
): ImpactSummary {
  const team = routingTeamFor(report.category);
  const cat = categoryLabel(report.category).toLowerCase();

  if (report.reopenedAt && report.status !== 'resolved') {
    return {
      headline: 'Your reopen kept crews accountable',
      detail:
        'Because you flagged that the fix did not hold, this issue is back in the official queue with your note attached.',
    };
  }

  switch (report.status) {
    case 'resolved':
      return {
        headline: 'Your report completed a civic fix',
        detail: `Neighbors confirmed the problem, crews from ${team} resolved it, and the outcome is on record for your ward.`,
      };
    case 'in_progress':
      return {
        headline: 'Your report put crews in motion',
        detail: `Community confirmations gave ward ops confidence to assign ${team}. Work is actively underway.`,
      };
    case 'acknowledged':
      return {
        headline: 'Official desk acknowledged your report',
        detail: `Ward ops logged your ${cat} issue and scheduled inspection — transparency you can follow here.`,
      };
    case 'verified':
      return {
        headline: 'Neighbors backed what you reported',
        detail: `Confirmations verified this ${cat} issue. It is now prioritized for ${team}.`,
      };
    case 'pending_verification':
      return {
        headline: 'Your report is building neighborhood proof',
        detail:
          report.corroborationCount > 0
            ? `${report.corroborationCount} neighbor${report.corroborationCount === 1 ? '' : 's'} already confirmed — more proof helps route to ${team}.`
            : `Neighbors are being asked to confirm. Verified community signal routes issues to ${team}.`,
      };
    default:
      return {
        headline: 'You put this issue on the civic record',
        detail: `Your ${cat} report is logged with ward transparency — updates appear here as the journey moves.`,
      };
  }
}

export function computeDaysToResolution(
  report: Pick<Report, 'createdAt' | 'resolvedAt' | 'status'>,
): number | null {
  if (report.status !== 'resolved' || !report.resolvedAt) return null;
  const start = new Date(report.createdAt).getTime();
  const end = new Date(report.resolvedAt).getTime();
  return Math.max(1, Math.ceil((end - start) / DAY_MS));
}

export function estimateTrustGain(
  report: Pick<Report, 'status' | 'corroborationCount' | 'resolvedAt'>,
): number {
  let gain = 3;
  if (report.corroborationCount > 0) {
    gain += Math.min(6, report.corroborationCount * 2);
  }
  if (report.status === 'resolved') {
    gain += 8;
  } else if (report.status === 'in_progress' || report.status === 'acknowledged') {
    gain += 4;
  } else if (report.status === 'verified') {
    gain += 2;
  }
  return gain;
}

export function buildResolutionImpact(report: Report): ResolutionImpact {
  return {
    daysToResolve: computeDaysToResolution(report),
    trustGain: estimateTrustGain(report),
    neighborConfirmations: report.corroborationCount,
    routingTeam: routingTeamFor(report.category),
  };
}

export function followMotivationCopy(
  report: Pick<Report, 'status' | 'corroborationCount' | 'category' | 'reopenedAt'>,
): { title: string; body: string; cta: string } | null {
  if (report.status === 'resolved') return null;

  if (report.reopenedAt) {
    return {
      title: 'Following through on your reopen',
      body: 'Ward ops will post crew actions here. You will see when inspection is scheduled and when proof is uploaded.',
      cta: 'Watch for official updates below',
    };
  }

  if (report.status === 'pending_verification') {
    const remaining = Math.max(0, 2 - report.corroborationCount);
    return {
      title: 'Follow this to resolution',
      body:
        remaining > 0
          ? `This issue needs ${remaining === 1 ? 'one more' : `${remaining} more`} neighbor confirmation${remaining === 1 ? '' : 's'} before routing to ${routingTeamFor(report.category)}.`
          : 'Enough neighbors have confirmed — routing should follow shortly. Stay here for the official handoff.',
      cta: 'Share with neighbors who can verify on-site',
    };
  }

  if (report.status === 'verified' || report.status === 'acknowledged') {
    return {
      title: 'Follow this to resolution',
      body: `Your verified report is in the ${routingTeamFor(report.category)} queue. Official updates will show assignment and field work.`,
      cta: 'Check back when crew status changes',
    };
  }

  if (report.status === 'in_progress') {
    return {
      title: 'Almost there — crews are on it',
      body: 'Field work is underway. Resolution proof and trust recognition unlock when the fix is verified.',
      cta: 'You will get credit when this closes resolved',
    };
  }

  return {
    title: 'Follow this to resolution',
    body: 'Every official step is logged here so you can see how your civic action moves through the system.',
    cta: 'Transparency builds trust in your neighborhood',
  };
}

export function narrativeUpdateLead(_update: IssueUpdate, index: number, total: number): string {
  if (index === total - 1) return 'Where it started';
  if (index === 0) return 'Latest';
  return 'Along the way';
}
