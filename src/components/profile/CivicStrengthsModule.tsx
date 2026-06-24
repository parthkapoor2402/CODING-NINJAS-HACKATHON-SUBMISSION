import type { CivicStrength } from '@/domain/civic-identity';
import { ClipboardList, Eye, Route } from 'lucide-react';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { cn } from '@/lib/utils';

interface CivicStrengthsModuleProps {
  strengths: CivicStrength[];
}

const icons = {
  reporting: ClipboardList,
  verification: Eye,
  'follow-through': Route,
};

const strengthColors: Record<CivicStrength['strengthLabel'], string> = {
  Emerging: 'text-muted-foreground bg-muted',
  Building: 'text-civic-blue-800 bg-civic-blue-50',
  Strong: 'text-civic-teal-800 bg-civic-teal-50',
  Trusted: 'text-emerald-800 bg-emerald-50',
};

export function CivicStrengthsModule({ strengths }: CivicStrengthsModuleProps) {
  return (
    <section data-testid="civic-strengths" className="space-y-3">
      <div>
        <h2 className="font-display text-base font-bold">Your civic strengths</h2>
        <p className="text-xs text-muted-foreground">
          Where you contribute most — earned through verified impact
        </p>
      </div>

      <div className="space-y-2">
        {strengths.map((strength) => {
          const Icon = icons[strength.id];
          return (
            <div
              key={strength.id}
              data-testid={`civic-strength-${strength.id}`}
              className="rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-civic-blue-50 text-civic-blue-700">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{strength.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{strength.description}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                    strengthColors[strength.strengthLabel],
                  )}
                >
                  {strength.strengthLabel}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  {strength.current}/{strength.target}
                </span>
                <span className="font-semibold text-foreground">{strength.progressPercent}%</span>
              </div>
              <CivicProgressBar value={strength.progressPercent} variant="teal" size="sm" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
