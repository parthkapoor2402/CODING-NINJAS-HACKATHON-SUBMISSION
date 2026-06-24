import { describe, expect, it } from 'vitest';
import { applyAssignment, canAssignReport } from '@/domain/admin-assignment';
import type { Report } from '@/types';

const openReport: Report = {
  id: 'report-test',
  reporterId: 'user-citizen-1',
  category: 'pothole',
  description: 'Test pothole',
  severity: 'high',
  status: 'verified',
  location: { lat: 12.97, lng: 77.59 },
  mediaIds: [],
  corroborationCount: 2,
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-01T00:00:00Z',
};

describe('admin-assignment', () => {
  it('U70: assigns worker and moves eligible status to in_progress', () => {
    const updated = applyAssignment(openReport, 'user-worker-1');
    expect(updated.assignedWorkerId).toBe('user-worker-1');
    expect(updated.status).toBe('in_progress');
  });

  it('U71: cannot assign terminal report', () => {
    const resolved = { ...openReport, status: 'resolved' as const };
    expect(canAssignReport(resolved)).toBe(false);
    expect(() => applyAssignment(resolved, 'user-worker-1')).toThrow(/Cannot assign/);
  });
});
