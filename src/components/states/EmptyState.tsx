import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'civic';
  testId?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  illustration,
  action,
  actionLabel,
  onAction,
  className,
  variant = 'default',
  testId,
}: EmptyStateProps) {
  return (
    <div
      data-testid={testId}
      className={cn(
        'flex flex-col items-center rounded-card border border-dashed px-6 py-10 text-center animate-slide-up',
        variant === 'civic' ? 'border-civic-blue-100 bg-civic-blue-50/40' : 'bg-card',
        className,
      )}
    >
      {illustration ?? (
        <div
          className={cn(
            'empty-icon-enter mb-4 flex h-16 w-16 items-center justify-center rounded-2xl',
            variant === 'civic' ? 'bg-civic-blue-100 text-civic-blue-600' : 'bg-muted text-muted-foreground',
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ?? (actionLabel && onAction ? (
        <Button className="mt-6" variant="civic" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null)}
    </div>
  );
}
