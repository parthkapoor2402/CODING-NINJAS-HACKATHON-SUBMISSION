import { useEffect, useState } from 'react';
import type { Report, ResolutionProof } from '@/types';
import { buildResolutionImpact } from '@/domain/track-journey';
import { ResolutionProofPlaceholder } from '@/components/issues/ResolutionProofPlaceholder';
import { services } from '@/services/registry';
import { Calendar, ShieldCheck, Users } from 'lucide-react';

interface ResolvedImpactCardProps {
  report: Report;
}

export function ResolvedImpactCard({ report }: ResolvedImpactCardProps) {
  const impact = buildResolutionImpact(report);
  const [proof, setProof] = useState<ResolutionProof | null>(null);

  useEffect(() => {
    services.backend.admin.getResolutionProof(report.id).then(setProof);
  }, [report.id]);

  return (
    <div data-testid="resolved-impact-card" className="space-y-3">
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          Civic outcome
        </p>
        <p className="mt-1 font-display text-base font-bold text-emerald-950">
          Resolved with verified transparency
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <ImpactStat
            icon={Calendar}
            label="Time to fix"
            value={impact.daysToResolve != null ? `${impact.daysToResolve}d` : '—'}
          />
          <ImpactStat
            icon={Users}
            label="Neighbors"
            value={String(impact.neighborConfirmations)}
          />
          <ImpactStat
            icon={ShieldCheck}
            label="Trust gain"
            value={`+${impact.trustGain}`}
          />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Routed through {impact.routingTeam}
          {proof?.notes ? ` · ${proof.notes}` : ''}
        </p>
      </div>

      <ResolutionProofPlaceholder report={report} />
    </div>
  );
}

function ImpactStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white/70 px-2 py-2 text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-emerald-600" aria-hidden />
      <p className="mt-1 font-display text-sm font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}
