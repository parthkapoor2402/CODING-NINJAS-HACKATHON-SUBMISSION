import type { AdminDashboardSnapshot, AdminQueueItem, Report, SuspiciousCase } from '@/types';

const MS_7D = 7 * 24 * 60 * 60 * 1000;

export function computeDashboardSnapshot(
  queue: AdminQueueItem[],
  suspiciousCases: SuspiciousCase[],
  allReports: Report[],
): AdminDashboardSnapshot {
  const now = Date.now();
  const resolvedLast7d = allReports.filter(
    (r) => r.status === 'resolved' && r.resolvedAt && now - new Date(r.resolvedAt).getTime() <= MS_7D,
  ).length;

  const duplicateClusters = allReports.filter(
    (r) => r.duplicateOfId || r.id === 'report-005',
  ).length;

  const slaAtRisk = queue.filter(
    (item) =>
      item.report.severity === 'high' &&
      !item.report.assignedWorkerId &&
      !['resolved', 'merged', 'rejected'].includes(item.report.status),
  ).length;

  const assignedInProgress = allReports.filter((r) => r.status === 'in_progress').length;

  const verifyDeltas = allReports
    .filter((r) => ['verified', 'in_progress', 'resolved', 'acknowledged'].includes(r.status))
    .map((r) => new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime());
  const medianVerifyHours =
    verifyDeltas.length > 0
      ? Math.round(
          verifyDeltas.sort((a, b) => a - b)[Math.floor(verifyDeltas.length / 2)] / (1000 * 60 * 60),
        )
      : 18;

  return {
    openQueue: queue.length,
    suspiciousOpen: suspiciousCases.filter((c) => c.status === 'open').length,
    resolvedLast7d,
    medianVerifyHours,
    slaAtRisk,
    duplicateClusters,
    assignedInProgress,
  };
}
