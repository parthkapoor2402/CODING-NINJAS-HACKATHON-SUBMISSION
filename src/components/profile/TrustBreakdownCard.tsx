import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import type { TrustMetric } from '@/domain/civic-identity';

interface TrustBreakdownCardProps {
  metrics: TrustMetric[];
}

export function TrustBreakdownCard({ metrics }: TrustBreakdownCardProps) {
  return (
    <section data-testid="trust-breakdown" className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-sm font-bold">Trust breakdown</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Transparent signals — not vanity metrics
      </p>

      <ul className="mt-4 space-y-4">
        {metrics.map((metric) => {
          const pct = Math.min(100, Math.round((metric.value / metric.max) * 100));
          return (
            <li key={metric.id} data-testid={`trust-metric-${metric.id}`}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="font-bold tabular-nums">{metric.value}</span>
              </div>
              <CivicProgressBar
                value={pct}
                variant={metric.id === 'trust' ? 'teal' : metric.id === 'contribution' ? 'default' : 'amber'}
                size="md"
                aria-label={metric.label}
              />
              <p className="mt-1 text-[10px] text-muted-foreground">{metric.hint}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
