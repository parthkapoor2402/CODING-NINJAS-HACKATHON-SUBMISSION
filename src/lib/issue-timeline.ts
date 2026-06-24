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
