import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { IssueCard } from '@/components/cards/IssueCard';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import { TrustParticipationCard } from '@/components/issues/TrustParticipationCard';
import { ROUTES } from '@/lib/constants';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import { applyTrustUpdate, useAuthStore } from '@/store/authStore';
import type { Report } from '@/types';
import { ShieldCheck, Users } from 'lucide-react';

export default function VerificationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    services.reports
      .list()
      .then((data) => {
        setReports(data.filter((r) => r.status === 'pending_verification'));
        setLoading(false);
      });
  }, []);

  async function handleVerify(reportId: string) {
    const sessionUserId = useAuthStore.getState().session?.user.id;
    if (!sessionUserId) return;
    const result = await services.reports.corroborate(reportId, sessionUserId);
    if (result.ok && result.report) {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      applyTrustUpdate();
      setFeedback(
        'Confirmation recorded — you helped crews trust this report. Thank you for participating responsibly.',
      );
    } else if (result.error === 'already_supported') {
      setFeedback('You already confirmed this issue. One confirmation per person keeps rewards fair.');
    }
  }

  return (
    <CitizenPageShell className="space-y-4" data-testid="community-verify-page">
      <div className="rounded-xl border border-civic-teal-200 bg-gradient-to-br from-civic-teal-50/80 to-white p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-teal-100">
            <Users className="h-5 w-5 text-civic-teal-700" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-base font-bold">Community verification</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Confirm only what you can see. Your corroboration helps honest reporters reach crews —
              and keeps duplicate noise out of the system.
            </p>
          </div>
        </div>
      </div>

      <TrustParticipationCard variant="compact" />

      {feedback ? (
        <p
          className="rounded-lg border border-civic-teal-200 bg-civic-teal-50/50 px-3 py-2 text-xs text-civic-teal-900"
          role="status"
          data-testid="verify-feedback"
        >
          {feedback}
        </p>
      ) : null}

      {loading ? (
        <LoadingState variant="cards" label="Loading reports awaiting confirmation…" />
      ) : reports.length === 0 ? (
        <EmptyState
          variant="civic"
          testId="verify-empty-state"
          icon={<ShieldCheck className="h-7 w-7" />}
          title="All caught up nearby"
          description="No reports need your confirmation right now. When you are out in the neighborhood, a quick confirm helps crews act on real issues."
        />
      ) : (
        reports.map((report) => {
          const media = seedMedia.find((m) => m.reportId === report.id);
          return (
            <IssueCard
              key={report.id}
              report={report}
              mediaUrl={media?.thumbnailUrl}
              showActions
              verifyTestId="verify-issue-btn"
              detailHref={ROUTES.issueDetail(report.id)}
              onConfirm={() => handleVerify(report.id)}
            />
          );
        })
      )}

      <p className="text-center text-xs text-muted-foreground">
        Prefer more context?{' '}
        <Link to={ROUTES.nearby} className="font-medium text-civic-blue-600">
          Browse nearby issues
        </Link>
      </p>
    </CitizenPageShell>
  );
}
