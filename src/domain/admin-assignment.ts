import type { Report } from '@/types';

const TERMINAL_STATUSES: Report['status'][] = ['resolved', 'merged', 'rejected'];

export function canAssignReport(report: Report): boolean {
  return !TERMINAL_STATUSES.includes(report.status);
}

export function applyAssignment(report: Report, workerId: string): Report {
  if (!canAssignReport(report)) {
    throw new Error(`Cannot assign worker to report in status ${report.status}`);
  }

  const shouldProgress =
    report.status === 'verified' ||
    report.status === 'acknowledged' ||
    report.status === 'pending_verification';

  return {
    ...report,
    assignedWorkerId: workerId,
    status: shouldProgress ? 'in_progress' : report.status,
    updatedAt: new Date().toISOString(),
  };
}
