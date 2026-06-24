import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { GuestModeBanner } from '@/components/guest/GuestModeBanner';
import { LoadingState } from '@/components/states/LoadingState';
import { CivicIdentityHeader } from '@/components/profile/CivicIdentityHeader';
import { CivicStrengthsModule } from '@/components/profile/CivicStrengthsModule';
import { ProfileNextUnlock } from '@/components/profile/ProfileNextUnlock';
import { TrustBreakdownCard } from '@/components/profile/TrustBreakdownCard';
import { ProfileNavLinks } from '@/components/profile/ProfileNavLinks';
import { CivicActivitySummary } from '@/components/profile/CivicActivitySummary';
import { Button } from '@/components/ui/button';
import { useAuthStore, useCurrentUser, useIsAdmin } from '@/store/authStore';
import { useVerifyActivityStore } from '@/store/verifyActivityStore';
import { services } from '@/services/registry';
import { ROUTES } from '@/lib/constants';
import { sumRedeemablePoints } from '@/domain/reward-eligibility';
import { evaluateCatalog } from '@/domain/reward-catalog';
import { assessAbuseEligibility } from '@/domain/abuse-eligibility';
import { buildNextUnlocks } from '@/domain/rewards-progress';
import {
  buildCivicIdentitySnapshot,
  buildCivicStrengths,
  buildTrustMetrics,
  summarizeActivityHistory,
} from '@/domain/civic-identity';
import { computeStreak } from '@/domain/streaks';
import type { Badge as BadgeType, Report, RewardEvent } from '@/types';
import type { CatalogLockState } from '@/domain/reward-catalog';
import { Shield } from 'lucide-react';

export default function ProfilePage() {
  const user = useCurrentUser();
  const signOut = useAuthStore((s) => s.signOut);
  const isAdmin = useIsAdmin();
  const verifyActivityDates = useVerifyActivityStore((s) => s.activityDates);

  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [catalog, setCatalog] = useState<CatalogLockState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      services.backend.rewards.listByUser(user.id),
      services.reports.findByReporter(user.id),
      services.backend.rewards.listBadges(),
      services.backend.rewards.listCatalog(),
    ]).then(([r, rep, b, cat]) => {
      setRewards(r);
      setReports(rep.filter((report) => report.status !== 'merged'));
      setBadges(b);
      const verifiedPoints = sumRedeemablePoints(r);
      const abuse = assessAbuseEligibility({
        reportsLastHour: user.trust.abuseFlags.includes('velocity_spike') ? 6 : 0,
        duplicateAttempts: user.trust.duplicateRisk >= 30 ? 3 : 0,
        existingAbuseFlags: user.trust.abuseFlags,
      });
      setCatalog(evaluateCatalog(cat, verifiedPoints, user.trust.trustScore, abuse.rewardsFrozen));
      setLoading(false);
    });
  }, [user]);

  const activityDates = useMemo(() => {
    const merged = [...rewards.map((r) => r.createdAt), ...verifyActivityDates];
    return [...new Set(merged)];
  }, [rewards, verifyActivityDates]);

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

  const verifiedPoints = useMemo(() => sumRedeemablePoints(rewards), [rewards]);
  const contributionUnits = user?.trust.contributionScore ?? 0;

  const nextUnlock = useMemo(() => {
    const items = buildNextUnlocks(
      badges,
      badgeInput,
      catalog,
      contributionUnits,
      verifiedPoints,
      user?.trust.trustScore ?? 0,
    );
    return items[0] ?? null;
  }, [badges, badgeInput, catalog, contributionUnits, verifiedPoints, user?.trust.trustScore]);

  if (!user) return null;

  if (loading) {
    return (
      <CitizenPageShell>
        <LoadingState variant="cards" label="Loading civic identity…" />
      </CitizenPageShell>
    );
  }

  const snapshot = buildCivicIdentitySnapshot(user, rewards, reports, verifyActivityDates);
  const strengths = buildCivicStrengths(rewards, reports);
  const trustMetrics = buildTrustMetrics(user.trust);
  const activity = summarizeActivityHistory(rewards);

  return (
    <CitizenPageShell className="motion-stagger space-y-5" data-testid="profile-page" stagger>
      <GuestModeBanner />

      <CivicIdentityHeader user={user} snapshot={snapshot} />

      <CivicStrengthsModule strengths={strengths} />

      <ProfileNextUnlock unlock={nextUnlock} />

      <TrustBreakdownCard metrics={trustMetrics} />

      <ProfileNavLinks user={user} />

      <CivicActivitySummary items={activity} />

      {computeStreak(activityDates) > 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          {computeStreak(activityDates)}-day civic streak — keep verifying to maintain momentum
        </p>
      ) : null}

      {isAdmin ? (
        <Button asChild variant="outline" className="w-full">
          <Link to={ROUTES.admin.dashboard}>
            <Shield className="h-4 w-4" />
            Open admin dashboard
          </Link>
        </Button>
      ) : null}

      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => signOut()}>
        Sign out
      </Button>
    </CitizenPageShell>
  );
}
