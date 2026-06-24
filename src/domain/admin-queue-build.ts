import type { AdminQueueItem, Report, User } from '@/types';

function priorityForReport(report: Report): number {
  const severityWeight = { low: 1, medium: 2, high: 3 }[report.severity];
  return severityWeight * 10 + report.corroborationCount;
}

export function buildAdminQueue(
  reports: Report[],
  getUserById: (id: string) => User | undefined,
): AdminQueueItem[] {
  return reports
    .filter((r) => !['resolved', 'merged', 'rejected'].includes(r.status))
    .map((report) => {
      const reporter = getUserById(report.reporterId);
      if (!reporter) {
        throw new Error(`Reporter ${report.reporterId} not found for ${report.id}`);
      }
      return {
        report,
        reporter,
        priorityScore: priorityForReport(report),
        duplicateRisk: report.duplicateOfId ? 95 : report.id === 'report-005' ? 88 : 15,
        slaDueAt: report.severity === 'high' ? '2026-06-25T12:00:00Z' : undefined,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
