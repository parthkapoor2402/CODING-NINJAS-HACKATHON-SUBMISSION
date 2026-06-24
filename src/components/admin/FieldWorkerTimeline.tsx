import { cn } from '@/lib/utils';
import type { FieldWorkerUpdate } from '@/types';
import { HardHat, FileText, Camera } from 'lucide-react';

const kindIcon = {
  status: HardHat,
  note: FileText,
  proof_submitted: Camera,
};

interface FieldWorkerTimelineProps {
  updates: FieldWorkerUpdate[];
  className?: string;
}

export function FieldWorkerTimeline({ updates, className }: FieldWorkerTimelineProps) {
  if (updates.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No field updates yet — assign a crew to start the work order.
      </p>
    );
  }

  return (
    <ol className={cn('space-y-3', className)} data-testid="field-worker-timeline">
      {updates.map((update) => {
        const Icon = kindIcon[update.kind];
        return (
          <li key={update.id} className="flex gap-3 rounded-lg border bg-muted/30 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-civic-blue-50 text-civic-blue-700">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-relaxed">{update.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(update.createdAt).toLocaleString()} · {update.workerId}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
