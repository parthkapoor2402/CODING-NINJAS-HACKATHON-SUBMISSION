import { describe, expect, it } from 'vitest';
import {
  distanceKm,
  sortIssuesByDistance,
  sortIssuesByUrgency,
  urgencyScore,
  withDistances,
} from '@/lib/issue-sorting';
import type { Report } from '@/types';

const baseReport = (overrides: Partial<Report>): Report => ({
  id: 'r1',
  reporterId: 'user-1',
  category: 'pothole',
  description: 'Test issue',
  severity: 'medium',
  status: 'submitted',
  location: { lat: 12.9716, lng: 77.5946 },
  mediaIds: [],
  corroborationCount: 0,
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-01T00:00:00Z',
  ...overrides,
});

describe('issue-sorting', () => {
  it('U37: sort by distance — nearest issue first', () => {
    const items = withDistances(
      [
        baseReport({ id: 'far', location: { lat: 12.98, lng: 77.6 } }),
        baseReport({ id: 'near', location: { lat: 12.9717, lng: 77.5947 } }),
      ],
      12.9716,
      77.5946,
    );
    const sorted = sortIssuesByDistance(items);
    expect(sorted[0].report.id).toBe('near');
    expect(sorted[1].report.id).toBe('far');
  });

  it('U38: sort by urgency — high severity / pending verification prioritized', () => {
    const reports = [
      baseReport({ id: 'low', severity: 'low', status: 'verified' }),
      baseReport({ id: 'urgent', severity: 'high', status: 'pending_verification' }),
      baseReport({ id: 'mid', severity: 'medium', status: 'in_progress' }),
    ];
    const sorted = sortIssuesByUrgency(reports);
    expect(sorted[0].id).toBe('urgent');
  });

  it('U39: urgency tie-breaker — higher severity before lower at same status', () => {
    const high = baseReport({ id: 'high', severity: 'high', status: 'pending_verification' });
    const low = baseReport({ id: 'low', severity: 'low', status: 'pending_verification' });
    expect(urgencyScore(high)).toBeGreaterThan(urgencyScore(low));
    const sorted = sortIssuesByUrgency([low, high]);
    expect(sorted[0].id).toBe('high');
  });

  it('U40: distance calculation — haversine km between user and issue', () => {
    const km = distanceKm(12.9716, 77.5946, 12.9716, 77.6046);
    expect(km).toBeGreaterThan(0.9);
    expect(km).toBeLessThan(1.2);
  });
});
