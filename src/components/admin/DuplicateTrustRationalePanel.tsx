import { Card, CardContent } from '@/components/ui/card';
import type { Report } from '@/types';

interface DuplicateTrustRationalePanelProps {
  report: Report;
}

export function DuplicateTrustRationalePanel({ report }: DuplicateTrustRationalePanelProps) {
  const trust = report.aiMetadata?.duplicateTrust;
  if (!trust) return null;

  return (
    <Card data-testid="duplicate-trust-rationale">
      <CardContent className="space-y-3 p-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Duplicate &amp; trust rationale
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2 py-0.5 capitalize">
            {trust.classification.replace(/_/g, ' ')}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 capitalize">
            {trust.recommendedAction.replace(/_/g, ' ')}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5">
            Risk {trust.riskScore}/100
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 capitalize">
            Rewards: {trust.rewardEligibility}
          </span>
        </div>
        {trust.comparisonNarrative ? (
          <p className="text-sm text-muted-foreground">{trust.comparisonNarrative}</p>
        ) : null}
        <ul className="space-y-1 text-xs text-muted-foreground">
          {trust.adminRationale.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
        {trust.matches.length > 0 ? (
          <div className="rounded-lg border bg-muted/20 p-2 text-xs">
            <p className="font-medium text-foreground">Grounded matches</p>
            <ul className="mt-1 space-y-1">
              {trust.matches.map((m) => (
                <li key={m.reportId}>
                  {m.reportId}: {m.title} ({m.score}%, {m.distanceM}m)
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-[10px] text-muted-foreground">
          Model: {trust.model}
          {trust.fallbackUsed ? ' · heuristic fallback' : ''} · {trust.analyzedAt}
        </p>
      </CardContent>
    </Card>
  );
}
