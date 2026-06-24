import type { Report } from '@/types';
import { getTimelineStepIndex, TIMELINE_STEPS } from '@/lib/issue-timeline';
import { cn } from '@/lib/utils';

interface IssueTimelineProps {
  report: Pick<Report, 'status' | 'assignedWorkerId' | 'reopenedAt'>;
  compact?: boolean;
  className?: string;
}

export function IssueTimeline({ report, compact = false, className }: IssueTimelineProps) {
  const current = getTimelineStepIndex(report);

  if (compact) {
    return (
      <div className={cn('mt-4', className)} data-testid="issue-timeline">
        <div className="flex items-center gap-1">
          {TIMELINE_STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  'h-1.5 w-full rounded-full',
                  i <= current ? 'bg-civic-teal-500' : 'bg-muted',
                )}
              />
              <span className="text-[10px] text-muted-foreground">
                {i === current ? label : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)} data-testid="issue-timeline">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
      <ol className="space-y-2">
        {TIMELINE_STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                  done && 'bg-civic-teal-500 text-white',
                  active && 'border-2 border-civic-teal-500 bg-civic-teal-50 text-civic-teal-800',
                  !done && !active && 'border border-muted bg-muted/40 text-muted-foreground',
                )}
                aria-hidden
              >
                {done ? '✓' : i + 1}
              </span>
              <div>
                <p
                  className={cn(
                    'text-sm font-medium',
                    active ? 'text-foreground' : done ? 'text-civic-teal-800' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </p>
                {active ? (
                  <p className="text-xs text-muted-foreground">Current step</p>
                ) : null}
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
