import { describe, expect, it } from 'vitest';
import {
  buildImpactSummary,
  buildSocialProof,
  computeDaysToResolution,
  estimateTrustGain,
  followMotivationCopy,
  routingTeamFor,
} from '@/domain/track-journey';
import type { Report } from '@/types';

const baseReport: Report = {
  id: 'report-test',
  reporterId: 'user-1',
  category: 'pothole',
  description: 'Test pothole',
  severity: 'high',
  status: 'verified',
  location: { lat: 0, lng: 0, wardId: 'ward-12' },
  mediaIds: [],
  corroborationCount: 4,
  createdAt: '2026-06-10T08:00:00Z',
  updatedAt: '2026-06-20T11:00:00Z',
};

describe('track-journey', () => {
  it('builds social proof chips for verified reports', () => {
    const chips = buildSocialProof(baseReport);
    expect(chips.some((c) => c.label.includes('4 neighbors'))).toBe(true);
    expect(chips.some((c) => c.label.includes('Ward 12'))).toBe(true);
    expect(chips.some((c) => c.label.includes('road maintenance'))).toBe(true);
  });

  it('builds impact summary for pending verification', () => {
    const summary = buildImpactSummary({
      ...baseReport,
      status: 'pending_verification',
      corroborationCount: 1,
    });
    expect(summary.headline).toMatch(/building neighborhood proof/i);
    expect(summary.detail).toMatch(/1 neighbor/);
  });

  it('computes days to resolution', () => {
    const days = computeDaysToResolution({
      ...baseReport,
      status: 'resolved',
      resolvedAt: '2026-06-17T16:00:00Z',
    });
    expect(days).toBe(8);
  });

  it('estimates higher trust gain for resolved reports', () => {
    const open = estimateTrustGain({ ...baseReport, status: 'verified' });
    const closed = estimateTrustGain({
      ...baseReport,
      status: 'resolved',
      resolvedAt: '2026-06-17T16:00:00Z',
    });
    expect(closed).toBeGreaterThan(open);
  });

  it('returns follow motivation for open issues', () => {
    const copy = followMotivationCopy({
      ...baseReport,
      status: 'pending_verification',
      corroborationCount: 1,
    });
    expect(copy?.title).toMatch(/follow this to resolution/i);
    expect(copy?.body).toMatch(/one more/i);
  });

  it('maps categories to routing teams', () => {
    expect(routingTeamFor('streetlight')).toBe('lighting crew');
    expect(routingTeamFor('water_leak')).toBe('water utility');
  });
});
