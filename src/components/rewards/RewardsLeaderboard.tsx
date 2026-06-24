import type { LeaderboardEntry } from '@/services/types/backend';
import type { LeaderboardInsights } from '@/domain/rewards-progress';
import { cardSurfaces, rankMedalStyles } from '@/lib/card-surfaces';
import { TrendingUp, Trophy, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RewardsLeaderboardProps {
  entries: LeaderboardEntry[];
  insights: LeaderboardInsights;
  currentUserId?: string;
}

export function RewardsLeaderboard({ entries, insights, currentUserId }: RewardsLeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.contributionScore - a.contributionScore);

  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 font-display text-base font-bold sm:mb-3">
        <Trophy className="h-4 w-4 text-civic-amber-500" />
        Neighborhood leaderboard
      </h2>
      <p className="mb-2.5 text-xs text-muted-foreground sm:mb-3">
        Ranked by verified contribution — recognition for real impact, not volume.
      </p>

      <div className="mb-2.5 grid grid-cols-2 gap-2 sm:mb-3">
        <InsightTile
          icon={Trophy}
          label="Your rank"
          value={`#${insights.yourRank}`}
          sub={`of ${insights.totalParticipants}`}
          highlight
        />
        <InsightTile
          icon={TrendingUp}
          label="Local percentile"
          value={`Top ${insights.localPercentile}%`}
          sub="in your ward"
        />
        <InsightTile
          icon={Zap}
          label="This week"
          value={`+${insights.weeklyVerifiedContribution}`}
          sub="verified contribution"
        />
        <InsightTile
          icon={Users}
          label="Gap to next rank"
          value={
            insights.gapToNextRank != null && insights.nextRankName
              ? `${insights.gapToNextRank} pts`
              : '—'
          }
          sub={
            insights.nextRankName ? `to pass ${insights.nextRankName.split(' ')[0]}` : 'You lead the board'
          }
        />
      </div>

      <div
        data-testid="rewards-leaderboard"
        className="overflow-hidden rounded-card border border-border bg-card shadow-card"
      >
        <div className="divide-y divide-border/80">
          {sorted.map((entry, i) => {
            const isYou = entry.userId === currentUserId;
            const rank = i + 1;
            const isTop = rank <= 3;
            const initials = entry.displayName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={entry.userId}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3',
                  isYou && cardSurfaces.leaderboardYou,
                  isTop && !isYou && cardSurfaces.leaderboardTop,
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isTop ? rankMedalStyles[rank] : 'bg-muted text-muted-foreground',
                  )}
                  aria-hidden
                >
                  {isTop ? rank : `#${rank}`}
                </div>

                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isYou
                      ? 'bg-civic-blue-600 text-white'
                      : 'border border-border bg-gradient-to-br from-civic-blue-50 to-civic-teal-50 text-civic-blue-800',
                  )}
                  aria-hidden
                >
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm font-semibold', isYou && 'text-civic-blue-900')}>
                    {entry.displayName}
                    {isYou ? (
                      <span className="ml-1.5 rounded-md bg-civic-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        You
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="shrink-0 rounded-full border border-civic-teal-200 bg-civic-teal-50 px-2.5 py-1 text-xs font-bold tabular-nums text-civic-teal-800">
                  {entry.contributionScore} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function InsightTile({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-2.5 sm:p-3',
        highlight
          ? 'border-civic-amber-300 bg-gradient-to-br from-civic-amber-50 to-white shadow-sm'
          : 'border-border bg-card',
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className={cn('h-3 w-3', highlight && 'text-civic-amber-600')} aria-hidden />
        {label}
      </div>
      <p className="mt-1 font-display text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
