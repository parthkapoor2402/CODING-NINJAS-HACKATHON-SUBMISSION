import { listActiveChallenges, type CommunityChallenge } from '@/domain/community-challenges';
import { Card, CardContent } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Users } from 'lucide-react';

interface CommunityChallengeShellProps {
  challenges?: CommunityChallenge[];
  title?: string;
}

export function CommunityChallengeShell({
  challenges = listActiveChallenges(),
  title = 'Optional community challenges',
}: CommunityChallengeShellProps) {
  return (
    <section data-testid="community-challenges">
      <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold">
        <Users className="h-4 w-4 text-civic-blue-600" />
        {title}
      </h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Opt-in recognition for schools and neighborhoods — not required for core rewards.
      </p>
      <div className="space-y-2">
        {challenges.map((c) => (
          <Card key={c.id} className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Goal: {c.goalLabel}</p>
                </div>
                <Chip variant="outline" className="shrink-0 text-[10px] uppercase">
                  {c.scope}
                </Chip>
              </div>
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-civic-blue-500"
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{c.progressPercent}% community progress</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
