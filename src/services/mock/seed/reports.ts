import type { Report } from '@/types';

/** Seed coordinates centered on a demo neighborhood (Bengaluru-ish) */
const BASE = { lat: 12.9716, lng: 77.5946 };

export function buildSeedReports(): Report[] {
  return [
    {
      id: 'report-001',
      reporterId: 'user-citizen-1',
      category: 'pothole',
      description:
        'Deep pothole at St. Mary\'s School crossing — two-wheelers swerving daily. Parents flagged safety before monsoon.',
      severity: 'high',
      status: 'verified',
      location: {
        lat: BASE.lat + 0.002,
        lng: BASE.lng + 0.001,
        address: "St. Mary's School crossing",
        wardId: 'ward-12',
      },
      mediaIds: ['media-001'],
      corroborationCount: 4,
      createdAt: '2026-06-18T09:00:00Z',
      updatedAt: '2026-06-20T11:00:00Z',
    },
    {
      id: 'report-002',
      reporterId: 'user-citizen-1',
      category: 'water_leak',
      description:
        'Pipe leak at Lakeview Apartments Block B — sidewalk flooding for two days. Elderly residents avoiding the path.',
      severity: 'high',
      status: 'in_progress',
      location: {
        lat: BASE.lat - 0.001,
        lng: BASE.lng + 0.002,
        address: 'Lakeview Apartments, Block B',
        wardId: 'ward-12',
      },
      mediaIds: ['media-002'],
      corroborationCount: 3,
      assignedWorkerId: 'user-worker-1',
      createdAt: '2026-06-19T14:00:00Z',
      updatedAt: '2026-06-23T10:00:00Z',
    },
    {
      id: 'report-003',
      reporterId: 'user-citizen-1',
      category: 'streetlight',
      description:
        'Broken streetlight on Park Lane — the lane stays dark after dusk. Evening walkers use phone flashlights.',
      severity: 'medium',
      status: 'pending_verification',
      location: {
        lat: BASE.lat + 0.001,
        lng: BASE.lng - 0.002,
        address: 'Park Lane',
        wardId: 'ward-11',
      },
      mediaIds: ['media-003'],
      corroborationCount: 1,
      createdAt: '2026-06-22T20:00:00Z',
      updatedAt: '2026-06-22T20:00:00Z',
    },
    {
      id: 'report-004',
      reporterId: 'user-citizen-1',
      category: 'garbage',
      description:
        'Overflowing waste near Russell Market entrance — odor and pests affecting shopkeepers and commuters.',
      severity: 'medium',
      status: 'resolved',
      location: {
        lat: BASE.lat - 0.002,
        lng: BASE.lng - 0.001,
        address: 'Russell Market entrance',
        wardId: 'ward-11',
      },
      mediaIds: ['media-004'],
      corroborationCount: 5,
      createdAt: '2026-06-10T08:00:00Z',
      updatedAt: '2026-06-17T16:00:00Z',
      resolvedAt: '2026-06-17T16:00:00Z',
    },
    {
      id: 'report-005',
      reporterId: 'user-citizen-1',
      category: 'pothole',
      description: 'Same school crossing area — smaller crack forming beside the main pothole.',
      severity: 'low',
      status: 'merged',
      location: {
        lat: BASE.lat + 0.0021,
        lng: BASE.lng + 0.0011,
        address: "St. Mary's School crossing",
        wardId: 'ward-12',
      },
      mediaIds: [],
      duplicateOfId: 'report-001',
      corroborationCount: 0,
      createdAt: '2026-06-19T10:00:00Z',
      updatedAt: '2026-06-19T12:00:00Z',
    },
    {
      id: 'report-006',
      reporterId: 'user-citizen-1',
      category: 'sanitation',
      description: 'Blocked drain on 4th Block — foul smell spreading to adjacent shops.',
      severity: 'medium',
      status: 'acknowledged',
      location: {
        lat: BASE.lat + 0.003,
        lng: BASE.lng + 0.003,
        address: '4th Block main road',
        wardId: 'ward-13',
      },
      mediaIds: ['media-005'],
      corroborationCount: 2,
      createdAt: '2026-06-21T07:00:00Z',
      updatedAt: '2026-06-22T09:00:00Z',
    },
  ];
}

export function cloneSeedReports(): Report[] {
  return buildSeedReports();
}

export const seedReports: Report[] = buildSeedReports();

export const seedIssues = seedReports.filter((r) => r.status !== 'merged');

export function getSeedReportById(id: string): Report | undefined {
  return seedReports.find((r) => r.id === id);
}
