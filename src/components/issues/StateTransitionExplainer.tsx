import type { Report } from '@/types';
import { getStateExplainer } from '@/lib/issue-timeline';
import { Info } from 'lucide-react';

interface StateTransitionExplainerProps {
  report: Pick<Report, 'status' | 'assignedWorkerId' | 'reopenedAt'>;
}

export function StateTransitionExplainer({ report }: StateTransitionExplainerProps) {
  return (
    <div
      className="flex gap-3 rounded-xl border border-civic-blue-100 bg-civic-blue-50/40 p-3 text-sm"
      role="status"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-civic-blue-600" aria-hidden />
      <div>
        <p className="font-medium text-civic-blue-900">What this means</p>
        <p className="mt-1 text-xs leading-relaxed text-civic-blue-900/85">
          {getStateExplainer(report)}
        </p>
      </div>
    </div>
  );
}
