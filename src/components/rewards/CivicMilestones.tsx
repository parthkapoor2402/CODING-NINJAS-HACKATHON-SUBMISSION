import { buildMilestones, type MilestoneInput } from '@/domain/civic-milestones';
import { CheckCircle2, Circle } from 'lucide-react';

interface CivicMilestonesProps {
  input: MilestoneInput;
}

export function CivicMilestones({ input }: CivicMilestonesProps) {
  const milestones = buildMilestones(input);

  return (
    <section data-testid="civic-milestones">
      <h2 className="mb-3 font-display text-sm font-bold">Civic milestones</h2>
      <ul className="space-y-2">
        {milestones.map((m) => (
          <li
            key={m.id}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-sm"
          >
            {m.achieved ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-civic-teal-600" aria-hidden />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <div>
              <p className="font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {Math.min(m.current, m.target)} / {m.target}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
