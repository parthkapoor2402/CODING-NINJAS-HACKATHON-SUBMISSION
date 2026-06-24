import { Link } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { categoryColors } from '@/lib/design-tokens';
import { categoryLabel } from '@/utils/labels';
import type { Report } from '@/types';

interface NeighborhoodMapViewProps {
  reports: Report[];
  wardName?: string;
  className?: string;
}

const PIN_POSITIONS = [
  { left: '22%', top: '32%' },
  { left: '48%', top: '48%' },
  { left: '68%', top: '26%' },
  { left: '38%', top: '62%' },
  { left: '58%', top: '68%' },
];

export function NeighborhoodMapView({
  reports,
  wardName = 'Ward 12 · MG Road area',
  className,
}: NeighborhoodMapViewProps) {
  const pins = reports.slice(0, 5);

  return (
    <div
      data-testid="neighborhood-map-view"
      className={cn(
        'relative overflow-hidden rounded-card border border-civic-blue-100 shadow-elevated',
        className,
      )}
    >
      <div className="gradient-civic-subtle relative min-h-[200px]">
        <div className="absolute inset-0 opacity-25">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <pattern id="home-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1565C0" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#home-grid)" />
          </svg>
        </div>

        <div className="absolute left-[46%] top-[52%] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-civic-blue-600 shadow-fab ring-4 ring-white">
          <Navigation className="h-3 w-3 text-white" fill="white" aria-hidden />
        </div>

        {pins.map((report, i) => {
          const pos = PIN_POSITIONS[i % PIN_POSITIONS.length];
          const color = categoryColors[report.category] ?? categoryColors.other;
          const urgent = report.severity === 'high' || report.status === 'pending_verification';
          return (
            <Link
              key={report.id}
              to={ROUTES.issueDetail(report.id)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{ left: pos.left, top: pos.top }}
              aria-label={`${categoryLabel(report.category)} issue`}
            >
              <span
                className={cn(
                  'block h-3.5 w-3.5 rounded-full border-2 border-white shadow-md',
                  urgent && 'ring-2 ring-civic-amber-400/80',
                )}
                style={{ backgroundColor: color }}
              />
            </Link>
          );
        })}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent p-4 pt-10">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-civic-blue-700">
                <MapPin className="h-4 w-4" aria-hidden />
                <span className="text-sm font-semibold">Live neighborhood map</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{wardName}</p>
            </div>
            <span className="rounded-full bg-civic-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
              {pins.length} active pin{pins.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
