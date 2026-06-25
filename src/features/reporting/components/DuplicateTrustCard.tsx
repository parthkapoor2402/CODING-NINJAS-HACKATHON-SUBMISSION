import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { reportDisplayName } from '@/lib/report-display';
import { getSeedReportById } from '@/services/mock/seed/reports';
import type { DuplicateTrustMetadata } from '@/types/duplicate-trust';

interface DuplicateTrustCardProps {
  result: DuplicateTrustMetadata;
}

export function DuplicateTrustCard({ result }: DuplicateTrustCardProps) {
  const supportId = result.supportExistingReportId ?? result.matches[0]?.reportId;
  const supportReport = supportId ? getSeedReportById(supportId) : undefined;
  const supportLabel = supportReport ? reportDisplayName(supportReport) : 'a nearby report';

  const showDuplicate =
    result.classification === 'high_confidence_duplicate' ||
    result.classification === 'possible_duplicate';

  const showTrust =
    result.classification === 'suspicious_low_signal' ||
    (result.trustSignals.length > 0 && !showDuplicate);

  if (!showDuplicate && !showTrust) return null;

  return (
    <>
      {showDuplicate && supportId ? (
        <div
          className="rounded-xl border border-civic-amber-300 bg-civic-amber-50/70 p-3 text-sm"
          data-testid="duplicate-warning"
          role="status"
        >
          <p className="font-medium text-amber-900">Neighbors may already be on this</p>
          <p className="mt-1 text-xs text-amber-900/80">{result.userMessage}</p>
          {result.comparisonNarrative ? (
            <p className="mt-2 text-xs text-amber-900/70">{result.comparisonNarrative}</p>
          ) : null}
          <p className="mt-2 text-xs text-amber-900/80">
            <strong>{supportLabel}</strong>
            {result.matches[0] ? ` · ${result.matches[0].score}% match · ${result.matches[0].distanceM}m away` : null}
          </p>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link to={ROUTES.issueDetail(supportId)} data-testid="support-existing-report">
              View &amp; support existing report
            </Link>
          </Button>
        </div>
      ) : null}

      {showTrust ? (
        <div
          className="rounded-xl border border-civic-blue-200 bg-civic-blue-50/50 p-3 text-sm"
          data-testid="suspicious-warning"
          role="status"
        >
          <p className="font-medium text-civic-blue-900">Extra care before routing</p>
          <p className="mt-1 text-xs text-civic-blue-800/90">{result.userMessage}</p>
          <p className="mt-1 text-xs text-civic-blue-800/90">
            We protect neighborhood signal quality — this helps honest reporters, not penalties.
          </p>
          {result.trustSignals.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-civic-blue-800/90">
              {result.trustSignals.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          ) : null}
          {result.rewardEligibility === 'none' || result.rewardEligibility === 'hold' ? (
            <p className="mt-2 text-xs text-civic-blue-800">
              Rewards unlock after community or admin verification.
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
