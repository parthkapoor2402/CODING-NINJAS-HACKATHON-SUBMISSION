import { Link } from 'react-router-dom';
import type { NextUnlockItem } from '@/domain/rewards-progress';
import { ROUTES } from '@/lib/constants';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { ArrowRight, Gift, Medal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileNextUnlockProps {
  unlock: NextUnlockItem | null;
}

const kindIcon = {
  badge: Medal,
  perk: Gift,
  rank: Sparkles,
};

export function ProfileNextUnlock({ unlock }: ProfileNextUnlockProps) {
  if (!unlock) {
    return (
      <section
        data-testid="profile-next-unlock"
        className="rounded-xl border border-civic-teal-200 bg-civic-teal-50/40 p-4"
      >
        <p className="text-sm font-semibold text-civic-teal-900">All current unlocks achieved</p>
        <p className="mt-1 text-xs text-civic-teal-800/85">
          Keep verifying and reporting to climb ranks and earn recognition.
        </p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link to={ROUTES.rewards}>View rewards journey</Link>
        </Button>
      </section>
    );
  }

  const Icon = kindIcon[unlock.kind];

  return (
    <section
      data-testid="profile-next-unlock"
      className="rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        Next best unlock
      </p>
      <div className="mt-2 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-amber-50 text-civic-amber-700">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{unlock.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{unlock.howToUnlock}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-civic-blue-600">
            <ArrowRight className="h-3 w-3" aria-hidden />
            {unlock.gapLabel}
          </p>
          <CivicProgressBar value={unlock.progressPercent} variant="unlock" className="mt-2" />
        </div>
        <span className="text-sm font-bold tabular-nums text-civic-teal-700">
          {unlock.progressPercent}%
        </span>
      </div>
      <Button variant="teal" size="sm" className="mt-3 w-full" asChild>
        <Link to={ROUTES.rewards}>See full progression</Link>
      </Button>
    </section>
  );
}
