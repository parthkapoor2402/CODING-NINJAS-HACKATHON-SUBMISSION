import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { applyOpsTriageAction } from '@/domain/ops-triage-actions';
import { suggestOpsTriage } from '@/services/ai/ops-triage-copilot-agent';
import { services } from '@/services/registry';
import type { OpsTriageMetadata } from '@/types/ops-triage-copilot';
import type { OpsTriageSuggestedAction } from '@shared/ops-triage-copilot';
import type { Report } from '@/types';

const TIER_STYLES: Record<string, string> = {
  urgent: 'bg-red-100 text-red-900',
  high: 'bg-amber-100 text-amber-900',
  normal: 'bg-blue-100 text-blue-900',
  monitor: 'bg-muted text-muted-foreground',
};

interface OpsTriagePanelProps {
  report: Report;
  adminId: string;
  duplicateRisk: number;
  onReportChange?: (report: Report) => void;
}

export function OpsTriagePanel({
  report,
  adminId,
  duplicateRisk,
  onReportChange,
}: OpsTriagePanelProps) {
  const [triage, setTriage] = useState<OpsTriageMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [queue, cases] = await Promise.all([
      services.backend.admin.getQueue(),
      services.backend.admin.getSuspiciousCases(),
    ]);
    const suspiciousIds = new Set(
      cases.map((c) => c.reportId).filter((id): id is string => typeof id === 'string'),
    );
    const result = await suggestOpsTriage(
      {
        adminId,
        reportId: report.id,
        wardId: report.location.wardId,
        duplicateRisk,
      },
      queue,
      { suspiciousReportIds: suspiciousIds },
    );
    setTriage(result);
    setLoading(false);
  }, [adminId, duplicateRisk, report.id, report.location.wardId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApply = async (action: OpsTriageSuggestedAction) => {
    if (!reason.trim() && ['assign_field_crew', 'merge_candidate_review'].includes(action.action)) {
      setMessage('Please add a short reason before applying this action.');
      return;
    }
    setApplying(action.action);
    setMessage(null);
    try {
      const updated = await applyOpsTriageAction(
        action.action,
        report.id,
        action.draftPayload,
        reason,
      );
      if (updated) onReportChange?.(updated);
      setMessage(`Applied: ${action.label}`);
      setReason('');
    } finally {
      setApplying(null);
    }
  };

  const issue = triage?.issue;

  return (
    <Card data-testid="ops-triage-panel">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Triage suggestions
          </h2>
          <Button
            variant="ghost"
            size="sm"
            data-testid="ops-triage-refresh"
            disabled={loading}
            onClick={() => void load()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>

        <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Sparkles className="h-3 w-3" aria-hidden />
          Suggested by triage copilot — you apply each action explicitly
        </p>

        {loading ? (
          <p className="text-xs text-muted-foreground">Analyzing queue context…</p>
        ) : !issue ? (
          <p className="text-xs text-muted-foreground">No triage suggestion available.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${TIER_STYLES[issue.priorityTier] ?? TIER_STYLES.normal}`}
              >
                {issue.priorityTier} priority
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                Rank #{issue.queuePlacement.suggestedRank}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                Urgency {issue.urgencyScore}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                Confidence {issue.confidenceScore}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-foreground">{issue.explanation}</p>

            {issue.hotspotNote ? (
              <p className="text-xs text-amber-800">{issue.hotspotNote}</p>
            ) : null}

            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium">Score breakdown</summary>
              <ul className="mt-2 space-y-1">
                {issue.queuePlacement.scoreBreakdown.map((f) => (
                  <li key={`${f.factor}-${f.points}`}>
                    {f.factor}: +{f.points}
                    {f.note ? ` (${f.note})` : ''}
                  </li>
                ))}
              </ul>
            </details>

            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Override / apply reason (optional for notes, required for assign & merge review)
              <textarea
                data-testid="ops-triage-reason"
                className="min-h-[60px] rounded-lg border bg-card px-3 py-2 text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why you are taking this action…"
              />
            </label>

            <ul className="space-y-2">
              {issue.suggestedActions.map((action) => (
                <li
                  key={action.action}
                  className="rounded-lg border bg-muted/20 p-2"
                  data-testid={`ops-triage-action-${action.action}`}
                >
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{action.citation}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    data-testid={`ops-triage-apply-${action.action}`}
                    disabled={applying != null}
                    onClick={() => void handleApply(action)}
                  >
                    {applying === action.action ? 'Applying…' : 'Apply suggestion'}
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}

        {message ? (
          <p className="text-xs text-civic-teal-700" data-testid="ops-triage-feedback">
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
