import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { IssueUpdate, Report } from '@/types';
import { services } from '@/services/registry';
import { ROUTES } from '@/lib/constants';
import { formatRelativeDate } from '@/utils/format';
import { categoryLabel } from '@/utils/labels';
import { currentTimelineStep } from '@/domain/track-journey';
import { STEP_VISUAL } from '@/lib/issue-timeline';
import { StatusBadge } from '@/components/StatusBadge';
import { IssueTimeline } from '@/components/issues/IssueTimeline';
import { IssueUpdateThread } from '@/components/issues/IssueUpdateThread';
import { ImpactBecauseOfYou } from '@/components/tracking/ImpactBecauseOfYou';
import { IssueSocialProofStrip } from '@/components/tracking/IssueSocialProofStrip';
import { FollowToResolutionCard } from '@/components/tracking/FollowToResolutionCard';
import { ResolvedImpactCard } from '@/components/tracking/ResolvedImpactCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackReportCardProps {
  report: Report;
  onReopen: (reportId: string) => void;
}

export function TrackReportCard({ report, onReopen }: TrackReportCardProps) {
  const [latestUpdate, setLatestUpdate] = useState<IssueUpdate | null>(null);
  const step = currentTimelineStep(report);
  const stepVisual = STEP_VISUAL[step];

  useEffect(() => {
    services.issueUpdates.getForReport(report.id).then((updates) => {
      if (updates.length > 0) {
        setLatestUpdate(updates[updates.length - 1]);
      }
    });
  }, [report.id]);

  return (
    <Card className="overflow-hidden shadow-card" data-testid={`track-report-${report.id}`}>
      <div className={cn('border-b px-4 py-3', stepVisual.compact)}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-semibold">{categoryLabel(report.category)}</p>
            {report.location.address ? (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                <span className="truncate">{report.location.address}</span>
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={report.status} />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link to={ROUTES.issueDetail(report.id)} aria-label="View issue details">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-foreground/90">{report.description}</p>
      </div>

      <CardContent className="space-y-4 p-4">
        <ImpactBecauseOfYou report={report} />
        <IssueSocialProofStrip report={report} />

        <IssueTimeline report={report} compact />

        {latestUpdate ? (
          <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Latest official update</span>
            {' · '}
            {latestUpdate.message}
            {' · '}
            {formatRelativeDate(latestUpdate.createdAt)}
          </p>
        ) : null}

        <FollowToResolutionCard report={report} />

        <IssueUpdateThread reportId={report.id} variant="narrative" limit={3} />

        {report.status === 'resolved' ? (
          <ResolvedImpactCard report={report} />
        ) : null}

        {report.status === 'resolved' ? (
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              If the fix did not hold, reopening returns the issue to the ward queue. No penalty —
              we want accurate outcomes.
            </p>
            <Button
              variant="outline"
              size="sm"
              data-testid="reopen-issue-btn"
              onClick={() => onReopen(report.id)}
            >
              Reopen — issue not fixed
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
