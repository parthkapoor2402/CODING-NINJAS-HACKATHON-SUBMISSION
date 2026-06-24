import type { Report } from '@/types';
import { buildSocialProof } from '@/domain/track-journey';
import { ArrowUpRight, Route, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueSocialProofStripProps {
  report: Pick<
    Report,
    'status' | 'corroborationCount' | 'category' | 'assignedWorkerId' | 'severity' | 'location'
  >;
}

const toneStyles = {
  community: 'border-civic-teal-200 bg-civic-teal-50/60 text-civic-teal-900',
  official: 'border-civic-blue-200 bg-civic-blue-50/60 text-civic-blue-900',
  routing: 'border-civic-amber-200 bg-civic-amber-50/60 text-civic-amber-900',
};

const toneIcon = {
  community: Users,
  official: ArrowUpRight,
  routing: Route,
};

export function IssueSocialProofStrip({ report }: IssueSocialProofStripProps) {
  const chips = buildSocialProof(report);
  if (chips.length === 0) return null;

  return (
    <div data-testid="issue-social-proof" className="flex flex-wrap gap-1.5">
      {chips.map((chip) => {
        const Icon = toneIcon[chip.tone];
        return (
          <span
            key={chip.id}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold',
              toneStyles[chip.tone],
            )}
          >
            <Icon className="h-3 w-3 shrink-0" aria-hidden />
            {chip.label}
          </span>
        );
      })}
    </div>
  );
}
