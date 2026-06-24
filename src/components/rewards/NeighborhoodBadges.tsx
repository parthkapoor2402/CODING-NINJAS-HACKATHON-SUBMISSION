import type { Badge as BadgeType } from '@/types';
import { filterUnlockedBadges, type BadgeUnlockInput } from '@/domain/badge-unlocks';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface NeighborhoodBadgesProps {
  allBadges: BadgeType[];
  unlockInput: BadgeUnlockInput;
}

export function NeighborhoodBadges({ allBadges, unlockInput }: NeighborhoodBadgesProps) {
  const unlocked = filterUnlockedBadges(allBadges, unlockInput);
  const unlockedIds = new Set(unlocked.map((b) => b.id));

  return (
    <section data-testid="neighborhood-badges">
      <h2 className="mb-3 font-display text-sm font-bold">Neighborhood badges</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {allBadges.map((b) => {
          const earned = unlockedIds.has(b.id);
          return (
            <div
              key={b.id}
              className={`rounded-xl border p-3 text-sm ${earned ? 'border-civic-teal-200 bg-civic-teal-50/30' : 'border-border bg-muted/20'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant={earned ? 'verified' : 'secondary'} className="text-xs">
                  {b.name}
                </Badge>
                {!earned ? <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden /> : null}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{b.description}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{b.criteria}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
