import type { Report } from '@/types';

export const TIMELINE_STEPS = [
  'Reported',
  'Under review',
  'Community verified',
  'Assigned',
  'In progress',
  'Resolved',
  'Reopened',
] as const;

export type TimelineStepLabel = (typeof TIMELINE_STEPS)[number];

export interface TimelineStepVisual {
  dot: string;
  line: string;
  label: string;
  ring: string;
  compact: string;
}

export const STEP_VISUAL: Record<TimelineStepLabel, TimelineStepVisual> = {
  Reported: {
    dot: 'bg-slate-500',
    line: 'bg-slate-300',
    label: 'text-slate-700',
    ring: 'ring-slate-300',
    compact: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  'Under review': {
    dot: 'bg-civic-amber-500',
    line: 'bg-civic-amber-200',
    label: 'text-civic-amber-900',
    ring: 'ring-civic-amber-300',
    compact: 'bg-civic-amber-50 text-civic-amber-900 border-civic-amber-200',
  },
  'Community verified': {
    dot: 'bg-civic-teal-500',
    line: 'bg-civic-teal-200',
    label: 'text-civic-teal-900',
    ring: 'ring-civic-teal-300',
    compact: 'bg-civic-teal-50 text-civic-teal-900 border-civic-teal-200',
  },
  Assigned: {
    dot: 'bg-civic-blue-500',
    line: 'bg-civic-blue-200',
    label: 'text-civic-blue-900',
    ring: 'ring-civic-blue-300',
    compact: 'bg-civic-blue-50 text-civic-blue-900 border-civic-blue-200',
  },
  'In progress': {
    dot: 'bg-orange-500',
    line: 'bg-orange-200',
    label: 'text-orange-900',
    ring: 'ring-orange-300',
    compact: 'bg-orange-50 text-orange-900 border-orange-200',
  },
  Resolved: {
    dot: 'bg-emerald-600',
    line: 'bg-emerald-200',
    label: 'text-emerald-900',
    ring: 'ring-emerald-300',
    compact: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  },
  Reopened: {
    dot: 'bg-civic-coral-500',
    line: 'bg-civic-coral-200',
    label: 'text-civic-coral-900',
    ring: 'ring-civic-coral-200',
    compact: 'bg-civic-coral-50 text-civic-coral-900 border-civic-coral-200',
  },
};

export function getTimelineStepIndex(
  report: Pick<Report, 'status' | 'assignedWorkerId' | 'reopenedAt'>,
): number {
  if (report.reopenedAt && report.status !== 'resolved') {
    return TIMELINE_STEPS.indexOf('Reopened');
  }

  switch (report.status) {
    case 'resolved':
      return TIMELINE_STEPS.indexOf('Resolved');
    case 'in_progress':
      return TIMELINE_STEPS.indexOf('In progress');
    case 'acknowledged':
      return report.assignedWorkerId
        ? TIMELINE_STEPS.indexOf('Assigned')
        : TIMELINE_STEPS.indexOf('Community verified');
    case 'verified':
      return TIMELINE_STEPS.indexOf('Community verified');
    case 'pending_verification':
      return TIMELINE_STEPS.indexOf('Under review');
    case 'submitted':
      return TIMELINE_STEPS.indexOf('Reported');
    case 'merged':
    case 'rejected':
      return TIMELINE_STEPS.indexOf('Under review');
    default:
      return 0;
  }
}

const STEP_EXPLAINERS: Record<TimelineStepLabel, string> = {
  Reported: 'Your report is logged. Neighbors may be asked to confirm what they see.',
  'Under review': 'We are checking details and looking for similar reports nearby.',
  'Community verified': 'Neighbors confirmed this issue — crews can prioritize it with more confidence.',
  Assigned: 'A field crew has been assigned to inspect or fix this issue.',
  'In progress': 'Crews are actively working on a fix.',
  Resolved: 'Marked fixed. You can reopen if the problem persists.',
  Reopened: 'You flagged that the fix did not hold. The issue is back in the queue.',
};

export function getStateExplainer(
  report: Pick<Report, 'status' | 'assignedWorkerId' | 'reopenedAt'>,
): string {
  const step = TIMELINE_STEPS[getTimelineStepIndex(report)];
  return STEP_EXPLAINERS[step];
}
