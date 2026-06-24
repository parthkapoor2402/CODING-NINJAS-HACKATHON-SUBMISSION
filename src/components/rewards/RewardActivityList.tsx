import type { RewardEvent } from '@/types';
import { explainRewardEvent } from '@/domain/reward-explanations';
import { Chip } from '@/components/ui/chip';
import { Card, CardContent } from '@/components/ui/card';

interface RewardActivityListProps {
  events: RewardEvent[];
}

export function RewardActivityList({ events }: RewardActivityListProps) {
  return (
    <div className="space-y-2">
      {events.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  {r.verified ? `+${r.points}` : '+0'} · {r.type.replace(/_/g, ' ')}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {explainRewardEvent(r)}
                </p>
              </div>
              <Chip variant={r.verified ? 'verified' : 'pending'}>
                {r.verified ? 'Earned' : 'Pending'}
              </Chip>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
