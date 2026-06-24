import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon?: React.ReactNode;
  accent?: 'blue' | 'teal' | 'amber' | 'coral';
  className?: string;
}

const accentMap = {
  blue: 'border-l-civic-blue-600 bg-civic-blue-50/30',
  teal: 'border-l-civic-teal-500 bg-civic-teal-50/30',
  amber: 'border-l-civic-amber-500 bg-civic-amber-50/30',
  coral: 'border-l-civic-coral-500 bg-civic-coral-50/30',
};

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  accent = 'blue',
  className,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        'rounded-card border border-border border-l-4 bg-card p-5 shadow-card',
        accentMap[accent],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
      {trend && trendLabel ? (
        <p
          className={cn(
            'mt-2 flex items-center gap-1 text-xs font-medium',
            trend === 'up' && 'text-civic-teal-600',
            trend === 'down' && 'text-civic-coral-500',
            trend === 'neutral' && 'text-muted-foreground',
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {trendLabel}
        </p>
      ) : null}
    </div>
  );
}
