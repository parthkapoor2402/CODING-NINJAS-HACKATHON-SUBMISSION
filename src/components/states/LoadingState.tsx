import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  label?: string;
  className?: string;
  variant?: 'spinner' | 'skeleton' | 'cards';
}

export function LoadingState({
  label = 'Loading…',
  className,
  variant = 'spinner',
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3 animate-fade-in', className)}>
        <Skeleton className="h-40 w-full rounded-card" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-3 animate-fade-in', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-card border bg-card shadow-card">
            <div className="shimmer h-32 w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
        <p className="text-center text-xs text-muted-foreground">{label}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 animate-fade-in',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-civic-blue-600" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export function LoadingCard() {
  return <LoadingState variant="skeleton" />;
}
