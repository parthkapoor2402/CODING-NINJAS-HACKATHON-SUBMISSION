import { cn } from '@/lib/utils';

export type CivicProgressVariant = 'default' | 'teal' | 'rank' | 'amber' | 'unlock' | 'white';

const fillStyles: Record<CivicProgressVariant, string> = {
  default: 'bg-civic-blue-500',
  teal: 'bg-gradient-to-r from-civic-blue-500 to-civic-teal-500',
  rank: 'bg-white',
  amber: 'bg-gradient-to-r from-civic-amber-400 to-civic-amber-500',
  unlock: 'bg-gradient-to-r from-civic-blue-400 to-civic-teal-400',
  white: 'bg-white',
};

interface CivicProgressBarProps {
  value: number;
  variant?: CivicProgressVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  trackClassName?: string;
  'aria-label'?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
};

export function CivicProgressBar({
  value,
  variant = 'teal',
  size = 'sm',
  className,
  trackClassName,
  'aria-label': ariaLabel,
}: CivicProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('civic-progress-track overflow-hidden rounded-full bg-muted', sizeStyles[size], trackClassName)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className={cn('civic-progress-fill h-full rounded-full', fillStyles[variant], className)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
