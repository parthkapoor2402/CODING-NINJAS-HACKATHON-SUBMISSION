import type { Report } from '@/types';
import { followMotivationCopy } from '@/domain/track-journey';
import { Compass } from 'lucide-react';

interface FollowToResolutionCardProps {
  report: Pick<Report, 'status' | 'corroborationCount' | 'category' | 'reopenedAt'>;
}

export function FollowToResolutionCard({ report }: FollowToResolutionCardProps) {
  const copy = followMotivationCopy(report);
  if (!copy) return null;

  return (
    <div
      data-testid="follow-to-resolution"
      className="rounded-xl border border-civic-blue-100 bg-civic-blue-50/40 p-3"
    >
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-civic-blue-100 text-civic-blue-700">
          <Compass className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-civic-blue-900">{copy.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-civic-blue-900/85">{copy.body}</p>
          <p className="mt-2 text-[10px] font-medium text-civic-blue-700">{copy.cta}</p>
        </div>
      </div>
    </div>
  );
}
