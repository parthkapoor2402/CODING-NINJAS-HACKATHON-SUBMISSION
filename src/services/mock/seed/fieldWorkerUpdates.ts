import type { FieldWorkerUpdate } from '@/types';

export function buildSeedFieldWorkerUpdates(): FieldWorkerUpdate[] {
  return [
    {
      id: 'fw-001',
      reportId: 'report-002',
      workerId: 'user-worker-1',
      message: 'On site — water valve shut off, repair crew digging access.',
      createdAt: '2026-06-22T11:00:00Z',
      kind: 'status',
    },
    {
      id: 'fw-002',
      reportId: 'report-002',
      workerId: 'user-worker-1',
      message: 'Temporary patch applied; monitoring pressure overnight.',
      createdAt: '2026-06-23T09:30:00Z',
      kind: 'note',
    },
    {
      id: 'fw-003',
      reportId: 'report-002',
      workerId: 'user-worker-1',
      message: 'Resolution proof submitted for admin review.',
      createdAt: '2026-06-23T18:00:00Z',
      kind: 'proof_submitted',
    },
    {
      id: 'fw-004',
      reportId: 'report-001',
      workerId: 'user-worker-2',
      message: 'Inspection scheduled — road crew ETA 24h.',
      createdAt: '2026-06-20T14:00:00Z',
      kind: 'status',
    },
  ];
}

export const seedFieldWorkerUpdates = buildSeedFieldWorkerUpdates();
