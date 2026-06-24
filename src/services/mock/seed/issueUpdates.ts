import type { IssueUpdate } from '@/types';

export function buildSeedIssueUpdates(): IssueUpdate[] {
  return [
    {
      id: 'update-001',
      reportId: 'report-001',
      kind: 'system',
      message: 'Report received and queued for neighborhood confirmation.',
      createdAt: '2026-06-18T09:05:00Z',
      actorLabel: 'CivicResolve',
    },
    {
      id: 'update-002',
      reportId: 'report-001',
      kind: 'community',
      message: '4 neighbors confirmed the school-crossing pothole — routed to road maintenance.',
      createdAt: '2026-06-18T14:00:00Z',
      actorLabel: 'Community',
    },
    {
      id: 'update-003',
      reportId: 'report-001',
      kind: 'crew',
      message: 'Verified and routed to road maintenance.',
      createdAt: '2026-06-20T11:00:00Z',
      actorLabel: 'Ward ops',
    },
    {
      id: 'update-004',
      reportId: 'report-002',
      kind: 'system',
      message: 'High-severity leak at Lakeview Apartments — same-day crew review triggered.',
      createdAt: '2026-06-19T14:10:00Z',
      actorLabel: 'CivicResolve',
    },
    {
      id: 'update-005',
      reportId: 'report-002',
      kind: 'crew',
      message: 'Field crew lead assigned — repair scheduled.',
      createdAt: '2026-06-21T09:00:00Z',
      actorLabel: 'Field crew',
    },
    {
      id: 'update-006',
      reportId: 'report-003',
      kind: 'system',
      message: 'Awaiting one more neighbor confirmation before routing.',
      createdAt: '2026-06-22T20:05:00Z',
      actorLabel: 'CivicResolve',
    },
    {
      id: 'update-007',
      reportId: 'report-003',
      kind: 'community',
      message: '1 neighbor confirmed Park Lane streetlight is out — one more confirmation helps routing.',
      createdAt: '2026-06-23T08:00:00Z',
      actorLabel: 'Community',
    },
    {
      id: 'update-008',
      reportId: 'report-004',
      kind: 'crew',
      message: 'Russell Market cleanup completed — before/after proof uploaded by sanitation crew.',
      createdAt: '2026-06-17T16:00:00Z',
      actorLabel: 'Sanitation crew',
    },
    {
      id: 'update-009',
      reportId: 'report-006',
      kind: 'system',
      message: 'Acknowledged by ward desk. Inspection window: 48 hours.',
      createdAt: '2026-06-22T09:00:00Z',
      actorLabel: 'Ward ops',
    },
  ];
}

export const seedIssueUpdates = buildSeedIssueUpdates();
