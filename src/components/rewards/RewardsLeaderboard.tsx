import type { LeaderboardEntry } from '@/services/types/backend';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface RewardsLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function RewardsLeaderboard({ entries, currentUserId }: RewardsLeaderboardProps) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
        <Trophy className="h-4 w-4 text-civic-amber-500" />
        Neighborhood leaderboard
      </h2>
      <p className="mb-2 text-xs text-muted-foreground">
        Ranked by verified contribution score — recognition for real impact, not volume.
      </p>
      <Card data-testid="rewards-leaderboard">
        <CardContent className="divide-y p-0">
          {entries.map((entry, i) => (
            <div key={entry.userId} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium">
                #{i + 1} {entry.displayName}
                {entry.userId === currentUserId ? ' (you)' : ''}
              </span>
              <span className="text-muted-foreground">{entry.contributionScore} pts</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
