import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SuccessStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}

export function SuccessState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-card border border-civic-teal-500/20 bg-civic-teal-50/50 px-6 py-10 text-center animate-slide-up',
        className,
      )}
    >
      <div className="success-icon-enter mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-civic-teal-500 text-white shadow-elevated">
        <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
      </div>
      <h3 className="font-display text-lg font-bold text-civic-teal-600">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
        {actionLabel && onAction ? (
          <Button variant="teal" className="w-full" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
        {secondaryLabel && onSecondary ? (
          <Button variant="ghost" className="w-full" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
