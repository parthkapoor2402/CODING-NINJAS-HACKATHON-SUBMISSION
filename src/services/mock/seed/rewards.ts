import type { Badge, RewardEvent } from '@/types';
import type { RewardCatalogItem } from '@/domain/reward-catalog';

export const seedCatalog: RewardCatalogItem[] = [
  {
    id: 'perk-coffee',
    name: 'Neighborhood cafe discount',
    description: '10% off at participating cafes',
    pointsCost: 100,
    minTrustScore: 70,
  },
  {
    id: 'perk-transit',
    name: 'Transit day pass',
    description: 'Single-day metro credit',
    pointsCost: 200,
    minTrustScore: 80,
  },
];

export const seedBadges: Badge[] = [
  {
    id: 'badge-first-report',
    name: 'First Verified Report',
    description: 'Submitted your first verified community issue.',
    icon: 'shield-check',
    criteria: '1 verified report',
  },
  {
    id: 'badge-duplicate-defender',
    name: 'Duplicate Defender',
    description: 'Supported existing reports instead of creating duplicates.',
    icon: 'users',
    criteria: '5 corroborations',
  },
  {
    id: 'badge-streak',
    name: 'Streak Keeper',
    description: 'Checked in 7 days in a row.',
    icon: 'flame',
    criteria: '7-day streak',
  },
  {
    id: 'badge-ward-patrol',
    name: 'Ward Patrol',
    description: 'Verified impact across your ward.',
    icon: 'map-pin',
    criteria: '3 verified reports',
  },
  {
    id: 'badge-verifier',
    name: 'Neighborhood Verifier',
    description: 'Ten neighbor confirmations.',
    icon: 'eye',
    criteria: '10 corroborations',
  },
];

export const seedRewards: RewardEvent[] = [
  {
    id: 'reward-001',
    userId: 'user-citizen-1',
    type: 'verified_report',
    points: 50,
    badgeId: 'badge-first-report',
    reportId: 'report-001',
    verified: true,
    createdAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'reward-002',
    userId: 'user-citizen-1',
    type: 'corroboration',
    points: 25,
    reportId: 'report-002',
    verified: true,
    createdAt: '2026-06-19T16:00:00Z',
  },
  {
    id: 'reward-003',
    userId: 'user-citizen-1',
    type: 'resolution',
    points: 30,
    reportId: 'report-004',
    verified: true,
    createdAt: '2026-06-17T16:00:00Z',
  },
  {
    id: 'reward-pending-001',
    userId: 'user-citizen-1',
    type: 'submitted_report',
    points: 50,
    reportId: 'report-003',
    verified: false,
    createdAt: '2026-06-22T20:00:00Z',
  },
  {
    id: 'reward-youth-001',
    userId: 'user-youth-1',
    type: 'support_existing',
    points: 10,
    verified: true,
    createdAt: '2026-06-22T12:00:00Z',
  },
];
