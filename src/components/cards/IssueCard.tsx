import { MapPin, Users, ChevronRight, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { StatusBadge } from '@/components/StatusBadge';
import { categoryColors } from '@/lib/design-tokens';
import type { IssueCategory, Report, ReportStatus } from '@/types';
import { categoryLabel } from '@/utils/labels';

interface IssueCardProps {
  report: Report;
  distanceKm?: number;
  mediaUrl?: string;
  variant?: 'default' | 'highlighted' | 'duplicate' | 'resolved';
  showActions?: boolean;
  onConfirm?: () => void;
  verifyTestId?: string;
  onSupport?: () => void;
  supportTestId?: string;
  detailHref?: string;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'border-border',
  highlighted: 'border-civic-blue-200 bg-civic-blue-50/30',
  duplicate: 'border-l-4 border-l-civic-amber-500 border-border',
  resolved: 'border-t-4 border-t-civic-teal-500 border-border',
};

export function IssueCard({
  report,
  distanceKm,
  mediaUrl,
  variant = 'default',
  showActions = true,
  onConfirm,
  verifyTestId,
  onSupport,
  supportTestId,
  detailHref,
  className,
}: IssueCardProps) {
  const catColor = categoryColors[report.category] ?? categoryColors.other;
  const resolved = report.status === 'resolved';
  const isDuplicate = Boolean(report.duplicateOfId || report.status === 'merged');
  const cardVariant = isDuplicate ? 'duplicate' : variant;
  const needsVerification = report.status === 'pending_verification';

  return (
    <article
      className={cn(
        'overflow-hidden rounded-card border bg-card shadow-card transition-all duration-200 hover:shadow-elevated',
        variantStyles[cardVariant],
        className,
      )}
    >
      <div className="relative aspect-[16/9] bg-muted">
        {mediaUrl ? (
          <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: `${catColor}22` }}
          >
            <CategoryIcon category={report.category} color={catColor} />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Chip variant="category" style={{ backgroundColor: catColor }}>
            {categoryLabel(report.category)}
          </Chip>
        </div>
        {distanceKm !== undefined ? (
          <div className="absolute right-3 top-3">
            <Chip variant="outline" className="bg-white/90 backdrop-blur-sm">
              {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`}
            </Chip>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {report.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} />
          {isDuplicate ? (
            <span
              className="text-xs font-medium text-civic-amber-700"
              data-testid="duplicate-issue-marker"
            >
              Duplicate
            </span>
          ) : null}
          {report.corroborationCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {report.corroborationCount} confirmed
            </span>
          ) : null}
          {report.location.address ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {report.location.address}
            </span>
          ) : null}
        </div>

        {showActions && !resolved ? (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2">
              {onSupport ? (
                <Button
                  variant="teal"
                  size="sm"
                  className="flex-1 gap-1"
                  data-testid={supportTestId}
                  onClick={onSupport}
                >
                  <HandHeart className="h-3.5 w-3.5" aria-hidden />
                  Support
                </Button>
              ) : onConfirm ? (
                <Button
                  variant="teal"
                  size="sm"
                  className="flex-1"
                  data-testid={verifyTestId}
                  onClick={onConfirm}
                >
                  {needsVerification ? 'Confirm you see this' : 'I see this too'}
                </Button>
              ) : null}
              {detailHref ? (
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={detailHref}>
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function CategoryIcon({ category, color }: { category: IssueCategory; color: string }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
      style={{ backgroundColor: `${color}33`, color }}
      aria-hidden
    >
      {category.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function issueCardVariant(status: ReportStatus, nearUser?: boolean): IssueCardProps['variant'] {
  if (status === 'resolved') return 'resolved';
  if (nearUser) return 'highlighted';
  return 'default';
}
