import { useEffect, useState } from 'react';
import type { IssueUpdate } from '@/types';
import { services } from '@/services/registry';
import { formatRelativeDate } from '@/utils/format';
import { Megaphone, Shield, Users, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const kindMeta: Record<
  IssueUpdate['kind'],
  { icon: typeof Users; label: string; className: string }
> = {
  system: { icon: Megaphone, label: 'System', className: 'text-civic-blue-700 bg-civic-blue-50' },
  community: { icon: Users, label: 'Community', className: 'text-civic-teal-800 bg-civic-teal-50' },
  crew: { icon: Wrench, label: 'Crew', className: 'text-civic-amber-800 bg-civic-amber-50' },
  moderation: { icon: Shield, label: 'Review', className: 'text-civic-coral-700 bg-civic-coral-50/40' },
};

interface IssueUpdateThreadProps {
  reportId: string;
}

export function IssueUpdateThread({ reportId }: IssueUpdateThreadProps) {
  const [updates, setUpdates] = useState<IssueUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    services.issueUpdates.getForReport(reportId).then((data) => {
      setUpdates(data);
      setLoading(false);
    });
  }, [reportId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Loading official updates…
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        No public updates yet. You will see confirmations and crew actions here — not open comments.
      </div>
    );
  }

  return (
    <section className="space-y-3" aria-label="Official issue updates">
      <div>
        <h3 className="font-display text-sm font-semibold">Official updates</h3>
        <p className="text-xs text-muted-foreground">
          Curated progress notes — not a comment thread.
        </p>
      </div>
      <ol className="space-y-2">
        {updates.map((update) => {
          const meta = kindMeta[update.kind];
          const Icon = meta.icon;
          return (
            <li
              key={update.id}
              className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  meta.className,
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{meta.label}</span>
                  {update.actorLabel ? <span>· {update.actorLabel}</span> : null}
                  <span>· {formatRelativeDate(update.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-foreground">{update.message}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
