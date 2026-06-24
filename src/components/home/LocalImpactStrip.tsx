import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardList, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { HomeImpactMetrics } from '@/domain/home-missions';

interface LocalImpactStripProps extends HomeImpactMetrics {
  className?: string;
}

const cellThemes = {
  open: {
    icon: 'text-civic-blue-700',
    bg: 'bg-civic-blue-50 hover:bg-civic-blue-100/80',
    ring: 'ring-civic-blue-200',
    value: 'text-civic-blue-900',
  },
  review: {
    icon: 'text-civic-amber-700',
    bg: 'bg-civic-amber-50 hover:bg-civic-amber-100/80',
    ring: 'ring-civic-amber-200',
    value: 'text-civic-amber-900',
  },
  resolved: {
    icon: 'text-civic-teal-700',
    bg: 'bg-civic-teal-50 hover:bg-civic-teal-100/80',
    ring: 'ring-civic-teal-200',
    value: 'text-civic-teal-900',
  },
  impact: {
    icon: 'text-white',
    bg: 'bg-gradient-to-br from-civic-blue-600 to-civic-teal-600 hover:from-civic-blue-700 hover:to-civic-teal-700',
    ring: 'ring-civic-teal-300',
    value: 'text-white',
  },
} as const;

export function LocalImpactStrip({
  openNearby,
  underReview,
  resolvedThisWeek,
  yourVerifiedImpact,
  className,
}: LocalImpactStripProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-1.5 rounded-xl border border-civic-blue-200/80 bg-card p-1.5 sm:grid-cols-4 sm:gap-2 sm:p-2',
        className,
      )}
      data-testid="local-impact-strip"
    >
      <ImpactCell
        theme={cellThemes.open}
        icon={<MapPin className={cn('h-3.5 w-3.5', cellThemes.open.icon)} />}
        value={openNearby}
        label="Open nearby"
        onClick={() => navigate(ROUTES.nearby)}
        testId="impact-open-nearby"
      />
      <ImpactCell
        theme={cellThemes.review}
        icon={<ClipboardList className={cn('h-3.5 w-3.5', cellThemes.review.icon)} />}
        value={underReview}
        label="Under review"
        onClick={() => navigate(ROUTES.community)}
        testId="impact-under-review"
      />
      <ImpactCell
        theme={cellThemes.resolved}
        icon={<CheckCircle2 className={cn('h-3.5 w-3.5', cellThemes.resolved.icon)} />}
        value={resolvedThisWeek}
        label="Resolved this week"
        onClick={() => navigate(`${ROUTES.track}?filter=resolved`)}
        testId="impact-resolved-week"
      />
      <ImpactCell
        theme={cellThemes.impact}
        icon={<Sparkles className={cn('h-3.5 w-3.5', cellThemes.impact.icon)} />}
        value={yourVerifiedImpact}
        label="Your verified impact"
        onClick={() => navigate(ROUTES.rewards)}
        testId="impact-verified-impact"
        highlight
      />
    </div>
  );
}

function ImpactCell({
  theme,
  icon,
  value,
  label,
  onClick,
  testId,
  highlight,
}: {
  theme: (typeof cellThemes)[keyof typeof cellThemes];
  icon: ReactNode;
  value: number;
  label: string;
  onClick: () => void;
  testId: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={cn(
        'touch-target rounded-lg px-2 py-2 text-center transition-all duration-200 active:scale-[0.97] sm:py-2.5',
        theme.bg,
        highlight && cn('shadow-sm ring-1', theme.ring),
      )}
    >
      <div className="flex items-center justify-center gap-1">
        {icon}
        <span className={cn('font-display text-lg font-bold tabular-nums', theme.value)}>
          {value}
        </span>
      </div>
      <p
        className={cn(
          'mt-0.5 text-[10px] font-semibold leading-tight',
          highlight ? 'text-white/90' : 'text-muted-foreground',
        )}
      >
        {label}
      </p>
    </button>
  );
}
