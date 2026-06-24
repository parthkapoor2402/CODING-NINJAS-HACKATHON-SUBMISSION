import { CIVIC_LADDER, getCurrentLadderTier, getNextLadderTier, ladderProgress } from '@/domain/civic-ladder';
import { Crown } from 'lucide-react';

interface CivicChampionLadderProps {
  contributionUnits: number;
}

export function CivicChampionLadder({ contributionUnits }: CivicChampionLadderProps) {
  const current = getCurrentLadderTier(contributionUnits);
  const next = getNextLadderTier(contributionUnits);
  const progress = ladderProgress(contributionUnits);

  return (
    <section data-testid="civic-champion-ladder" aria-label="Civic champion ladder">
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
        <Crown className="h-4 w-4 text-civic-amber-600" />
        Civic champion ladder
      </h2>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="font-display text-lg font-semibold">{current.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{current.description}</p>
        {next ? (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to {next.label}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-civic-teal-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs font-medium text-civic-teal-800">Highest tier reached — thank you.</p>
        )}
        <ol className="mt-4 space-y-1 border-t pt-3">
          {CIVIC_LADDER.map((tier) => (
            <li
              key={tier.id}
              className={`text-xs ${tier.id === current.id ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
            >
              {tier.label} · {tier.minContribution}+ contribution units
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
