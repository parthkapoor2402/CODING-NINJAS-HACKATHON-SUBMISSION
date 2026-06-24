import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { useCurrentUser } from '@/store/authStore';
import { services } from '@/services/registry';
import { ROUTES } from '@/lib/constants';
import { sumRedeemablePoints } from '@/domain/reward-eligibility';
import { evaluateCatalog } from '@/domain/reward-catalog';
import { contributionFromRewards } from '@/domain/contribution-score';
import { computeStreak } from '@/domain/streaks';
import { assessAbuseEligibility } from '@/domain/abuse-eligibility';
import { RewardsPhilosophyCard } from '@/components/rewards/RewardsPhilosophyCard';
import { RewardsAtAGlance } from '@/components/rewards/RewardsAtAGlance';
import { RewardsLeaderboard } from '@/components/rewards/RewardsLeaderboard';
import { NeighborhoodBadges } from '@/components/rewards/NeighborhoodBadges';
import { CivicChampionLadder } from '@/components/rewards/CivicChampionLadder';
import { CivicMilestones } from '@/components/rewards/CivicMilestones';
import { RewardCatalogSection } from '@/components/rewards/RewardCatalogSection';
import { RewardActivityList } from '@/components/rewards/RewardActivityList';
import { CommunityChallengeShell } from '@/components/rewards/CommunityChallengeShell';
import type { Badge as BadgeType, RewardEvent } from '@/types';
import type { LeaderboardEntry } from '@/services/types/backend';
import type { CatalogLockState } from '@/domain/reward-catalog';
import { Flame, ChevronRight } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

export default function RewardsPage() {
  const user = useCurrentUser();
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [catalog, setCatalog] = useState<CatalogLockState[]>([]);
  const [rewardsFrozen, setRewardsFrozen] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      services.backend.rewards.listByUser(user.id),
      services.backend.rewards.listBadges(),
      services.backend.rewards.listLeaderboard(),
      services.backend.rewards.listCatalog(),
    ]).then(([r, b, lb, cat]) => {
      setRewards(r);
      setBadges(b);
      setLeaderboard(lb);
      const verifiedPoints = sumRedeemablePoints(r);
      const abuse = assessAbuseEligibility({
        reportsLastHour: user.trust.abuseFlags.includes('velocity_spike') ? 6 : 0,
        duplicateAttempts: user.trust.duplicateRisk >= 30 ? 3 : 0,
        existingAbuseFlags: user.trust.abuseFlags,
      });
      setRewardsFrozen(abuse.rewardsFrozen);
      setCatalog(evaluateCatalog(cat, verifiedPoints, user.trust.trustScore, abuse.rewardsFrozen));
    });
  }, [user]);

  const verifiedPoints = useMemo(() => sumRedeemablePoints(rewards), [rewards]);
  const pendingPoints = rewards.filter((r) => !r.verified).reduce((s, r) => s + r.points, 0);
  const activityDates = rewards.map((r) => r.createdAt);
  const streak = computeStreak(activityDates);
  const contributionUnits = contributionFromRewards(rewards);

  const badgeInput = {
    verifiedReportCount: rewards.filter((r) => r.type === 'verified_report' && r.verified).length,
    corroborationCount: rewards.filter(
      (r) => (r.type === 'corroboration' || r.type === 'support_existing') && r.verified,
    ).length,
    activityDates,
  };

  if (!user) return null;

  return (
    <CitizenPageShell className="space-y-5" data-testid="rewards-page">
      <RewardsAtAGlance verifiedPoints={verifiedPoints} pendingPoints={pendingPoints} />
      <RewardsPhilosophyCard />

      <Card className="overflow-hidden border-0 shadow-elevated">
        <div className="gradient-civic-subtle p-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-civic-teal-500 font-display text-xl font-bold text-white shadow-sm"
              data-testid="verified-points-total"
            >
              {verifiedPoints}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-civic-blue-600">
                Verified impact
              </p>
              <p className="font-display text-3xl font-bold">{verifiedPoints}</p>
              <p className="text-xs text-muted-foreground">redeemable points · pending excluded</p>
            </div>
          </div>
          {pendingPoints > 0 ? (
            <Chip variant="pending" className="mt-4">
              +{pendingPoints} pending verification (not redeemable yet)
            </Chip>
          ) : null}
          {streak > 0 ? (
            <p className="mt-3 flex items-center gap-1 text-xs text-civic-amber-800" data-testid="rewards-streak">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              {streak}-day contribution streak
            </p>
          ) : null}
        </div>
      </Card>

      <CivicChampionLadder contributionUnits={contributionUnits} />

      <RewardsLeaderboard entries={leaderboard} currentUserId={user.id} />

      <NeighborhoodBadges allBadges={badges} unlockInput={badgeInput} />

      <CivicMilestones
        input={{
          verifiedReportCount: badgeInput.verifiedReportCount,
          corroborationCount: badgeInput.corroborationCount,
          streakDays: streak,
          resolvedFollowed: rewards.filter((r) => r.type === 'resolution' && r.verified).length,
        }}
      />

      <RewardCatalogSection
        catalog={catalog}
        userId={user.id}
        userRole={user.role}
        redeemablePoints={verifiedPoints}
        trustScore={user.trust.trustScore}
        rewardsFrozen={rewardsFrozen}
      />

      <CommunityChallengeShell />

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
          <Flame className="h-4 w-4 text-civic-amber-500" />
          Recent activity
        </h2>
        <RewardActivityList events={rewards} />
      </section>
    </CitizenPageShell>
  );
}

export function RewardsLinkCard() {
  return (
    <Link to={ROUTES.rewards}>
      <Card className="transition-shadow hover:shadow-elevated">
        <CardContent className="flex items-center justify-between p-4">
          <span className="font-medium">Rewards & badges</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
