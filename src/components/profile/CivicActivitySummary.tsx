import { Link } from 'react-router-dom';
import type { ActivitySummaryItem } from '@/domain/civic-identity';
import { ROUTES } from '@/lib/constants';
import { formatRelativeDate } from '@/utils/format';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface CivicActivitySummaryProps {
  items: ActivitySummaryItem[];
}

export function CivicActivitySummary({ items }: CivicActivitySummaryProps) {
  return (
    <section data-testid="civic-activity-summary" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-civic-blue-600" aria-hidden />
          <h2 className="font-display text-sm font-bold">Recent civic activity</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
          <Link to={ROUTES.rewards}>View all</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          No verified activity yet. Report or confirm a real issue to start building your civic
          record.
        </div>
      ) : (
        <ol className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              data-testid={`activity-item-${item.id}`}
              className="rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {formatRelativeDate(item.when)}
                  </p>
                </div>
                <Chip variant={item.verified ? 'verified' : 'pending'} className="shrink-0 text-[10px]">
                  {item.verified ? 'Verified' : 'Pending'}
                </Chip>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
