import type { ResolutionProof } from '@/types';

export function buildSeedResolutionProofs(): ResolutionProof[] {
  return [
    {
      id: 'proof-001',
      reportId: 'report-004',
      workerId: 'user-worker-1',
      beforeMediaId: 'media-004',
      afterMediaId: 'media-004',
      notes: 'Bus stop cleared; before/after photos from sanitation crew.',
      status: 'approved',
      submittedAt: '2026-06-17T15:30:00Z',
      reviewedAt: '2026-06-17T16:00:00Z',
      reviewedByAdminId: 'user-admin-1',
    },
    {
      id: 'proof-002',
      reportId: 'report-002',
      workerId: 'user-worker-1',
      beforeMediaId: 'media-002',
      notes: 'Pipe clamp installed — awaiting after photo upload.',
      status: 'pending_review',
      submittedAt: '2026-06-23T18:00:00Z',
    },
  ];
}

export const seedResolutionProofs = buildSeedResolutionProofs();
