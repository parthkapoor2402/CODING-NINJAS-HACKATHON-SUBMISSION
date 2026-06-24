import { LayoutList, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MapFeedView = 'map' | 'feed';

interface PremiumMapFeedToggleProps {
  value: MapFeedView;
  onChange: (value: MapFeedView) => void;
  mapPinCount?: number;
  feedCount?: number;
  className?: string;
}

export function PremiumMapFeedToggle({
  value,
  onChange,
  mapPinCount = 0,
  feedCount = 0,
  className,
}: PremiumMapFeedToggleProps) {
  return (
    <div
      data-testid="home-map-feed-toggle"
      className={cn(
        'relative flex rounded-2xl bg-gradient-to-r from-muted/80 to-muted p-1 shadow-inner',
        className,
      )}
      role="tablist"
      aria-label="Map or feed view"
    >
      <ToggleSegment
        active={value === 'map'}
        label="Map"
        icon={<Map className="h-4 w-4" />}
        badge={mapPinCount > 0 ? String(mapPinCount) : undefined}
        onClick={() => onChange('map')}
        testId="toggle-map"
      />
      <ToggleSegment
        active={value === 'feed'}
        label="Feed"
        icon={<LayoutList className="h-4 w-4" />}
        badge={feedCount > 0 ? String(feedCount) : undefined}
        onClick={() => onChange('feed')}
        testId="toggle-feed"
      />
    </div>
  );
}

function ToggleSegment({
  active,
  label,
  icon,
  badge,
  onClick,
  testId,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-testid={testId}
      onClick={onClick}
      className={cn(
        'relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300',
        active
          ? 'bg-card text-civic-blue-700 shadow-elevated ring-1 ring-civic-blue-100'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
      {badge ? (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
            active ? 'bg-civic-blue-100 text-civic-blue-700' : 'bg-muted-foreground/15',
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
