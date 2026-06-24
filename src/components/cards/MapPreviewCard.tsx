import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';

interface MapPreviewCardProps {
  label?: string;
  pinCount?: number;
  wardName?: string;
  className?: string;
  onExpand?: () => void;
  highlighted?: boolean;
  'data-testid'?: string;
}

export function MapPreviewCard({
  label = 'Your neighborhood',
  pinCount = 0,
  wardName,
  className,
  onExpand,
  highlighted = false,
  'data-testid': testId,
}: MapPreviewCardProps) {
  return (
    <div
      data-testid={testId}
      className={cn(
        'relative overflow-hidden rounded-card border shadow-card transition-shadow hover:shadow-elevated',
        highlighted ? 'border-civic-blue-200 ring-2 ring-civic-blue-100' : 'border-border',
        className,
      )}
    >
      <div className="gradient-civic-subtle relative min-h-[180px]">
        {/* Stylized map grid */}
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1565C0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative pins */}
        <div className="absolute left-[25%] top-[35%] h-3 w-3 rounded-full bg-civic-amber-500 shadow-sm" />
        <div className="absolute left-[55%] top-[50%] h-3 w-3 rounded-full bg-civic-teal-500 shadow-sm" />
        <div className="absolute left-[70%] top-[28%] h-3 w-3 rounded-full bg-civic-coral-500 shadow-sm" />
        <div className="absolute left-[40%] top-[60%] flex h-5 w-5 items-center justify-center rounded-full bg-civic-blue-600 shadow-fab ring-4 ring-white">
          <Navigation className="h-2.5 w-2.5 text-white" fill="white" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent p-4 pt-8">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-civic-blue-700">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              {wardName ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{wardName}</p>
              ) : null}
            </div>
            {pinCount > 0 ? (
              <Chip variant="default">{pinCount} open nearby</Chip>
            ) : null}
          </div>
        </div>
      </div>

      {onExpand ? (
        <div className="border-t bg-card p-3">
          <Button variant="soft" className="w-full" size="sm" onClick={onExpand}>
            View full map
          </Button>
        </div>
      ) : null}
    </div>
  );
}
