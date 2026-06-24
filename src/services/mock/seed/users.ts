import type { User } from '@/types';

const baseTrust = {
  trustScore: 72,
  contributionScore: 180,
  verificationScore: 68,
  duplicateRisk: 0,
  abuseFlags: [] as string[],
};

export const seedUsers: User[] = [
  {
    id: 'user-citizen-1',
    email: 'demo-citizen@local.dev',
    displayName: 'Asha Verma',
    role: 'citizen',
    trust: { ...baseTrust, trustScore: 78, contributionScore: 240 },
    createdAt: '2025-11-01T10:00:00Z',
    lastActiveAt: '2026-06-20T08:00:00Z',
  },
  {
    id: 'user-admin-1',
    email: 'demo-admin@local.dev',
    displayName: 'Ops Admin',
    role: 'admin',
    trust: { ...baseTrust, trustScore: 100, contributionScore: 0 },
    createdAt: '2025-10-01T10:00:00Z',
    lastActiveAt: '2026-06-24T09:00:00Z',
  },
  {
    id: 'user-youth-1',
    email: 'demo-youth@local.dev',
    displayName: 'Riya (Youth)',
    role: 'youth',
    youthProfileId: 'youth-1',
    familyHubId: 'family-1',
    trust: { ...baseTrust, trustScore: 55, contributionScore: 40 },
    createdAt: '2026-01-15T10:00:00Z',
    lastActiveAt: '2026-06-22T14:00:00Z',
  },
  {
    id: 'user-parent-1',
    email: 'demo-parent@local.dev',
    displayName: 'Priya Verma',
    role: 'parent',
    familyHubId: 'family-1',
    trust: { ...baseTrust, trustScore: 82, contributionScore: 120 },
    createdAt: '2025-11-01T10:00:00Z',
    lastActiveAt: '2026-06-23T18:00:00Z',
  },
  {
    id: 'user-worker-1',
    email: 'demo-worker@local.dev',
    displayName: 'Field Crew Lead',
    role: 'field_worker',
    trust: { ...baseTrust, trustScore: 90, contributionScore: 50 },
    createdAt: '2025-09-01T10:00:00Z',
    lastActiveAt: '2026-06-24T07:30:00Z',
  },
  {
    id: 'user-worker-2',
    email: 'demo-worker-2@local.dev',
    displayName: 'Road Maintenance Unit',
    role: 'field_worker',
    trust: { ...baseTrust, trustScore: 88, contributionScore: 42 },
    createdAt: '2025-09-15T10:00:00Z',
    lastActiveAt: '2026-06-23T16:00:00Z',
  },
  {
    id: 'user-moderator-1',
    email: 'mod@local.dev',
    displayName: 'Moderator',
    role: 'moderator',
    trust: { ...baseTrust, trustScore: 95, contributionScore: 10 },
    createdAt: '2025-08-01T10:00:00Z',
    lastActiveAt: '2026-06-24T08:00:00Z',
  },
];

export function getUserById(id: string): User | undefined {
  return seedUsers.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return seedUsers.find((u) => u.email === email);
}
