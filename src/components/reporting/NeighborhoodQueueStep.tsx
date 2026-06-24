import { QUEUE_STEPS } from '@/domain/report-success';
import { Check, MapPin, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const stepIcons = {
  submitted: Check,
  queue: MapPin,
  verify: Users,
  route: Building2,
};

export function NeighborhoodQueueStep() {
  return (
    <div
      data-testid="neighborhood-queue-step"
      className="rounded-xl border border-civic-teal-100 bg-gradient-to-br from-civic-blue-50/80 via-white to-civic-teal-50/60 p-4"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-civic-blue-700">
        Your ward journey
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">Report entered neighborhood queue</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        Step 2 of 4 — community proof comes before crew routing
      </p>

      <div className="mt-4 flex items-start justify-between gap-1">
        {QUEUE_STEPS.map((step, index) => {
          const Icon = stepIcons[step.id as keyof typeof stepIcons];
          const isComplete = step.status === 'complete';
          const isActive = step.status === 'active';
          const isUpcoming = step.status === 'upcoming';

          return (
            <div key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    index === 0 ? 'opacity-0' : isComplete || isActive ? 'bg-civic-teal-400' : 'bg-muted',
                  )}
                />
                <div
                  className={cn(
                    'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm transition-all',
                    isComplete && 'bg-civic-teal-600 text-white',
                    isActive && 'bg-civic-blue-600 text-white ring-4 ring-civic-blue-100 animate-pulse-soft',
                    isUpcoming && 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {isActive ? (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-civic-amber-400 ring-2 ring-white" />
                  ) : null}
                </div>
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    index === QUEUE_STEPS.length - 1 ? 'opacity-0' : isComplete ? 'bg-civic-teal-400' : 'bg-muted',
                  )}
                />
              </div>
              <p
                className={cn(
                  'text-center text-[9px] font-semibold leading-tight',
                  isActive ? 'text-civic-blue-800' : isComplete ? 'text-civic-teal-800' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
