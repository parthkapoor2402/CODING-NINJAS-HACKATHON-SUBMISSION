import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/store/authStore';
import { useVerifyActivityStore } from '@/store/verifyActivityStore';
import { services } from '@/services/registry';
import { ROUTES } from '@/lib/constants';
import { sumRedeemablePoints } from '@/domain/reward-eligibility';
import { evaluateCatalog } from '@/domain/reward-catalog';
import { computeStreak } from '@/domain/streaks';
import { assessAbuseEligibility } from '@/domain/abuse-eligibility';
import {
  buildBadgeJourney,
  buildNextUnlocks,
  computeLeaderboardInsights,
  weeklyVerifiedContribution,
} from '@/domain/rewards-progress';
import { RewardsProgressSummary } from '@/components/rewards/RewardsProgressSummary';
import { NextUnlocksPanel } from '@/components/rewards/NextUnlocksPanel';
import { BadgeJourneyRail } from '@/components/rewards/BadgeJourneyRail';
import { RewardsLeaderboard } from '@/components/rewards/RewardsLeaderboard';
import { RewardCatalogSection } from '@/components/rewards/RewardCatalogSection';
import { RewardActivityList } from '@/components/rewards/RewardActivityList';
import { CommunityChallengeShell } from '@/components/rewards/CommunityChallengeShell';
import { RewardMomentumBanner } from '@/components/rewards/RewardMomentumBanner';
import { NeighborhoodPulseSection } from '@/components/pulse/NeighborhoodPulseSection';
import { CivicAccountabilityStrip } from '@/components/civic/CivicAccountabilityStrip';
import type { Badge as BadgeType, Report, RewardEvent } from '@/types';
import type { LeaderboardEntry } from '@/services/types/backend';
import type { CatalogLockState } from '@/domain/reward-catalog';
import { ChevronRight, Flame } from 'lucide-react';

export default function RewardsPage() {
  const user = useCurrentUser();
  const verifyActivityDates = useVerifyActivityStore((s) => s.activityDates);
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [catalog, setCatalog] = useState<CatalogLockState[]>([]);
  const [rewardsFrozen, setRewardsFrozen] = useState(false);
  const [wardReports, setWardReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      services.backend.rewards.listByUser(user.id),
      services.backend.rewards.listBadges(),
      services.backend.rewards.listLeaderboard(),
      services.backend.rewards.listCatalog(),
      services.reports.list(),
    ]).then(([r, b, lb, cat, reports]) => {
      setRewards(r);
      setBadges(b);
      setLeaderboard(lb);
      setWardReports(reports);
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
  const activityDates = useMemo(() => {
    const merged = [...rewards.map((r) => r.createdAt), ...verifyActivityDates];
    return [...new Set(merged)];
  }, [rewards, verifyActivityDates]);
  const streak = computeStreak(activityDates);
  const verifyActionsThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return verifyActivityDates.filter((d) => new Date(d).getTime() >= weekAgo).length;
  }, [verifyActivityDates]);

  const contributionUnits = user?.trust.contributionScore ?? 0;

  const badgeInput = useMemo(
    () => ({
      verifiedReportCount: rewards.filter((r) => r.type === 'verified_report' && r.verified).length,
      corroborationCount: rewards.filter(
        (r) => (r.type === 'corroboration' || r.type === 'support_existing') && r.verified,
      ).length,
      activityDates,
    }),
    [rewards, activityDates],
  );

  const resolvedFollowed = rewards.filter((r) => r.type === 'resolution' && r.verified).length;

  const nextUnlocks = useMemo(
    () =>
      buildNextUnlocks(
        badges,
        badgeInput,
        catalog,
        contributionUnits,
        verifiedPoints,
        user?.trust.trustScore ?? 0,
      ),
    [badges, badgeInput, catalog, contributionUnits, verifiedPoints, user?.trust.trustScore],
  );

  const badgeJourney = useMemo(
    () => buildBadgeJourney(badges, badgeInput, resolvedFollowed),
    [badges, badgeInput, resolvedFollowed],
  );

  const leaderboardInsights = useMemo(
    () =>
      user
        ? computeLeaderboardInsights(
            leaderboard,
            user.id,
            weeklyVerifiedContribution(rewards),
          )
        : null,
    [leaderboard, user, rewards],
  );

  if (!user || !leaderboardInsights) return null;

  const nextUnlockTitle = nextUnlocks[0]?.title ?? undefined;

  return (
    <CitizenPageShell className="motion-stagger space-y-5" data-testid="rewards-page" stagger>
      <RewardsProgressSummary
        verifiedImpact={verifiedPoints}
        pendingPoints={pendingPoints}
        trustScore={user.trust.trustScore}
        contributionUnits={contributionUnits}
        nextUnlockTitle={nextUnlockTitle}
      />

      <NeighborhoodPulseSection
        reports={wardReports}
        user={user}
        surface="rewards"
        verifyActionsThisWeek={verifyActionsThisWeek}
        variant="compact"
        showImpactNugget
      />

      {nextUnlocks[0] ? (
        <RewardMomentumBanner
          nextUnlockTitle={nextUnlocks[0].title}
          progressPercent={nextUnlocks[0].progressPercent}
          gapLabel={nextUnlocks[0].gapLabel}
        />
      ) : null}

      {streak > 0 ? (
        <p className="flex items-center gap-1 text-xs font-medium text-civic-amber-800" data-testid="rewards-streak">
          <Flame className="h-3.5 w-3.5" aria-hidden />
          {streak}-day contribution streak — keep it alive with verified impact
        </p>
      ) : null}

      <NextUnlocksPanel items={nextUnlocks} />

      <BadgeJourneyRail groups={badgeJourney} />

      <RewardsLeaderboard
        entries={leaderboard}
        insights={leaderboardInsights}
        currentUserId={user.id}
      />

      <CommunityChallengeShell />

      <RewardCatalogSection
        catalog={catalog}
        userId={user.id}
        userRole={user.role}
        redeemablePoints={verifiedPoints}
        trustScore={user.trust.trustScore}
        rewardsFrozen={rewardsFrozen}
      />

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
          <Flame className="h-4 w-4 text-civic-amber-500" />
          Recent activity
        </h2>
        <RewardActivityList events={rewards} />
      </section>

      <CivicAccountabilityStrip compact />
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
