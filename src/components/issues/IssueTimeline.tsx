import type { Report } from '@/types';
import {
  getStateExplainer,
  getTimelineStepIndex,
  STEP_VISUAL,
  TIMELINE_STEPS,
} from '@/lib/issue-timeline';
import { currentTimelineStep } from '@/domain/track-journey';
import { cn } from '@/lib/utils';

interface IssueTimelineProps {
  report: Pick<Report, 'status' | 'assignedWorkerId' | 'reopenedAt'>;
  compact?: boolean;
  className?: string;
}

export function IssueTimeline({ report, compact = false, className }: IssueTimelineProps) {
  const current = getTimelineStepIndex(report);
  const activeLabel = currentTimelineStep(report);
  const activeVisual = STEP_VISUAL[activeLabel];

  if (compact) {
    return (
      <div
        className={cn('rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2.5', className)}
        data-testid="issue-timeline"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Progress
          </p>
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[9px] font-bold',
              activeVisual.compact,
            )}
          >
            {activeLabel}
          </span>
        </div>

        <div className="flex items-stretch gap-0.5">
          {TIMELINE_STEPS.map((label, i) => {
            const visual = STEP_VISUAL[label];
            const done = i < current;
            const active = i === current;
            const upcoming = i > current;

            return (
              <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex h-7 w-full items-center">
                  <div
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      i === 0 ? 'opacity-0' : done || active ? visual.line : 'bg-muted',
                    )}
                  />
                  <div
                    className={cn(
                      'relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm transition-all',
                      done && cn('h-3.5 w-3.5', visual.dot),
                      active && cn(visual.dot, 'h-4 w-4 ring-2 ring-offset-1', visual.ring),
                      upcoming && 'h-2.5 w-2.5 bg-muted',
                    )}
                    aria-hidden
                  />
                  <div
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      i === TIMELINE_STEPS.length - 1 ? 'opacity-0' : done ? visual.line : 'bg-muted',
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{getStateExplainer(report)}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)} data-testid="issue-timeline">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Resolution journey
        </p>
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-sm',
            activeVisual.compact,
          )}
        >
          {activeLabel}
        </span>
      </div>

      <ol className="relative space-y-0 rounded-xl border border-border/80 bg-gradient-to-b from-muted/30 to-card p-2">
        {TIMELINE_STEPS.map((label, i) => {
          const visual = STEP_VISUAL[label];
          const done = i < current;
          const active = i === current;
          const upcoming = i > current;
          const isLast = i === TIMELINE_STEPS.length - 1;

          return (
            <li key={label} className="relative flex gap-3 pb-3 last:pb-0 sm:pb-4">
              {!isLast ? (
                <div
                  className={cn(
                    'absolute left-[11px] top-6 h-[calc(100%-6px)] w-1 rounded-full',
                    done ? visual.line : 'bg-muted',
                  )}
                  aria-hidden
                />
              ) : null}

              <div className="relative z-10 flex flex-col items-center">
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-all',
                    done && cn('h-6 w-6 text-[10px] font-bold text-white', visual.dot),
                    active && cn('h-7 w-7 ring-2 ring-offset-2', visual.dot, visual.ring),
                    upcoming && 'h-5 w-5 border border-muted bg-muted/50',
                  )}
                  aria-hidden
                >
                  {done ? '✓' : null}
                </span>
              </div>

              <div
                className={cn(
                  'min-w-0 flex-1 rounded-xl border px-3 py-2 transition-colors sm:py-2.5',
                  active && cn('border-2 shadow-sm', visual.compact),
                  done && !active && 'border-border/50 bg-white/60',
                  upcoming && 'border-transparent opacity-55',
                )}
              >
                <p
                  className={cn(
                    'text-sm font-semibold',
                    active ? visual.label : done ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </p>
                {active ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {getStateExplainer(report)}
                  </p>
                ) : done ? (
                  <p className="mt-0.5 text-[10px] font-medium text-civic-teal-700">Completed</p>
                ) : (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Upcoming</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** @deprecated Use IssueTimeline with report prop */
export function IssueTimelineFromStatus({
  status,
}: {
  status: Report['status'];
}) {
  return <IssueTimeline report={{ status }} compact />;
}
