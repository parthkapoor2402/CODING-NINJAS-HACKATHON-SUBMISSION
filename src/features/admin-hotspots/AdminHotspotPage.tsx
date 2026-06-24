import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageShell } from '@/components/layout/PageShell';
import { MapPreviewCard } from '@/components/cards/MapPreviewCard';
import { Chip } from '@/components/ui/chip';
import { Card, CardContent } from '@/components/ui/card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { LoadingState } from '@/components/states/LoadingState';
import { services } from '@/services/registry';
import type { WardHotspotInsight } from '@/types';
import { categoryLabel } from '@/utils/labels';
import { ROUTES } from '@/lib/constants';
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type HeatmapFilter = 'all' | 'water' | 'roads';

const trendIcon = {
  rising: TrendingUp,
  stable: Minus,
  cooling: TrendingDown,
};

export default function AdminHotspotPage() {
  const [filter, setFilter] = useState<HeatmapFilter>('all');
  const [hotspots, setHotspots] = useState<WardHotspotInsight[]>([]);
  const [pinCount, setPinCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      services.backend.admin.getHotspotInsights(filter),
      services.backend.admin.getOpenIssuePinCount(),
    ]).then(([insights, pins]) => {
      setHotspots(insights);
      setPinCount(pins);
      setLoading(false);
    });
  }, [filter]);

  return (
    <AdminPageShell
      title="Hotspot map"
      description="Ward-level clustering — where issues repeat and crews should stage."
    >
      <SegmentedControl
        options={[
          { value: 'all', label: 'All categories' },
          { value: 'water', label: 'Water' },
          { value: 'roads', label: 'Roads' },
        ]}
        value={filter}
        onChange={setFilter}
        fullWidth={false}
        className="max-w-md"
      />

      {loading ? (
        <LoadingState variant="cards" className="mt-4" />
      ) : (
        <>
          <MapPreviewCard
            data-testid="hotspot-map"
            pinCount={pinCount}
            label="City heatmap preview"
            wardName={`Filter: ${filter} · ${pinCount} open pins`}
            className="mt-4 min-h-[320px]"
            highlighted
          />

          <div data-testid="hotspot-trend-cards" className="mt-6 grid gap-4 md:grid-cols-3">
            {hotspots.map((h) => {
              const Icon = trendIcon[h.trend];
              return (
                <Card key={h.wardId} data-testid={`hotspot-trend-card-${h.wardId}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <MapPin className="h-5 w-5 text-civic-blue-600" />
                      <Chip variant={h.trend === 'rising' ? 'pending' : 'verified'}>{h.trend}</Chip>
                    </div>
                    <p className="mt-3 font-display font-bold">{h.wardLabel}</p>
                    <p className="text-2xl font-bold">{h.openIssues}</p>
                    <p className="text-xs text-muted-foreground">open issues</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Top: {categoryLabel(h.topCategory)} · {h.localityHint}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {h.changePct >= 0 ? '+' : ''}
                      {h.changePct}% vs baseline
                    </p>
                    <Link
                      to={ROUTES.admin.queue}
                      className="mt-3 inline-block text-xs font-semibold text-civic-blue-600 hover:underline"
                    >
                      Triage ward queue →
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
