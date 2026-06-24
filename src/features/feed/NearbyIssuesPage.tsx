import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { IssueCard } from '@/components/cards/IssueCard';
import { MapPreviewCard } from '@/components/cards/MapPreviewCard';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Button } from '@/components/ui/button';
import { DuplicateSupportNudge } from '@/components/issues/DuplicateSupportNudge';
import { TrustParticipationCard } from '@/components/issues/TrustParticipationCard';
import { sortIssuesByDistance, sortIssuesByUrgency, withDistances } from '@/lib/issue-sorting';
import { findSupportCanonicalNudge } from '@/lib/nearby-nudges';
import { ROUTES } from '@/lib/constants';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import { applyTrustUpdate, useCurrentUser } from '@/store/authStore';
import type { Report } from '@/types';
import { MapPin } from 'lucide-react';

type NearbyView = 'list' | 'map';
type SortMode = 'distance' | 'urgency';

const USER_LAT = 12.9716;
const USER_LNG = 77.5946;

export default function NearbyIssuesPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<NearbyView>('list');
  const [sortMode, setSortMode] = useState<SortMode>('distance');
  const [supportingId, setSupportingId] = useState<string | null>(null);

  useEffect(() => {
    services.reports.list().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const feedItems = useMemo(() => {
    const withDistance = withDistances(reports, USER_LAT, USER_LNG);
    if (sortMode === 'urgency') {
      const sorted = sortIssuesByUrgency(reports);
      const distanceMap = new Map(withDistance.map((i) => [i.report.id, i.distanceKm]));
      return sorted.map((report) => ({
        report,
        distanceKm: distanceMap.get(report.id) ?? 0,
      }));
    }
    return sortIssuesByDistance(withDistance);
  }, [reports, sortMode]);

  const handleSupport = useCallback(
    async (reportId: string) => {
      if (!user) {
        navigate(ROUTES.auth);
        return;
      }
      setSupportingId(reportId);
      const result = await services.reports.corroborate(reportId, user.id);
      if (result.ok && result.report) {
        setReports((prev) => prev.map((r) => (r.id === reportId ? result.report! : r)));
        applyTrustUpdate();
      }
      setSupportingId(null);
    },
    [navigate, user],
  );

  return (
    <CitizenPageShell className="space-y-4" data-testid="nearby-issues-page">
      <TrustParticipationCard variant="compact" />

      <SegmentedControl
        options={[
          { value: 'list', label: 'List' },
          { value: 'map', label: 'Map' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'list' ? (
        <div className="flex gap-2">
          <Button
            variant={sortMode === 'distance' ? 'teal' : 'outline'}
            size="sm"
            data-testid="sort-by-distance"
            onClick={() => setSortMode('distance')}
          >
            Nearest
          </Button>
          <Button
            variant={sortMode === 'urgency' ? 'teal' : 'outline'}
            size="sm"
            data-testid="sort-by-urgency"
            onClick={() => setSortMode('urgency')}
          >
            Most urgent
          </Button>
        </div>
      ) : null}

      {view === 'map' ? (
        <MapPreviewCard pinCount={reports.length} label="Open issues" wardName="Within 2 km" />
      ) : null}

      {loading ? (
        <LoadingState variant="cards" />
      ) : reports.length === 0 ? (
        <EmptyState
          variant="civic"
          icon={<MapPin className="h-7 w-7" />}
          title="No open issues nearby"
          description="That's good news for your block. If you spot something, report it so crews can act."
          actionLabel="Report an issue"
          onAction={() => navigate(ROUTES.report)}
        />
      ) : (
        <div
          className="space-y-4"
          data-testid="nearby-feed"
          data-order={feedItems.map((i) => i.report.id).join(',')}
        >
          {feedItems.map(({ report, distanceKm }) => {
            const media = seedMedia.find((m) => m.reportId === report.id);
            const nudge = findSupportCanonicalNudge(report, reports);
            const canSupport =
              user &&
              report.reporterId !== user.id &&
              report.status !== 'resolved' &&
              report.status !== 'merged';

            return (
              <div key={report.id} className="space-y-2">
                {nudge ? (
                  <DuplicateSupportNudge
                    canonicalReportId={nudge.canonicalReportId}
                    similarityScore={nudge.similarityScore}
                  />
                ) : null}
                <IssueCard
                  report={report}
                  distanceKm={distanceKm}
                  mediaUrl={media?.thumbnailUrl}
                  detailHref={ROUTES.issueDetail(report.id)}
                  showActions
                  onSupport={
                    canSupport
                      ? () => {
                          void handleSupport(report.id);
                        }
                      : undefined
                  }
                  supportTestId={canSupport ? 'support-existing-btn' : undefined}
                />
                {supportingId === report.id ? (
                  <p className="text-xs text-muted-foreground">Recording your confirmation…</p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </CitizenPageShell>
  );
}
