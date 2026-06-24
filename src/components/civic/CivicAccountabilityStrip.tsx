import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CivicAccountabilityStripProps {
  className?: string;
  compact?: boolean;
}

export function CivicAccountabilityStrip({ className, compact }: CivicAccountabilityStripProps) {
  return (
    <div
      data-testid="civic-accountability-strip"
      className={cn(
        'flex items-start gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2',
        compact && 'py-1.5',
        className,
      )}
      role="note"
    >
      <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-civic-blue-700" aria-hidden />
      <p className={cn('leading-relaxed text-muted-foreground', compact ? 'text-[10px]' : 'text-[11px]')}>
        <span className="font-semibold text-foreground">Transparent by design.</span>{' '}
        Community verification before crew routing · public resolution status · verified impact only for
        rewards — no points for noise or duplicates.
      </p>
    </div>
  );
}
