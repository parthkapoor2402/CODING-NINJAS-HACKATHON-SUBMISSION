import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { GuestModeBanner } from '@/components/guest/GuestModeBanner';
import { CivicNextActionPrompt } from '@/components/civic/CivicNextActionPrompt';
import { CivicAccountabilityStrip } from '@/components/civic/CivicAccountabilityStrip';
import { ActionFeedbackToast, type ActionFeedback } from '@/components/home/ActionFeedbackToast';
import { HomeDynamicHero } from '@/components/home/HomeDynamicHero';
import { LocalImpactStrip } from '@/components/home/LocalImpactStrip';
import { NeighborhoodActivityStrip } from '@/components/home/NeighborhoodActivityStrip';
import { NeighborhoodPulseSection } from '@/components/pulse/NeighborhoodPulseSection';
import { NeighborhoodMapView } from '@/components/home/NeighborhoodMapView';
import {
  PremiumMapFeedToggle,
  type MapFeedView,
} from '@/components/home/PremiumMapFeedToggle';
import { TodaysCivicMissions } from '@/components/home/TodaysCivicMissions';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { IssueCard } from '@/components/cards/IssueCard';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import { Button } from '@/components/ui/button';
import {
  computeCivicMissions,
  computeDynamicHero,
  computeHomeImpact,
  computeNeighborhoodActivity,
  daysSince,
  estimateDistanceKm,
} from '@/domain/home-missions';
import { computeNextActionPrompt } from '@/domain/next-action';
import {
  TRUST_SCORE_PER_VERIFICATION,
  VERIFICATION_SUPPORT_BONUS,
} from '@/domain/trust-updates';
import { applyTrustUpdate, useCurrentUser } from '@/store/authStore';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import { ROUTES } from '@/lib/constants';
import type { Report } from '@/types';

function isOpen(report: Report): boolean {
  return report.status !== 'merged' && report.status !== 'resolved';
}

export default function HomePage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<MapFeedView>('feed');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [completedReportId, setCompletedReportId] = useState<string | null>(null);
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  useEffect(() => {
    services.reports.list().then((data) => {
      setAllReports(data);
      const open = data.filter(isOpen);
      setReports(open.slice(0, 4));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const t = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(t);
  }, [feedback]);

  const impact = useMemo(
    () => computeHomeImpact(allReports, user),
    [allReports, user],
  );

  const hero = useMemo(
    () => computeDynamicHero(allReports, user),
    [allReports, user],
  );

  const missions = useMemo(
    () => computeCivicMissions(allReports, user, completedMissionIds),
    [allReports, user, completedMissionIds],
  );

  const activity = useMemo(
    () => computeNeighborhoodActivity(allReports),
    [allReports],
  );

  const nextAction = useMemo(
    () => computeNextActionPrompt(hero, missions, user),
    [hero, missions, user],
  );

  const handleConfirm = useCallback(
    async (reportId: string) => {
      if (!user) {
        navigate(ROUTES.auth);
        return;
      }
      setConfirmingId(reportId);
      const result = await services.reports.corroborate(reportId, user.id);
      if (result.ok && result.report) {
        const updated = result.report;
        setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
        setAllReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
        applyTrustUpdate();
        setCompletedReportId(reportId);
        setCompletedMissionIds((prev) => new Set(prev).add('verify-nearby'));
        setFeedback({
          id: `confirm-${reportId}`,
          title: 'Confirmed — you strengthened this report',
          detail: `${updated.corroborationCount} neighbors now back this issue for crew review.`,
          variant: 'verification',
          metrics: [
            { label: 'contribution', value: `+${VERIFICATION_SUPPORT_BONUS}` },
            { label: 'trust', value: `+${TRUST_SCORE_PER_VERIFICATION}` },
          ],
        });
        window.setTimeout(() => {
          setReports((prev) => prev.filter((r) => r.id !== reportId || r.status !== 'pending_verification'));
          setCompletedReportId(null);
        }, 1200);
      } else if (result.error === 'already_supported') {
        setFeedback({
          id: 'already',
          title: 'You already confirmed this issue',
          detail: 'One confirmation per person keeps rewards fair.',
        });
      }
      setConfirmingId(null);
    },
    [navigate, user],
  );

  return (
    <CitizenPageShell className="motion-stagger space-y-5 pb-2" data-testid="home-page" stagger>
      <GuestModeBanner />

      <HomeDynamicHero hero={hero} />

      <NeighborhoodPulseSection reports={allReports} user={user} surface="home" />

      <CivicNextActionPrompt prompt={nextAction} />

      <ActionFeedbackToast feedback={feedback} />

      <TodaysCivicMissions missions={missions} />

      <LocalImpactStrip {...impact} />

      <NeighborhoodActivityStrip items={activity} />

      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-display text-base font-bold">Around you</h2>
          <p className="text-xs text-muted-foreground">Live issues · confirm what you see</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.nearby}>
            See all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PremiumMapFeedToggle
        value={view}
        onChange={setView}
        mapPinCount={reports.length}
        feedCount={reports.length}
      />

      {view === 'map' ? <NeighborhoodMapView reports={reports} /> : null}

      {view === 'feed' ? (
        loading ? (
          <LoadingState variant="cards" label="Finding nearby issues…" />
        ) : reports.length === 0 ? (
          <EmptyState
            variant="civic"
            testId="home-empty-nearby"
            title="Your block looks clear"
            description="No open issues nearby right now. Spot something new? Report it in under a minute."
            actionLabel="Report an issue"
            onAction={() => navigate(ROUTES.report)}
          />
        ) : (
          <div className="space-y-4" data-testid="home-nearby-feed">
            {reports.map((report, i) => {
              const media = seedMedia.find((m) => m.reportId === report.id);
              const canConfirm =
                user &&
                report.reporterId !== user.id &&
                report.status === 'pending_verification';
              const needsEyes = report.status === 'pending_verification';
              return (
                <IssueCard
                  key={report.id}
                  report={report}
                  distanceKm={estimateDistanceKm(i, report)}
                  mediaUrl={media?.thumbnailUrl}
                  variant={
                    needsEyes && canConfirm
                      ? 'live'
                      : i === 0
                        ? 'highlighted'
                        : 'default'
                  }
                  detailHref={ROUTES.issueDetail(report.id)}
                  onConfirm={canConfirm ? () => void handleConfirm(report.id) : undefined}
                  verifyTestId="verify-issue-btn"
                  showActions={Boolean(canConfirm || report.status !== 'resolved')}
                  pendingDays={needsEyes ? daysSince(report.createdAt) : undefined}
                  trustCue={
                    canConfirm
                      ? 'Needs your eyes — crews wait for neighbor confirmation'
                      : needsEyes
                        ? 'Awaiting neighborhood confirmation'
                        : undefined
                  }
                  actionCompleted={completedReportId === report.id}
                  confirming={confirmingId === report.id}
                />
              );
            })}
          </div>
        )
      ) : null}

      <CivicAccountabilityStrip className="mt-2" compact />
    </CitizenPageShell>
  );
}
