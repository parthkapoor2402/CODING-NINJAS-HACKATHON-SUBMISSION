import type { ReactNode } from 'react';
import { CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';

interface CivicPulseStripProps {
  openNearby: number;
  awaitingVerification: number;
  resolvedThisWeek: number;
}

export function CivicPulseStrip({
  openNearby,
  awaitingVerification,
  resolvedThisWeek,
}: CivicPulseStripProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2 rounded-xl border border-civic-blue-100 bg-gradient-to-br from-civic-blue-50/80 to-white p-3"
      data-testid="civic-pulse-strip"
    >
      <PulseCell
        icon={<MapPin className="h-3.5 w-3.5 text-civic-blue-600" />}
        value={openNearby}
        label="Open nearby"
      />
      <PulseCell
        icon={<ShieldCheck className="h-3.5 w-3.5 text-civic-teal-600" />}
        value={awaitingVerification}
        label="Need confirmation"
      />
      <PulseCell
        icon={<CheckCircle2 className="h-3.5 w-3.5 text-civic-teal-600" />}
        value={resolvedThisWeek}
        label="Resolved this week"
      />
    </div>
  );
}

function PulseCell({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        {icon}
        <span className="font-display text-lg font-bold tabular-nums text-foreground">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] font-medium leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}
