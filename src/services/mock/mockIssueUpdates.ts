import type { IssueUpdate } from '@/types';
import { buildSeedIssueUpdates } from '@/services/mock/seed/issueUpdates';
import { delay } from '@/utils/format';

let updates: IssueUpdate[] = buildSeedIssueUpdates();

export function resetMockIssueUpdates(): void {
  updates = buildSeedIssueUpdates();
}

export async function getIssueUpdatesForReport(reportId: string): Promise<IssueUpdate[]> {
  await delay(80);
  return updates
    .filter((u) => u.reportId === reportId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function appendIssueUpdate(
  reportId: string,
  update: Omit<IssueUpdate, 'id' | 'reportId'>,
): Promise<IssueUpdate> {
  await delay(60);
  const entry: IssueUpdate = {
    id: `update-${Date.now()}`,
    reportId,
    ...update,
  };
  updates.push(entry);
  return entry;
}
