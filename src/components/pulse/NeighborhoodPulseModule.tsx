import { Activity, CheckCircle2, Gauge, Sparkles, Users } from 'lucide-react';
import type { NeighborhoodPulseMetrics, PulseMicrocopy } from '@/domain/neighborhood-pulse';
import { cn } from '@/lib/utils';

export type PulseModuleVariant = 'full' | 'compact';

interface NeighborhoodPulseModuleProps {
  metrics: NeighborhoodPulseMetrics;
  microcopy: PulseMicrocopy;
  variant?: PulseModuleVariant;
  className?: string;
}

const metricConfig = [
  {
    key: 'confirmed' as const,
    label: 'Confirmed today',
    icon: CheckCircle2,
    accent: 'text-civic-teal-700 bg-civic-teal-50 border-civic-teal-200',
    testId: 'pulse-confirmed-today',
    getValue: (m: NeighborhoodPulseMetrics) => m.issuesConfirmedToday,
  },
  {
    key: 'residents' as const,
    label: 'Active this week',
    icon: Users,
    accent: 'text-civic-blue-800 bg-civic-blue-50 border-civic-blue-200',
    testId: 'pulse-active-residents',
    getValue: (m: NeighborhoodPulseMetrics) => m.activeResidentsThisWeek,
  },
  {
    key: 'responsive' as const,
    label: 'Ward responsiveness',
    icon: Gauge,
    accent: 'text-civic-amber-900 bg-civic-amber-50 border-civic-amber-200',
    testId: 'pulse-ward-responsiveness',
    getValue: (m: NeighborhoodPulseMetrics) => `${m.wardResponsivenessPercent}%`,
  },
  {
    key: 'momentum' as const,
    label: 'Challenge momentum',
    icon: Activity,
    accent: 'text-violet-800 bg-violet-50 border-violet-200',
    testId: 'pulse-challenge-momentum',
    getValue: (m: NeighborhoodPulseMetrics) => m.challengeProgressPercent,
    suffix: '%',
    sub: (m: NeighborhoodPulseMetrics) => m.challengeMomentumLabel,
  },
];

export function NeighborhoodPulseModule({
  metrics,
  microcopy,
  variant = 'full',
  className,
}: NeighborhoodPulseModuleProps) {
  const compact = variant === 'compact';
  const visibleMetrics = compact ? metricConfig.slice(0, 2) : metricConfig;

  return (
    <section
      data-testid="neighborhood-pulse"
      className={cn(
        'overflow-hidden rounded-card border border-civic-teal-200/80 bg-gradient-to-br from-civic-teal-50/70 via-white to-civic-blue-50/50 shadow-card',
        className,
      )}
    >
      <div className={cn('border-b border-civic-teal-100/80 px-3.5 py-3 sm:px-4', compact && 'py-2.5')}>
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-civic-teal-600 to-civic-blue-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-civic-teal-700">
              Neighborhood pulse · {metrics.wardLabel}
            </p>
            <p className="mt-0.5 font-display text-sm font-bold leading-snug text-foreground sm:text-base">
              {microcopy.headline}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{microcopy.subline}</p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'grid gap-2 p-3 sm:p-3.5',
          compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4',
        )}
      >
        {visibleMetrics.map((item) => {
          const Icon = item.icon;
          const raw = item.getValue(metrics);
          const display =
            item.key === 'momentum'
              ? `${raw}${item.suffix ?? ''}`
              : String(raw);

          return (
            <div
              key={item.key}
              data-testid={item.testId}
              className={cn(
                'rounded-xl border px-2.5 py-2 sm:px-3 sm:py-2.5',
                item.accent,
              )}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                <p className="text-[9px] font-bold uppercase tracking-wide opacity-90">{item.label}</p>
              </div>
              <p className="mt-1 font-display text-lg font-bold tabular-nums leading-none sm:text-xl">
                {display}
              </p>
              {item.sub ? (
                <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-tight opacity-90">
                  {item.sub(metrics)}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {compact ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-civic-teal-100/60 bg-muted/20 px-3.5 py-2 text-[10px] text-muted-foreground sm:px-4">
          <span>{metrics.freshnessLabel}</span>
          <span className="font-semibold text-civic-teal-800">
            {metrics.wardResponsivenessPercent}% responsive · {metrics.challengeMomentumLabel}
          </span>
        </div>
      ) : (
        <p className="border-t border-civic-teal-100/60 bg-muted/15 px-3.5 py-2 text-[10px] text-muted-foreground sm:px-4">
          {metrics.freshnessLabel} — curated summaries, not a live notification feed.
        </p>
      )}
    </section>
  );
}
