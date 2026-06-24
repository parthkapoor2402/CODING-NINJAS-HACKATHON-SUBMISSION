import type { ReportStatus, Severity } from '@/types';

export function statusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    pending_verification: 'Needs confirmation',
    verified: 'Verified',
    acknowledged: 'Acknowledged',
    in_progress: 'In progress',
    resolved: 'Fixed',
    rejected: 'Rejected',
    merged: 'Merged',
  };
  return labels[status];
}

export function severityLabel(severity: Severity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function categoryLabel(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
