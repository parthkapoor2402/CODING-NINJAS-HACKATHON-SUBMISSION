import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  Copy,
  MapPin,
  ShieldCheck,
  Users,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { StatusBadge } from '@/components/StatusBadge';
import { categoryColors } from '@/lib/design-tokens';
import { categoryLabel } from '@/utils/labels';
import type { VerifyOpportunity } from '@/domain/verify-queue';

interface VerifyOpportunityCardProps {
  opportunity: VerifyOpportunity;
  mediaUrl?: string;
  detailHref: string;
  confirming?: boolean;
  completed?: boolean;
  onConfirm: () => void;
  onNotEnoughEvidence: () => void;
  onPossiblyDuplicate: () => void;
}

export function VerifyOpportunityCard({
  opportunity,
  mediaUrl,
  detailHref,
  confirming,
  completed,
  onConfirm,
  onNotEnoughEvidence,
  onPossiblyDuplicate,
}: VerifyOpportunityCardProps) {
  const { report, distanceKm, confirmationsNeeded, unlocksEscalation, daysOpen, socialProofLabel, nearYouLabel, confirmationsLabel, impactMessage } =
    opportunity;
  const catColor = categoryColors[report.category] ?? categoryColors.other;

  return (
    <article
      data-testid={`verify-opportunity-${report.id}`}
      className={cn(
        'overflow-hidden rounded-card border bg-card shadow-card transition-all duration-300',
        unlocksEscalation && confirmationsNeeded === 1
          ? 'border-civic-amber-200 ring-1 ring-civic-amber-100'
          : 'border-border',
        completed && 'ring-2 ring-civic-teal-400 animate-scale-in',
        confirming && 'opacity-90',
      )}
    >
      {completed ? (
        <div
          className="flex items-center gap-2 border-b border-civic-teal-200 bg-gradient-to-r from-civic-teal-50 to-civic-teal-100/50 px-4 py-2.5"
          data-testid="verify-delight-banner"
        >
          <ShieldCheck className="h-4 w-4 text-civic-teal-700" aria-hidden />
          <p className="text-xs font-bold text-civic-teal-900">
            Neighborhood signal strengthened — thank you for verifying honestly.
          </p>
        </div>
      ) : null}
      <div className="relative aspect-[16/9] bg-muted">
        {mediaUrl ? (
          <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: `${catColor}22` }}
          >
            <span className="font-display text-2xl font-bold" style={{ color: catColor }}>
              {categoryLabel(report.category)}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Chip variant="category" style={{ backgroundColor: catColor }}>
            {categoryLabel(report.category)}
          </Chip>
          {report.severity === 'high' ? (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-civic-amber-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              <AlertCircle className="h-3 w-3" aria-hidden />
              Urgent
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 top-3">
          <Chip variant="outline" className="bg-white/95 font-semibold backdrop-blur-sm">
            {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`}
          </Chip>
        </div>
        {unlocksEscalation && confirmationsNeeded === 1 ? (
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-lg bg-civic-blue-600/95 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Your confirm helps unlock crew review
            </span>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-civic-teal-100 px-2 py-0.5 font-semibold text-civic-teal-800">
            {nearYouLabel}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
            {confirmationsLabel}
          </span>
        </div>
        <p className="line-clamp-2 text-sm font-medium leading-snug">{report.description}</p>
        <p className="text-xs text-civic-teal-800/90">{impactMessage}</p>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-civic-teal-700">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {report.corroborationCount} confirmed
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {daysOpen === 0 ? 'Opened today' : `${daysOpen}d open`}
          </span>
          {report.location.address ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {report.location.address}
            </span>
          ) : null}
        </div>

        <p className="rounded-lg bg-muted/60 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
          {socialProofLabel}
        </p>

        <div className="flex flex-col gap-2">
          <Button
            variant="teal"
            size="sm"
            className="w-full"
            data-testid="verify-issue-btn"
            disabled={confirming || completed}
            onClick={onConfirm}
          >
            {confirming ? 'Confirming…' : 'Confirm issue exists'}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              data-testid="verify-not-enough-btn"
              disabled={confirming || completed}
              onClick={onNotEnoughEvidence}
            >
              Not enough evidence
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-dashed border-civic-amber-300 text-civic-amber-800"
              data-testid="verify-duplicate-btn"
              disabled={confirming || completed}
              onClick={onPossiblyDuplicate}
            >
              <Copy className="mr-1 h-3.5 w-3.5" aria-hidden />
              Possibly duplicate
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link to={detailHref}>
              View details
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
