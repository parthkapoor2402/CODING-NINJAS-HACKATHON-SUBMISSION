import { Sparkles, TrendingUp } from 'lucide-react';
import { AnimatedMetric } from '@/components/motion/AnimatedMetric';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { cn } from '@/lib/utils';

interface RewardMomentumBannerProps {
  nextUnlockTitle: string;
  progressPercent: number;
  gapLabel?: string;
  className?: string;
}

export function RewardMomentumBanner({
  nextUnlockTitle,
  progressPercent,
  gapLabel,
  className,
}: RewardMomentumBannerProps) {
  if (progressPercent < 40) return null;

  const nearUnlock = progressPercent >= 75;

  return (
    <div
      data-testid="reward-momentum-banner"
      className={cn(
        'overflow-hidden rounded-xl border p-3.5 animate-slide-up sm:p-4',
        nearUnlock
          ? 'border-civic-amber-300 bg-gradient-to-r from-civic-amber-50 via-white to-civic-teal-50/50 ring-1 ring-civic-amber-200'
          : 'border-civic-teal-200 bg-gradient-to-r from-civic-teal-50/60 to-white',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
            nearUnlock ? 'bg-civic-amber-600' : 'bg-civic-teal-600',
          )}
        >
          {nearUnlock ? (
            <Sparkles className="h-5 w-5" aria-hidden />
          ) : (
            <TrendingUp className="h-5 w-5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-civic-teal-800">
            {nearUnlock ? 'Almost there' : 'Recognition momentum'}
          </p>
          <p className="mt-0.5 text-sm font-bold text-foreground">{nextUnlockTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {gapLabel ?? 'Keep earning verified impact — rewards unlock after confirmation, not volume.'}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <CivicProgressBar value={progressPercent} variant={nearUnlock ? 'amber' : 'teal'} size="sm" className="flex-1" />
            <span className="shrink-0 font-display text-sm font-bold tabular-nums text-civic-teal-800">
              <AnimatedMetric value={progressPercent} />%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
