import { useState } from 'react';
import type { UserRole } from '@/types';
import type { CatalogLockState } from '@/domain/reward-catalog';
import { checkRedemptionEligibility, explainRedemptionBlock } from '@/domain/redemption-eligibility';
import { explainTrustForRewards } from '@/domain/reward-explanations';
import { redeemCatalogItem } from '@/services/mock/mockRedemptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Gift, Lock } from 'lucide-react';

interface RewardCatalogSectionProps {
  catalog: CatalogLockState[];
  userId: string;
  userRole: UserRole;
  redeemablePoints: number;
  trustScore: number;
  rewardsFrozen: boolean;
}

export function RewardCatalogSection({
  catalog,
  userId,
  userRole,
  redeemablePoints,
  trustScore,
  rewardsFrozen,
}: RewardCatalogSectionProps) {
  const [redeemMsg, setRedeemMsg] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const target = catalog.find((c) => !c.locked) ?? catalog[0];
  const eligibility = target
    ? checkRedemptionEligibility({
        userRole,
        redeemablePoints,
        pointsCost: target.item.pointsCost,
        trustScore,
        minTrustScore: target.item.minTrustScore,
        rewardsFrozen,
      })
    : { eligible: false, reason: 'insufficient_points' as const };

  async function handleRedeem() {
    if (!target || !eligibility.eligible) return;
    setRedeeming(true);
    const result = await redeemCatalogItem(userId, target.item.id);
    if (result.ok) {
      setRedeemMsg(`Redeemed: ${target.item.name}. Show this screen at the partner location.`);
    } else {
      setRedeemMsg(explainRedemptionBlock(result.error));
    }
    setRedeeming(false);
  }

  return (
    <section data-testid="reward-catalog">
      <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold">
        <Gift className="h-4 w-4 text-civic-blue-600" />
        Partner reward catalog
      </h2>
      <p className="mb-3 text-xs text-muted-foreground">
        {explainTrustForRewards(trustScore, target?.item.minTrustScore ?? 70)}
      </p>
      <div className="space-y-2">
        {catalog.map(({ item, locked }) => (
          <Card
            key={item.id}
            data-testid={`reward-catalog-item-${item.id}`}
            className={locked ? 'opacity-80' : 'border-civic-teal-200'}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.pointsCost} verified pts · trust {item.minTrustScore}+
                </p>
              </div>
              {locked ? (
                <Chip variant="outline" data-testid="reward-catalog-locked" className="gap-1">
                  <Lock className="h-3 w-3" aria-hidden />
                  Locked
                </Chip>
              ) : (
                <Chip variant="verified" data-testid="reward-catalog-unlocked">
                  Unlocked
                </Chip>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        variant="teal"
        size="sm"
        className="mt-3 w-full"
        data-testid="redeem-reward-btn"
        disabled={!eligibility.eligible || redeeming}
        onClick={handleRedeem}
      >
        {eligibility.eligible ? 'Redeem unlocked perk' : 'Not eligible to redeem'}
      </Button>
      {!eligibility.eligible && eligibility.reason ? (
        <p className="mt-2 text-xs text-muted-foreground" role="status">
          {explainRedemptionBlock(eligibility.reason)}
        </p>
      ) : null}
      {redeemMsg ? (
        <p className="mt-2 rounded-lg border border-civic-teal-200 bg-civic-teal-50/50 px-3 py-2 text-xs text-civic-teal-900" role="status">
          {redeemMsg}
        </p>
      ) : null}
    </section>
  );
}
