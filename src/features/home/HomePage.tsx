import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { FirstSessionEducationCard } from '@/components/education/FirstSessionEducationCard';
import { GuestModeBanner } from '@/components/guest/GuestModeBanner';
import { CivicPulseStrip } from '@/components/home/CivicPulseStrip';
import { HomeHero } from '@/features/home/HomeHero';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { MapPreviewCard } from '@/components/cards/MapPreviewCard';
import { IssueCard } from '@/components/cards/IssueCard';
import { LoadingState } from '@/components/states/LoadingState';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useOnboardingStore } from '@/store/onboardingStore';
import { applyTrustUpdate, useCurrentUser } from '@/store/authStore';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import { ROUTES } from '@/lib/constants';
import type { Report } from '@/types';

type HomeView = 'map' | 'feed';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function HomePage() {
  const navigate = useNavigate();
  const persona = useOnboardingStore((s) => s.persona);
  const user = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<HomeView>('map');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    services.reports.list().then((data) => {
      setAllReports(data);
      const open = data.filter((r) => r.status !== 'merged' && r.status !== 'resolved');
      setReports(open.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const pulse = useMemo(() => {
    const now = Date.now();
    const openNearby = allReports.filter(
      (r) => r.status !== 'merged' && r.status !== 'resolved',
    ).length;
    const awaitingVerification = allReports.filter(
      (r) => r.status === 'pending_verification',
    ).length;
    const resolvedThisWeek = allReports.filter((r) => {
      if (!r.resolvedAt) return false;
      return now - new Date(r.resolvedAt).getTime() <= WEEK_MS;
    }).length;
    return { openNearby, awaitingVerification, resolvedThisWeek };
  }, [allReports]);

  const handleConfirm = useCallback(
    async (reportId: string) => {
      if (!user) {
        navigate(ROUTES.auth);
        return;
      }
      setConfirmingId(reportId);
      const result = await services.reports.corroborate(reportId, user.id);
      if (result.ok && result.report) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? result.report! : r)),
        );
        setAllReports((prev) =>
          prev.map((r) => (r.id === reportId ? result.report! : r)),
        );
        applyTrustUpdate();
      }
      setConfirmingId(null);
    },
    [navigate, user],
  );

  return (
    <CitizenPageShell className="space-y-5" data-testid="home-page">
      <GuestModeBanner />
      <FirstSessionEducationCard />
      <HomeHero persona={persona} />

      <CivicPulseStrip
        openNearby={pulse.openNearby}
        awaitingVerification={pulse.awaitingVerification}
        resolvedThisWeek={pulse.resolvedThisWeek}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-bold">Around you</h2>
          <p className="text-xs text-muted-foreground">Ward 12 · live neighborhood signal</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.nearby}>
            See all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <SegmentedControl
        options={[
          { value: 'map', label: 'Map' },
          { value: 'feed', label: 'Feed' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'map' ? (
        <MapPreviewCard pinCount={pulse.openNearby} wardName="Ward 12 · MG Road area" />
      ) : null}

      {loading ? (
        <LoadingState variant="cards" label="Finding nearby issues…" />
      ) : reports.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-civic-teal-200 bg-civic-teal-50/30 px-4 py-6 text-center"
          data-testid="home-empty-nearby"
        >
          <p className="font-display text-sm font-semibold text-civic-teal-900">
            Your block looks clear
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            No open issues nearby right now. Spot something new? Report it in under a minute.
          </p>
          <Button variant="civic" size="sm" className="mt-4" asChild>
            <Link to={ROUTES.report}>Report an issue</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4" data-testid="home-nearby-feed">
          {reports.map((report, i) => {
            const media = seedMedia.find((m) => m.reportId === report.id);
            const canConfirm =
              user &&
              report.reporterId !== user.id &&
              report.status === 'pending_verification';
            return (
              <div key={report.id} className="space-y-1">
                <IssueCard
                  report={report}
                  distanceKm={0.2 + i * 0.15}
                  mediaUrl={media?.thumbnailUrl}
                  variant={i === 0 ? 'highlighted' : 'default'}
                  detailHref={ROUTES.issueDetail(report.id)}
                  onConfirm={canConfirm ? () => void handleConfirm(report.id) : undefined}
                  verifyTestId="verify-issue-btn"
                  showActions={i === 0}
                />
                {confirmingId === report.id ? (
                  <p className="text-xs text-muted-foreground">Recording your confirmation…</p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {pulse.resolvedThisWeek > 0 ? (
        <div className="flex items-center gap-2 rounded-xl border border-civic-teal-500/20 bg-civic-teal-50/50 px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-civic-teal-600" />
          <p className="text-xs leading-relaxed text-civic-teal-800">
            <span className="font-semibold">
              {pulse.resolvedThisWeek} issue{pulse.resolvedThisWeek === 1 ? '' : 's'} resolved
            </span>{' '}
            near you this week. Verified signal drives real crew action — not complaint volume.
          </p>
        </div>
      ) : null}
    </CitizenPageShell>
  );
}
