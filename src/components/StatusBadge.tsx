import {
  AlertCircle,
  CheckCircle2,
  Clock,
  GitMerge,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { ReportStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { statusLabel } from '@/utils/labels';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  ReportStatus,
  {
    variant: 'verified' | 'pending' | 'rejected' | 'secondary' | 'default' | 'progress' | 'acknowledged' | 'resolved' | 'muted';
    icon: typeof ShieldCheck;
    pulse?: boolean;
  }
> = {
  draft: { variant: 'muted', icon: Clock },
  submitted: { variant: 'secondary', icon: Sparkles },
  pending_verification: { variant: 'pending', icon: AlertCircle, pulse: true },
  verified: { variant: 'verified', icon: ShieldCheck },
  acknowledged: { variant: 'acknowledged', icon: CheckCircle2 },
  in_progress: { variant: 'progress', icon: Loader2 },
  resolved: { variant: 'resolved', icon: CheckCircle2 },
  rejected: { variant: 'rejected', icon: XCircle },
  merged: { variant: 'secondary', icon: GitMerge },
};

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn('shrink-0', className)}>
      {showIcon ? (
        <Icon
          className={cn(
            'h-3 w-3 shrink-0',
            status === 'in_progress' && 'animate-spin',
            config.pulse && 'text-civic-amber-700',
          )}
          aria-hidden
        />
      ) : null}
      {config.pulse ? (
        <span className="status-pulse-dot h-1.5 w-1.5 rounded-full bg-civic-amber-600" aria-hidden />
      ) : null}
      {statusLabel(status)}
    </Badge>
  );
}
