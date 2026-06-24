import { useEffect, useState } from 'react';
import type { IssueUpdate } from '@/types';
import { services } from '@/services/registry';
import { formatRelativeDate } from '@/utils/format';
import { narrativeUpdateLead } from '@/domain/track-journey';
import { Megaphone, Shield, Users, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const kindMeta: Record<
  IssueUpdate['kind'],
  { icon: typeof Users; label: string; className: string; accent: string }
> = {
  system: {
    icon: Megaphone,
    label: 'Official',
    className: 'text-civic-blue-700 bg-civic-blue-50',
    accent: 'border-civic-blue-200',
  },
  community: {
    icon: Users,
    label: 'Community',
    className: 'text-civic-teal-800 bg-civic-teal-50',
    accent: 'border-civic-teal-200',
  },
  crew: {
    icon: Wrench,
    label: 'Crew',
    className: 'text-civic-amber-800 bg-civic-amber-50',
    accent: 'border-civic-amber-200',
  },
  moderation: {
    icon: Shield,
    label: 'Review',
    className: 'text-civic-coral-700 bg-civic-coral-50/40',
    accent: 'border-civic-coral-200',
  },
};

interface IssueUpdateThreadProps {
  reportId: string;
  variant?: 'default' | 'narrative';
  limit?: number;
}

export function IssueUpdateThread({
  reportId,
  variant = 'default',
  limit,
}: IssueUpdateThreadProps) {
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
      <div
        data-testid="issue-update-thread-empty"
        className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground"
      >
        No public updates yet. Confirmations and crew actions will appear here — curated for
        transparency, not open comments.
      </div>
    );
  }

  const visible =
    limit != null && variant === 'narrative' ? updates.slice(-limit) : updates;
  const chronological = variant === 'narrative' ? visible : updates;

  if (variant === 'narrative') {
    return (
      <section
        data-testid="issue-update-narrative"
        className="space-y-3"
        aria-label="Official activity narrative"
      >
        <div>
          <h3 className="font-display text-sm font-semibold">Official activity</h3>
          <p className="text-xs text-muted-foreground">
            A transparent record of how your report moved through the system
          </p>
        </div>

        <ol className="relative space-y-0 pl-1">
          {chronological.map((update, index) => {
            const meta = kindMeta[update.kind];
            const Icon = meta.icon;
            const lead = narrativeUpdateLead(update, index, chronological.length);
            const isLast = index === chronological.length - 1;

            return (
              <li key={update.id} className="relative flex gap-3 pb-4 last:pb-0">
                {!isLast ? (
                  <div
                    className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-border"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                    meta.className,
                    meta.accent,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                    <span className="font-semibold uppercase tracking-wide text-foreground/80">
                      {lead}
                    </span>
                    <span>· {meta.label}</span>
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
