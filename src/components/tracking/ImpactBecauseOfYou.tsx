import type { Report } from '@/types';
import { buildImpactSummary } from '@/domain/track-journey';
import { Sparkles } from 'lucide-react';

interface ImpactBecauseOfYouProps {
  report: Pick<
    Report,
    'status' | 'corroborationCount' | 'category' | 'description' | 'assignedWorkerId' | 'reopenedAt'
  >;
}

export function ImpactBecauseOfYou({ report }: ImpactBecauseOfYouProps) {
  const impact = buildImpactSummary(report);

  return (
    <div
      data-testid="impact-because-of-you"
      className="rounded-xl border border-civic-teal-100 bg-gradient-to-br from-civic-teal-50/70 to-white p-3"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-civic-teal-100 text-civic-teal-700">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-civic-teal-700">
            What changed because of your action
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{impact.headline}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{impact.detail}</p>
        </div>
      </div>
    </div>
  );
}
