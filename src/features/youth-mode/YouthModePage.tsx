import { useEffect, useState } from 'react';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { featureFlags } from '@/lib/feature-flags';
import { services } from '@/services/registry';
import { toFamilySafeContributions } from '@/domain/youth-restrictions';
import { getYouthPointCap } from '@/domain/youth-restrictions';
import { CommunityChallengeShell } from '@/components/rewards/CommunityChallengeShell';
import { listActiveChallenges } from '@/domain/community-challenges';
import { Users, Shield, Lock } from 'lucide-react';

export default function YouthModePage() {
  const [familyRewards, setFamilyRewards] = useState<ReturnType<typeof toFamilySafeContributions>>([]);
  const youthCap = getYouthPointCap('youth');

  useEffect(() => {
    let active = true;
    services.backend.rewards.listByUser('user-youth-1').then((events) => {
      if (active) setFamilyRewards(toFamilySafeContributions(events, 'parent'));
    });
    return () => {
      active = false;
    };
  }, []);

  if (!featureFlags.youthMode) return null;

  const schoolChallenges = listActiveChallenges().filter((c) => c.scope === 'school');

  return (
    <CitizenPageShell className="space-y-4">
      <Card className="border-civic-amber-200 bg-civic-amber-50/40">
        <CardContent className="flex gap-3 p-4">
          <Shield className="h-5 w-5 shrink-0 text-civic-amber-600" />
          <p className="text-sm leading-relaxed text-amber-900">
            Youth accounts propose reports; a parent approves before anything is submitted. Rewards are
            capped ({youthCap} pts max per support action) and never include partner redemption.
          </p>
        </CardContent>
      </Card>

      <div
        className="rounded-xl border border-civic-blue-200 bg-civic-blue-50/40 p-3 text-sm"
        data-testid="youth-rewards-restricted"
      >
        <p className="font-medium text-civic-blue-900">Supervised rewards</p>
        <p className="mt-1 text-xs text-civic-blue-900/85">
          Youth cannot redeem partner perks — parents manage family rewards. Support and verification
          earn partial credit only after confirmation. No double credit for repeat actions.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-sm font-bold">Family hub</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-civic-blue-50">
                <Users className="h-5 w-5 text-civic-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Verma family</p>
                <p className="text-xs text-muted-foreground">1 youth · approval required</p>
              </div>
              <Chip variant="verified" className="ml-auto">
                Active
              </Chip>
            </div>
          </CardContent>
        </Card>
      </section>

      <section data-testid="family-contributions">
        <h2 className="mb-3 font-display text-sm font-bold">Family contributions (safe view)</h2>
        <p className="mb-2 text-xs text-muted-foreground">
          Parents see activity labels only — no sensitive report metadata in this view.
        </p>
        {familyRewards.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              No verified youth contributions yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {familyRewards.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between p-3 text-sm">
                  <span>{c.label}</span>
                  <Chip variant={c.verified ? 'verified' : 'pending'}>
                    {c.verified ? `+${c.points}` : 'Pending'}
                  </Chip>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <CommunityChallengeShell
        challenges={schoolChallenges}
        title="School & community challenges (supervised)"
      />

      <section>
        <h2 className="mb-3 font-display text-sm font-bold">Pending approvals</h2>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <Lock className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No pending proposals</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              When a youth member proposes a report, it will appear here for your review.
            </p>
          </CardContent>
        </Card>
      </section>

      <Button variant="outline" className="w-full" disabled>
        Invite family member (coming soon)
      </Button>
    </CitizenPageShell>
  );
}
