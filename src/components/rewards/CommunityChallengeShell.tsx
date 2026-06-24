import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { cardSurfaces } from '@/lib/card-surfaces';
import { listActiveChallenges, type CommunityChallenge } from '@/domain/community-challenges';
import { Chip } from '@/components/ui/chip';
import { Activity, MapPin, School, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommunityChallengeShellProps {
  challenges?: CommunityChallenge[];
  title?: string;
}

const scopeStyles: Record<
  CommunityChallenge['scope'],
  { icon: typeof Users; header: string; chip: string; accent: string }
> = {
  school: {
    icon: School,
    header: cardSurfaces.challengeHeader.school,
    chip: 'bg-violet-100 text-violet-900 border-violet-200',
    accent: 'text-violet-700',
  },
  neighborhood: {
    icon: MapPin,
    header: cardSurfaces.challengeHeader.neighborhood,
    chip: 'bg-civic-teal-100 text-civic-teal-900 border-civic-teal-200',
    accent: 'text-civic-teal-700',
  },
  ward: {
    icon: Users,
    header: cardSurfaces.challengeHeader.ward,
    chip: 'bg-civic-amber-100 text-civic-amber-900 border-civic-amber-200',
    accent: 'text-civic-amber-800',
  },
};

export function CommunityChallengeShell({
  challenges = listActiveChallenges(),
  title = 'Live community challenges',
}: CommunityChallengeShellProps) {
  return (
    <section data-testid="community-challenges" className="space-y-2.5 sm:space-y-3">
      <div>
        <h2 className="flex items-center gap-2 font-display text-base font-bold">
          <Sparkles className="h-4 w-4 text-civic-amber-500" />
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">
          Opt-in goals with live ward progress — recognition tied to verified civic work
        </p>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {challenges.map((c, index) => {
          const style = scopeStyles[c.scope];
          const ScopeIcon = style.icon;
          const remaining = c.goalTarget - c.currentCount;
          const pct = c.progressPercent;

          return (
            <div
              key={c.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className={cn('bg-gradient-to-r px-3.5 py-2.5 text-white sm:px-4', style.header)}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <ScopeIcon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">{c.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/85">{c.description}</p>
                    </div>
                  </div>
                  <Chip className={cn('shrink-0 border text-[9px] font-bold uppercase', style.chip)}>
                    {c.scope}
                  </Chip>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="font-display text-2xl font-bold tabular-nums text-foreground">
                      {c.currentCount}
                      <span className="text-sm font-medium text-muted-foreground"> / {c.goalTarget}</span>
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground">{c.goalLabel}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('flex items-center justify-end gap-1 text-xs font-bold', style.accent)}>
                      <Activity className="h-3 w-3 animate-pulse" aria-hidden />
                      {c.momentumLabel}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {remaining > 0 ? `${remaining} to goal` : 'Goal reached'}
                    </p>
                  </div>
                </div>

                <CivicProgressBar value={pct} variant="amber" size="lg" className="mt-3" />
                <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">
                  {pct}% community progress · live this week
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
