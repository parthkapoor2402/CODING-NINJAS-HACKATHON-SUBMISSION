import type { AdminQueueItem, IssueCategory, ReportStatus, Severity } from '@/types';

export type AdminQueueFilters = {
  category: IssueCategory | 'all';
  severity: Severity | 'all';
  status: ReportStatus | 'all';
};

export const DEFAULT_ADMIN_QUEUE_FILTERS: AdminQueueFilters = {
  category: 'all',
  severity: 'all',
  status: 'all',
};

export function filterAdminQueue(
  queue: AdminQueueItem[],
  filters: AdminQueueFilters,
): AdminQueueItem[] {
  return queue.filter((item) => {
    if (filters.category !== 'all' && item.report.category !== filters.category) return false;
    if (filters.severity !== 'all' && item.report.severity !== filters.severity) return false;
    if (filters.status !== 'all' && item.report.status !== filters.status) return false;
    return true;
  });
}
