import { Link } from 'react-router-dom';
import { Megaphone, Users, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { NeighborhoodActivity } from '@/domain/home-missions';

const kindIcon = {
  community: Users,
  crew: Wrench,
  system: Megaphone,
};

const kindStyle = {
  community: 'text-civic-teal-600 bg-civic-teal-50',
  crew: 'text-civic-amber-700 bg-civic-amber-50',
  system: 'text-civic-blue-600 bg-civic-blue-50',
};

interface NeighborhoodActivityStripProps {
  items: NeighborhoodActivity[];
  className?: string;
}

export function NeighborhoodActivityStrip({ items, className }: NeighborhoodActivityStripProps) {
  if (items.length === 0) return null;

  return (
    <section data-testid="neighborhood-activity" className={cn('space-y-2', className)}>
      <h2 className="font-display text-sm font-bold text-foreground">Happening nearby</h2>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const Icon = kindIcon[item.kind];
          const content = (
            <div
              className={cn(
                'flex items-start gap-2.5 rounded-lg border border-border/60 bg-card/80 px-3 py-2.5 transition-colors',
                item.reportId && 'hover:border-civic-blue-200 hover:bg-civic-blue-50/30',
                'animate-slide-up',
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  kindStyle[item.kind],
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed text-foreground">{item.message}</p>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{item.timeLabel}</p>
              </div>
            </div>
          );

          if (item.reportId) {
            return (
              <Link key={item.id} to={ROUTES.issueDetail(item.reportId)} className="block">
                {content}
              </Link>
            );
          }
          return <div key={item.id}>{content}</div>;
        })}
      </div>
    </section>
  );
}
