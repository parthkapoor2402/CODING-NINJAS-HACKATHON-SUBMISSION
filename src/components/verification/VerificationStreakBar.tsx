import { Flame } from 'lucide-react';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { AnimatedMetric } from '@/components/motion/AnimatedMetric';
import { cn } from '@/lib/utils';

interface VerificationStreakBarProps {
  streak: number;
  activeToday: boolean;
  usefulVerifications: number;
  className?: string;
}

const STREAK_TARGET = 7;

export function VerificationStreakBar({
  streak,
  activeToday,
  usefulVerifications,
  className,
}: VerificationStreakBarProps) {
  const streakProgress = Math.min(100, Math.round((streak / STREAK_TARGET) * 100));

  return (
    <div
      data-testid="verification-streak-bar"
      className={cn(
        'rounded-xl border border-border/80 bg-card px-3 py-2.5 shadow-card',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300',
              streak > 0 ? 'bg-civic-amber-100 text-civic-amber-700' : 'bg-muted text-muted-foreground',
            )}
          >
            <Flame className={cn('h-4 w-4', streak > 0 && 'animate-pulse-soft')} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              {streak > 1
                ? `${streak}-day verification streak`
                : streak === 1
                  ? 'Verification streak started'
                  : 'Build a verification streak'}
            </p>
        <p className="text-[10px] text-muted-foreground">
          {activeToday
            ? 'Useful confirms today count — not volume'
            : streak > 0
              ? `${Math.max(0, STREAK_TARGET - streak)} more day${STREAK_TARGET - streak === 1 ? '' : 's'} to a ${STREAK_TARGET}-day civic rhythm`
              : 'Confirm real issues on separate days'}
        </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-bold text-civic-teal-700">
            <AnimatedMetric value={usefulVerifications} />
          </p>
          <p className="text-[10px] font-medium text-muted-foreground">useful confirms</p>
        </div>
      </div>
      <CivicProgressBar
        value={streakProgress}
        variant="amber"
        size="sm"
        className="mt-2.5"
        aria-label="Streak progress toward 7 days"
      />
    </div>
  );
}
