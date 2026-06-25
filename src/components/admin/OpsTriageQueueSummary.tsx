import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { suggestOpsTriage } from '@/services/ai/ops-triage-copilot-agent';
import { services } from '@/services/registry';
import type { OpsTriageQueueExplanation } from '@shared/ops-triage-copilot';

interface OpsTriageQueueSummaryProps {
  adminId: string;
}

export function OpsTriageQueueSummary({ adminId }: OpsTriageQueueSummaryProps) {
  const [explanations, setExplanations] = useState<OpsTriageQueueExplanation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    services.backend.admin.getQueue().then((queue) => {
      if (!active) return;
      void suggestOpsTriage({ adminId }, queue).then((meta) => {
        if (active) {
          setExplanations(meta.queueExplanations);
          setLoading(false);
        }
      });
    });
    return () => {
      active = false;
    };
  }, [adminId]);

  if (loading || explanations.length === 0) return null;

  return (
    <Card data-testid="ops-triage-queue-summary" className="mb-4">
      <CardContent className="space-y-2 p-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Queue triage insight
        </h2>
        <p className="text-xs text-muted-foreground">
          Top items ranked by urgency and trust-weighted confidence — apply actions on each issue.
        </p>
        <ol className="space-y-1 text-xs">
          {explanations.map((e) => (
            <li key={e.reportId} className="flex gap-2">
              <span className="font-mono text-muted-foreground">#{e.rank}</span>
              <span className="capitalize text-foreground">{e.priorityTier}</span>
              <span className="text-muted-foreground">— {e.summary}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
