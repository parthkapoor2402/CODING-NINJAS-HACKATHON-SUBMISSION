import { Award, CheckCircle2, Lock, Medal } from 'lucide-react';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { cardSurfaces } from '@/lib/card-surfaces';
import type { BadgeJourneyGroup } from '@/domain/rewards-progress';
import { cn } from '@/lib/utils';

interface BadgeJourneyRailProps {
  groups: BadgeJourneyGroup[];
  className?: string;
}

export function BadgeJourneyRail({ groups, className }: BadgeJourneyRailProps) {
  return (
    <section data-testid="badge-journey-rail" className={cn('space-y-3 sm:space-y-4', className)}>
      <div>
        <h2 className="font-display text-base font-bold">Badge journey</h2>
        <p className="text-xs text-muted-foreground">
          Earned through verified civic credibility — not report volume
        </p>
      </div>

      <div className="relative space-y-4 pl-3">
        <div
          className="absolute bottom-2 left-[7px] top-2 w-1 rounded-full bg-gradient-to-b from-civic-teal-500 via-civic-blue-400 to-civic-blue-200"
          aria-hidden
        />

        {groups.map((group) => (
          <div key={group.id} data-testid={`badge-journey-${group.id}`} className="relative">
            <div className="absolute -left-3 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-civic-teal-600 shadow-sm">
              <Medal className="h-2 w-2 text-white" aria-hidden />
            </div>
            <div className="ml-4 space-y-2">
              <div className="rounded-lg border border-civic-blue-100 bg-civic-blue-50/40 px-2.5 py-1.5">
                <p className="text-sm font-bold text-foreground">{group.label}</p>
                <p className="text-[11px] text-muted-foreground">{group.description}</p>
              </div>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.badgeId}
                    data-testid={`badge-progress-${item.badgeId}`}
                    className={cn(
                      'rounded-xl p-3 transition-colors',
                      item.earned ? cardSurfaces.badgeEarned : cardSurfaces.badgeLocked,
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                          item.earned
                            ? 'bg-gradient-to-br from-civic-teal-500 to-civic-teal-700 text-white shadow-sm'
                            : 'bg-muted text-muted-foreground',
                        )}
                        aria-hidden
                      >
                        {item.earned ? (
                          <Award className="h-5 w-5" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{item.name}</p>
                          {item.earned ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-civic-teal-600" aria-hidden />
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px]">
                          <span className="font-medium text-muted-foreground">
                            {item.current}/{item.target} · {item.criteria}
                          </span>
                          <span
                            className={cn(
                              'font-bold',
                              item.earned ? 'text-civic-teal-700' : 'text-civic-blue-600',
                            )}
                          >
                            {item.gapLabel}
                          </span>
                        </div>
                        <CivicProgressBar
                          value={item.progressPercent}
                          variant={item.earned ? 'teal' : 'unlock'}
                          size="sm"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div data-testid="neighborhood-badges" className="sr-only">
        Badge journey
      </div>
    </section>
  );
}
