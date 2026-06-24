import { MapPin, TrendingUp } from 'lucide-react';
import type { WardImpactNugget } from '@/domain/neighborhood-pulse';
import { cn } from '@/lib/utils';

interface YourWardImpactNuggetProps {
  nugget: WardImpactNugget;
  className?: string;
}

export function YourWardImpactNugget({ nugget, className }: YourWardImpactNuggetProps) {
  return (
    <aside
      data-testid="ward-impact-nugget"
      className={cn(
        'rounded-xl border border-civic-blue-200 bg-gradient-to-r from-civic-blue-50/80 via-white to-civic-teal-50/50 p-3 shadow-sm sm:p-3.5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-blue-600 text-white shadow-sm">
          <TrendingUp className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-civic-blue-700">
            <MapPin className="h-3 w-3" aria-hidden />
            Your impact on {nugget.wardLabel}
          </p>
          <p className="mt-1 text-sm font-bold leading-snug text-foreground">{nugget.headline}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{nugget.detail}</p>
          {(nugget.yourConfirmationsThisWeek > 0 || nugget.yourReportsInWard > 0) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {nugget.yourReportsInWard > 0 ? (
                <span className="rounded-full border border-civic-blue-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-civic-blue-800">
                  {nugget.yourReportsInWard} report{nugget.yourReportsInWard === 1 ? '' : 's'}
                </span>
              ) : null}
              {nugget.yourConfirmationsThisWeek > 0 ? (
                <span className="rounded-full border border-civic-teal-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-civic-teal-800">
                  {nugget.yourConfirmationsThisWeek} confirm
                  {nugget.yourConfirmationsThisWeek === 1 ? '' : 's'} this week
                </span>
              ) : null}
              {nugget.contributionScore > 0 ? (
                <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {nugget.contributionScore} pts
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
