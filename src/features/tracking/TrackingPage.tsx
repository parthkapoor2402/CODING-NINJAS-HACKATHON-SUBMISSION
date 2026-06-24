import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IssueTimeline } from '@/components/issues/IssueTimeline';
import { ResolutionProofPlaceholder } from '@/components/issues/ResolutionProofPlaceholder';
import { StateTransitionExplainer } from '@/components/issues/StateTransitionExplainer';
import { TrustParticipationCard } from '@/components/issues/TrustParticipationCard';
import { useCurrentUser } from '@/store/authStore';
import { services } from '@/services/registry';
import type { Report } from '@/types';
import { categoryLabel } from '@/utils/labels';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { formatRelativeDate } from '@/utils/format';

type ReportFilter = 'all' | 'open' | 'resolved' | 'needs_action';

const FILTERS: { id: ReportFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'needs_action', label: 'Needs action' },
];

function matchesFilter(report: Report, filter: ReportFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'resolved') return report.status === 'resolved';
  if (filter === 'open') return report.status !== 'resolved' && report.status !== 'merged';
  if (filter === 'needs_action') return report.status === 'resolved';
  return true;
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReportFilter>('all');
  const [reopenNote, setReopenNote] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    services.reports.findByReporter(user.id).then((data) => {
      setReports(data.filter((r) => r.status !== 'merged'));
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(
    () => reports.filter((r) => matchesFilter(r, filter)),
    [reports, filter],
  );

  async function handleReopen(reportId: string) {
    if (!user) return;
    const updated = await services.reports.reopen(reportId, user.id);
    setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    setReopenNote('Issue reopened — crews will see it in the queue again. Thank you for keeping us honest.');
  }

  return (
    <CitizenPageShell className="space-y-4">
      <TrustParticipationCard variant="compact" />

      {loading ? (
        <LoadingState variant="cards" label="Loading your reports…" />
      ) : reports.length === 0 ? (
        <EmptyState
          variant="civic"
          icon={<ClipboardList className="h-7 w-7" />}
          title="No reports yet"
          description="When you report an issue, you'll see status updates here — from verification through resolution."
          actionLabel="Report your first issue"
          onAction={() => navigate(ROUTES.report)}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? 'teal' : 'outline'}
                size="sm"
                data-testid={`my-reports-filter-${f.id}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {reopenNote ? (
            <p className="rounded-lg border border-civic-amber-200 bg-civic-amber-50/50 px-3 py-2 text-xs text-civic-amber-900" role="status">
              {reopenNote}
            </p>
          ) : null}

          <div className="space-y-4" data-testid="my-reports-list">
            {filtered.map((report) => (
              <Card key={report.id} className="overflow-hidden shadow-card">
                <div className="border-b bg-muted/40 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatRelativeDate(report.createdAt)}
                    </span>
                    <StatusBadge status={report.status} />
                  </div>
                </div>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold">{categoryLabel(report.category)}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0" asChild>
                      <Link to={ROUTES.issueDetail(report.id)}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <StateTransitionExplainer report={report} />
                  <IssueTimeline report={report} compact />

                  {report.status === 'resolved' ? (
                    <ResolutionProofPlaceholder report={report} />
                  ) : null}

                  {report.status === 'resolved' ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        If the fix did not hold, reopening returns the issue to the ward queue. No
                        penalty — we want accurate outcomes.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="reopen-issue-btn"
                        onClick={() => handleReopen(report.id)}
                      >
                        Reopen — issue not fixed
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </CitizenPageShell>
  );
}
