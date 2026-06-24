import type { ReportStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { statusLabel } from '@/utils/labels';

const variantMap: Record<
  ReportStatus,
  'verified' | 'pending' | 'rejected' | 'secondary' | 'default'
> = {
  draft: 'secondary',
  submitted: 'secondary',
  pending_verification: 'pending',
  verified: 'verified',
  acknowledged: 'default',
  in_progress: 'default',
  resolved: 'verified',
  rejected: 'rejected',
  merged: 'secondary',
};

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]} className={className}>
      {statusLabel(status)}
    </Badge>
  );
}
