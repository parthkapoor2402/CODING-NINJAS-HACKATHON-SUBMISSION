import { describe, expect, it } from 'vitest';
import {
  buildCivicIdentitySnapshot,
  buildCivicStrengths,
  buildTrustMetrics,
  deriveNeighborhoodAffiliation,
  familyModeCopy,
  summarizeActivityHistory,
} from '@/domain/civic-identity';
import type { Report, RewardEvent, User } from '@/types';

const user: User = {
  id: 'user-citizen-1',
  email: 'demo@local.dev',
  displayName: 'Asha Verma',
  role: 'citizen',
  trust: {
    trustScore: 78,
    contributionScore: 240,
    verificationScore: 68,
    duplicateRisk: 0,
    abuseFlags: [],
  },
  createdAt: '2025-11-01T10:00:00Z',
  lastActiveAt: '2026-06-20T08:00:00Z',
};

const sampleRewards: RewardEvent[] = [
  {
    id: 'r1',
    userId: 'user-citizen-1',
    type: 'verified_report',
    points: 50,
    verified: true,
    createdAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'r2',
    userId: 'user-citizen-1',
    type: 'corroboration',
    points: 25,
    verified: true,
    createdAt: '2026-06-19T16:00:00Z',
  },
];

const sampleReports: Report[] = [
  {
    id: 'report-001',
    reporterId: 'user-citizen-1',
    category: 'pothole',
    description: 'Test',
    severity: 'high',
    status: 'verified',
    location: { lat: 0, lng: 0, wardId: 'ward-12' },
    mediaIds: [],
    corroborationCount: 4,
    createdAt: '2026-06-18T09:00:00Z',
    updatedAt: '2026-06-20T11:00:00Z',
  },
];

describe('civic-identity', () => {
  it('derives neighborhood from reports', () => {
    expect(deriveNeighborhoodAffiliation(sampleReports)).toMatch(/Ward 12/i);
  });

  it('builds identity snapshot with rank and impact', () => {
    const snapshot = buildCivicIdentitySnapshot(user, sampleRewards, sampleReports);
    expect(snapshot.civicRank).toBeTruthy();
    expect(snapshot.verifiedImpact).toBe(75);
    expect(snapshot.neighborhood).toMatch(/Ward 12/i);
  });

  it('builds three civic strengths', () => {
    const strengths = buildCivicStrengths(sampleRewards, sampleReports);
    expect(strengths).toHaveLength(3);
    expect(strengths.map((s) => s.id)).toEqual(['reporting', 'verification', 'follow-through']);
  });

  it('summarizes activity history', () => {
    const items = summarizeActivityHistory(sampleRewards, 2);
    expect(items).toHaveLength(2);
    expect(items[0].verified).toBe(true);
  });

  it('builds trust metrics', () => {
    const metrics = buildTrustMetrics(user.trust);
    expect(metrics).toHaveLength(3);
    expect(metrics[0].value).toBe(78);
  });

  it('tailors family copy by role', () => {
    expect(familyModeCopy('parent').title).toMatch(/family/i);
    expect(familyModeCopy('youth').title).toMatch(/supervised/i);
  });
});
