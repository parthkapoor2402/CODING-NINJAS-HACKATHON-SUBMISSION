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
      <div className={cn('space-y-3 animate-fade-in', className)} role="status" aria-live="polite">
        <Skeleton className="h-40 w-full rounded-card" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-3 animate-fade-in', className)} role="status" aria-live="polite">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-card border bg-card shadow-card"
            style={{ animationDelay: `${(i - 1) * 80}ms` }}
          >
            <div className="relative h-32 w-full overflow-hidden bg-muted">
              <div className="shimmer absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-civic-blue-200 border-t-civic-blue-600 civic-loading-pulse" />
              </div>
            </div>
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
        <p className="text-center text-xs font-medium text-muted-foreground civic-loading-pulse">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 animate-fade-in',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-civic-blue-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-civic-teal-500 animate-spin" />
        <Loader2 className="h-5 w-5 text-civic-blue-600 civic-loading-pulse" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export function LoadingCard() {
  return <LoadingState variant="skeleton" />;
}
