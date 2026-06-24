import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { GitMerge } from 'lucide-react';

interface DuplicateSupportNudgeProps {
  canonicalReportId: string;
  similarityScore?: number;
}

export function DuplicateSupportNudge({
  canonicalReportId,
  similarityScore,
}: DuplicateSupportNudgeProps) {
  return (
    <div
      className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/50 p-3 text-sm"
      data-testid="duplicate-support-nudge"
    >
      <div className="flex items-start gap-2">
        <GitMerge className="mt-0.5 h-4 w-4 shrink-0 text-civic-amber-700" aria-hidden />
        <div className="flex-1 space-y-2">
          <p className="font-medium text-civic-amber-900">Your neighbors are already on this</p>
          <p className="text-xs leading-relaxed text-civic-amber-900/85">
            {similarityScore
              ? `About ${similarityScore}% match nearby. `
              : ''}
            Add your confirmation to the open report — it strengthens crew priority and keeps your
            trust score healthy. Filing again splits signal without extra impact.
          </p>
          <Button variant="outline" size="sm" className="border-civic-amber-300" asChild>
            <Link to={ROUTES.issueDetail(canonicalReportId)} data-testid="support-existing-btn">
              Support existing report
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
