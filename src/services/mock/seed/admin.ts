import type { AdminQueueItem, SuspiciousCase } from '@/types';
import { getUserById } from './users';
import { seedReports } from './reports';

function priorityForReport(reportId: string): number {
  const report = seedReports.find((r) => r.id === reportId);
  if (!report) return 0;
  const severityWeight = { low: 1, medium: 2, high: 3 }[report.severity];
  return severityWeight * 10 + report.corroborationCount;
}

export const seedAdminQueue: AdminQueueItem[] = seedReports
  .filter((r) => !['resolved', 'merged', 'rejected'].includes(r.status))
  .map((report) => {
    const reporter = getUserById(report.reporterId)!;
    return {
      report,
      reporter,
      priorityScore: priorityForReport(report.id),
      duplicateRisk: report.duplicateOfId ? 95 : report.id === 'report-005' ? 88 : 15,
      slaDueAt: report.severity === 'high' ? '2026-06-25T12:00:00Z' : undefined,
    };
  })
  .sort((a, b) => b.priorityScore - a.priorityScore);

export const seedSuspiciousCases: SuspiciousCase[] = [
  {
    id: 'suspicious-001',
    reportId: 'report-005',
    userId: 'user-citizen-1',
    reason: 'High duplicate risk — near-identical location and category',
    riskScore: 88,
    status: 'reviewing',
    kind: 'duplicate',
    createdAt: '2026-06-19T10:30:00Z',
  },
  {
    id: 'suspicious-002',
    userId: 'user-citizen-1',
    reason: 'Velocity spike — 5 reports in 1 hour (simulated)',
    riskScore: 72,
    status: 'open',
    kind: 'velocity',
    createdAt: '2026-06-20T15:00:00Z',
  },
  {
    id: 'suspicious-003',
    reportId: 'report-003',
    reason: 'Photo is dark or distant — a clearer image helps crews and neighbors verify quickly',
    riskScore: 35,
    status: 'open',
    kind: 'media_quality',
    createdAt: '2026-06-22T21:00:00Z',
  },
  {
    id: 'suspicious-004',
    userId: 'user-citizen-1',
    reason: 'Reward farming pattern — corroboration ring on duplicate cluster',
    riskScore: 81,
    status: 'open',
    kind: 'reward_farming',
    createdAt: '2026-06-21T11:00:00Z',
  },
];
