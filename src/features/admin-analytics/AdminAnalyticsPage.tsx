import { useEffect, useState } from 'react';
import { AdminPageShell } from '@/components/layout/PageShell';
import { CategoryTrendBars } from '@/components/admin/CategoryTrendBars';
import { StatCard } from '@/components/cards/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/states/LoadingState';
import { services } from '@/services/registry';
import type {
  CategoryTrend,
  PredictiveInsight,
  ResponseTimeMetric,
  RewardAbuseFlag,
} from '@/services/mock/seed/admin-analytics';
import { TrendingUp, Users, Timer, ShieldAlert } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [responseMetrics, setResponseMetrics] = useState<ResponseTimeMetric[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([]);
  const [abuseFlags, setAbuseFlags] = useState<RewardAbuseFlag[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [duplicateRate, setDuplicateRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      services.backend.admin.getResponseTimeMetrics(),
      services.backend.admin.getCategoryTrends(),
      services.backend.admin.getRewardAbuseFlags(),
      services.backend.admin.getPredictiveInsights(),
      services.backend.admin.getDuplicateRedirectRate(),
    ]).then(([response, categories, flags, predictive, dupRate]) => {
      setResponseMetrics(response);
      setCategoryTrends(categories);
      setAbuseFlags(flags);
      setInsights(predictive);
      setDuplicateRate(dupRate);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <AdminPageShell title="Analytics" description="Loading metrics…">
        <LoadingState variant="cards" />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Analytics"
      description="Efficiency and accountability metrics — every card ties to civic outcomes."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="VIPR (30d)"
          value={28}
          trend="up"
          trendLabel="Verified issues per 1k residents"
          accent="teal"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Median resolution"
          value={responseMetrics.find((m) => m.label.includes('resolution'))?.value ?? '4.2d'}
          accent="blue"
          icon={<Timer className="h-4 w-4" />}
        />
        <StatCard
          label="Active contributors"
          value={156}
          trend="up"
          trendLabel="Transparency: engaged neighbors"
          accent="blue"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Duplicate redirect rate"
          value={`${duplicateRate}%`}
          trend="up"
          trendLabel="Efficiency: fewer duplicate tickets"
          accent="teal"
        />
      </div>

      <section data-testid="response-time-metrics" className="mt-6">
        <h2 className="mb-1 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Response time trends
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Accountability SLAs — verify and resolve faster than prior period.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {responseMetrics.map((metric) => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
              trendLabel={metric.trendLabel}
              accent="teal"
            />
          ))}
        </div>
      </section>

      <section data-testid="category-trend-chart" className="mt-6">
        <h2 className="mb-1 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Category trends
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Where demand is rising — crew staging and budget transparency.
        </p>
        <Card>
          <CardContent className="p-5">
            <CategoryTrendBars trends={categoryTrends} />
          </CardContent>
        </Card>
      </section>

      <section data-testid="reward-abuse-flags" className="mt-6">
        <h2 className="mb-1 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Reward abuse flags
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Farming patterns held from payout until moderation clears — protects program integrity.
        </p>
        <div className="space-y-3">
          {abuseFlags.map((flag) => (
            <Card key={flag.id} className={flag.severity === 'high' ? 'border-civic-coral-300' : ''}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4 text-civic-coral-600" />
                  <div>
                    <p className="font-semibold">{flag.displayName}</p>
                    <p className="text-sm text-muted-foreground">{flag.reason}</p>
                  </div>
                </div>
                <span className="text-xs font-medium capitalize text-civic-coral-600">{flag.severity}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section data-testid="predictive-insights-cards" className="mt-6">
        <h2 className="mb-1 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Predictive insights
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Proactive crew positioning — efficiency before issues spike.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{insight.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{insight.summary}</p>
                <p className="mt-2 text-xs font-medium text-civic-teal-600">
                  {insight.confidence}% confidence · prep crews early
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AdminPageShell>
  );
}
