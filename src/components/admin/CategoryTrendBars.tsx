import type { CategoryTrend } from '@/services/mock/seed/admin-analytics';
import { categoryLabel } from '@/utils/labels';
import { cn } from '@/lib/utils';

interface CategoryTrendBarsProps {
  trends: CategoryTrend[];
  className?: string;
}

export function CategoryTrendBars({ trends, className }: CategoryTrendBarsProps) {
  const max = Math.max(...trends.map((t) => t.count), 1);

  return (
    <div className={cn('space-y-4', className)}>
      {trends.map((trend) => (
        <div key={trend.category}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{categoryLabel(trend.category)}</span>
            <span className="text-muted-foreground">
              {trend.count} open ·{' '}
              <span className={trend.changePct >= 0 ? 'text-civic-coral-600' : 'text-civic-teal-600'}>
                {trend.changePct >= 0 ? '+' : ''}
                {trend.changePct}%
              </span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-civic-blue-600 transition-all"
              style={{ width: `${(trend.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
