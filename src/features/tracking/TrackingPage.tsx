import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import { TrackReportCard } from '@/components/tracking/TrackReportCard';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/store/authStore';
import { services } from '@/services/registry';
import type { Report } from '@/types';
import { ClipboardList } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

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
  const [searchParams] = useSearchParams();
  const user = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const initialFilter = searchParams.get('filter');
  const [filter, setFilter] = useState<ReportFilter>(() => {
    if (initialFilter === 'resolved' || initialFilter === 'open' || initialFilter === 'needs_action') {
      return initialFilter;
    }
    return 'all';
  });
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

  const openCount = reports.filter((r) => r.status !== 'resolved').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  async function handleReopen(reportId: string) {
    if (!user) return;
    const updated = await services.reports.reopen(reportId, user.id);
    setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    setReopenNote('Issue reopened — crews will see it in the queue again. Thank you for keeping us honest.');
  }

  return (
    <CitizenPageShell className="motion-stagger space-y-4" data-testid="tracking-page" stagger>
      <header className="space-y-1">
        <h1 className="font-display text-lg font-bold">Track your impact</h1>
        <p className="text-sm text-muted-foreground">
          Follow each report from neighborhood proof through crew resolution — every step on record.
        </p>
        {!loading && reports.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {openCount} active journey{openCount === 1 ? '' : 's'} · {resolvedCount} resolved
          </p>
        ) : null}
      </header>

      {loading ? (
        <LoadingState variant="cards" label="Loading your reports…" />
      ) : reports.length === 0 ? (
        <EmptyState
          variant="civic"
          icon={<ClipboardList className="h-7 w-7" />}
          title="No reports yet"
          description="When you report an issue, you'll follow its resolution journey here — from verification through official crew updates."
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
            <p
              className="rounded-lg border border-civic-amber-200 bg-civic-amber-50/50 px-3 py-2 text-xs text-civic-amber-900"
              role="status"
            >
              {reopenNote}
            </p>
          ) : null}

          <div className="space-y-4" data-testid="my-reports-list">
            {filtered.map((report) => (
              <TrackReportCard key={report.id} report={report} onReopen={handleReopen} />
            ))}
          </div>
        </>
      )}
    </CitizenPageShell>
  );
}
