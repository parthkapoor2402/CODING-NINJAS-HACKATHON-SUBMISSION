import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Chip } from '@/components/ui/chip';
import { IssueTimeline } from '@/components/issues/IssueTimeline';
import { ResolutionProofPlaceholder } from '@/components/issues/ResolutionProofPlaceholder';
import { SuspiciousIssueNotice } from '@/components/issues/SuspiciousIssueNotice';
import { StateTransitionExplainer } from '@/components/issues/StateTransitionExplainer';
import { IssueUpdateThread } from '@/components/issues/IssueUpdateThread';
import { SupportExistingAction } from '@/components/issues/SupportExistingAction';
import { MergedIssueNotice } from '@/components/issues/MergedIssueNotice';
import { TrustParticipationCard } from '@/components/issues/TrustParticipationCard';
import { DuplicateSupportNudge } from '@/components/issues/DuplicateSupportNudge';
import { getSuspiciousReasonForReport } from '@/lib/suspicious-issues';
import { findSupportCanonicalNudge } from '@/lib/nearby-nudges';
import { ROUTES } from '@/lib/constants';
import { categoryColors } from '@/lib/design-tokens';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import { useCurrentUser } from '@/store/authStore';
import type { Report } from '@/types';
import { categoryLabel } from '@/utils/labels';
import { MapPin, Users, ChevronLeft } from 'lucide-react';

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const [report, setReport] = useState<Report | null>(null);
  const [peers, setPeers] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([services.reports.getById(id), services.reports.list()]).then(([detail, list]) => {
      setReport(detail);
      setPeers(list);
      setLoading(false);
    });
  }, [id]);

  const suspiciousReason = report ? getSuspiciousReasonForReport(report.id) : null;
  const isDuplicate = Boolean(report?.duplicateOfId || report?.status === 'merged');
  const media = report ? seedMedia.find((m) => m.reportId === report.id) : undefined;
  const catColor = report ? (categoryColors[report.category] ?? categoryColors.other) : undefined;
  const canonicalNudge = report ? findSupportCanonicalNudge(report, peers) : null;

  if (loading) {
    return (
      <CitizenPageShell>
        <LoadingState variant="cards" />
      </CitizenPageShell>
    );
  }

  if (!report) {
    return (
      <CitizenPageShell>
        <EmptyState variant="civic" title="Issue not found" description="This report may have been removed." />
      </CitizenPageShell>
    );
  }

  return (
    <CitizenPageShell className="space-y-5">
      <Link
        to={ROUTES.nearby}
        className="inline-flex items-center gap-1 text-sm font-medium text-civic-blue-600"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Nearby issues
      </Link>

      <div data-testid="issue-detail-page" className="space-y-5">
        <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
          <div className="relative aspect-[16/9] bg-muted">
            {media?.thumbnailUrl ? (
              <img src={media.thumbnailUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-4xl font-bold"
                style={{ backgroundColor: `${catColor}22`, color: catColor }}
              >
                {report.category.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="absolute left-3 top-3">
              <Chip variant="category" style={{ backgroundColor: catColor }}>
                {categoryLabel(report.category)}
              </Chip>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {categoryLabel(report.category)} · {report.severity} priority
              </p>
              <p className="mt-2 text-base font-medium leading-snug">{report.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={report.status} />
                {report.corroborationCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {report.corroborationCount} neighbor confirmations
                  </span>
                ) : null}
                {report.location.address ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {report.location.address}
                  </span>
                ) : null}
              </div>
            </div>

            <StateTransitionExplainer report={report} />
          </div>
        </div>

        {isDuplicate ? (
          <MergedIssueNotice canonicalReportId={report.duplicateOfId} />
        ) : canonicalNudge ? (
          <DuplicateSupportNudge
            canonicalReportId={canonicalNudge.canonicalReportId}
            similarityScore={canonicalNudge.similarityScore}
          />
        ) : null}

        {suspiciousReason ? <SuspiciousIssueNotice reason={suspiciousReason} /> : null}

        <IssueTimeline report={report} />

        {user && !isDuplicate ? (
          <SupportExistingAction
            report={report}
            userId={user.id}
            onSupported={setReport}
          />
        ) : null}

        <TrustParticipationCard />

        <IssueUpdateThread reportId={report.id} />

        {report.status === 'resolved' ? <ResolutionProofPlaceholder report={report} /> : null}
      </div>
    </CitizenPageShell>
  );
}
