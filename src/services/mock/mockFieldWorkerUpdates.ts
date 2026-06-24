import type { FieldWorkerUpdate } from '@/types';
import { buildSeedFieldWorkerUpdates } from '@/services/mock/seed/fieldWorkerUpdates';
import { delay } from '@/utils/format';

let updates: FieldWorkerUpdate[] = buildSeedFieldWorkerUpdates();

export function resetMockFieldWorkerUpdates(): void {
  updates = buildSeedFieldWorkerUpdates();
}

export async function getFieldWorkerUpdatesForReport(reportId: string): Promise<FieldWorkerUpdate[]> {
  await delay(60);
  return updates
    .filter((u) => u.reportId === reportId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function appendFieldWorkerUpdate(
  update: Omit<FieldWorkerUpdate, 'id'>,
): Promise<FieldWorkerUpdate> {
  await delay(80);
  const entry: FieldWorkerUpdate = { id: `fw-${Date.now()}`, ...update };
  updates.push(entry);
  return entry;
}
