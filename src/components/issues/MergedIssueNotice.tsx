import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface MergedIssueNoticeProps {
  canonicalReportId?: string;
}

export function MergedIssueNotice({ canonicalReportId }: MergedIssueNoticeProps) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-lg border border-civic-amber-200 bg-civic-amber-50/50 px-3 py-2 text-sm text-civic-amber-900"
        data-testid="duplicate-issue-marker"
      >
        Marked as duplicate — merged into the primary report for this location.
      </div>
      {canonicalReportId ? (
        <Button variant="teal" size="sm" asChild>
          <Link to={ROUTES.issueDetail(canonicalReportId)}>View & support primary report</Link>
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Support the primary report in the nearby feed instead.
        </div>
      )}
    </div>
  );
}
