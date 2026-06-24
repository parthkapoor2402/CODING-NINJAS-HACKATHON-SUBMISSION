import { AlertCircle, Clock, MapPin, Users, ChevronRight, HandHeart, ShieldCheck } from 'lucide-react';

import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { Chip } from '@/components/ui/chip';

import { StatusBadge } from '@/components/StatusBadge';

import { cardSurfaces, categoryAccent, severityRail } from '@/lib/card-surfaces';

import type { Report, ReportStatus } from '@/types';

import { categoryLabel } from '@/utils/labels';



interface IssueCardProps {

  report: Report;

  distanceKm?: number;

  mediaUrl?: string;

  variant?: 'default' | 'highlighted' | 'duplicate' | 'resolved' | 'live';

  showActions?: boolean;

  onConfirm?: () => void;

  verifyTestId?: string;

  onSupport?: () => void;

  supportTestId?: string;

  detailHref?: string;

  className?: string;

  pendingDays?: number;

  trustCue?: string;

  actionCompleted?: boolean;

  confirming?: boolean;

}



const variantStyles: Record<string, string> = {

  default: cardSurfaces.issueDefault,

  highlighted: cardSurfaces.issueHighlighted,

  live: cardSurfaces.issueLive,

  duplicate: cardSurfaces.issueDuplicate,

  resolved: cardSurfaces.issueResolved,

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

  pendingDays,

  trustCue,

  actionCompleted,

  confirming,

}: IssueCardProps) {

  const { color: catColor, Icon: CategoryIconComponent } = categoryAccent(report.category);

  const resolved = report.status === 'resolved';

  const isDuplicate = Boolean(report.duplicateOfId || report.status === 'merged');

  const cardVariant = isDuplicate ? 'duplicate' : variant;

  const needsVerification = report.status === 'pending_verification';

  const isLive = variant === 'live' || (needsVerification && report.severity === 'high');



  return (

    <article

      className={cn(

        'overflow-hidden rounded-card border shadow-card transition-[box-shadow,transform] duration-200 card-interactive',

        variantStyles[cardVariant],

        !isDuplicate && severityRail(report.severity),

        actionCompleted && 'ring-2 ring-civic-teal-400 animate-scale-in',

        confirming && 'opacity-90',

        className,

      )}

    >

      <div

        className="relative aspect-[5/3] bg-muted sm:aspect-[16/9]"

        style={{ borderBottom: `3px solid ${catColor}` }}

      >

        {mediaUrl ? (

          <img src={mediaUrl} alt="" className="h-full w-full object-cover" />

        ) : (

          <div

            className="flex h-full w-full items-center justify-center"

            style={{ backgroundColor: `${catColor}18` }}

          >

            <div

              className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm sm:h-16 sm:w-16"

              style={{ backgroundColor: `${catColor}28`, color: catColor }}

              aria-hidden

            >

              <CategoryIconComponent className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />

            </div>

          </div>

        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/35 to-transparent p-2.5 sm:p-3">

          <Chip variant="category" size="sm" style={{ backgroundColor: catColor }}>

            {categoryLabel(report.category)}

          </Chip>

          {distanceKm !== undefined ? (

            <Chip variant="distance" size="sm">

              {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`}

            </Chip>

          ) : null}

        </div>

        {isLive && needsVerification ? (

          <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3">

            <Chip variant="live" size="sm" pulse dotColor="#ffffff">

              Live · needs confirmation

            </Chip>

          </div>

        ) : null}

      </div>



      <div className="space-y-2.5 p-3 sm:p-4">

        {trustCue ? (

          <p className="inline-flex items-center gap-1 rounded-md bg-civic-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-civic-teal-800">

            <ShieldCheck className="h-3 w-3" aria-hidden />

            {trustCue}

          </p>

        ) : null}



        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">

          {report.description}

        </p>



        <div className="flex flex-wrap items-center gap-1.5">

          <StatusBadge status={report.status} />

          {report.severity === 'high' ? (

            <Chip variant="urgent" size="sm">

              <AlertCircle className="h-3 w-3" aria-hidden />

              High priority

            </Chip>

          ) : null}

          {isDuplicate ? (

            <Chip variant="pending" size="sm" data-testid="duplicate-issue-marker">

              Duplicate

            </Chip>

          ) : null}

          {report.corroborationCount > 0 ? (

            <Chip variant="verified" size="sm">

              <Users className="h-3 w-3" aria-hidden />

              {report.corroborationCount} confirmed

            </Chip>

          ) : null}

          {pendingDays !== undefined && needsVerification ? (

            <Chip variant="muted" size="sm">

              <Clock className="h-3 w-3" aria-hidden />

              {pendingDays === 0 ? 'Today' : `${pendingDays}d pending`}

            </Chip>

          ) : null}

        </div>



        {report.location.address ? (

          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">

            <MapPin className="h-3 w-3 shrink-0" aria-hidden />

            <span className="truncate">{report.location.address}</span>

          </p>

        ) : null}



        {showActions && !resolved ? (

          <div className="flex gap-2 pt-1">

            {onSupport ? (

              <Button

                variant="teal"

                size="sm"

                className="min-h-touch flex-1 gap-1"

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

                className="min-h-touch flex-1"

                data-testid={verifyTestId}

                onClick={onConfirm}

                disabled={confirming}

              >

                {confirming

                  ? 'Confirming…'

                  : needsVerification

                    ? 'Confirm you see this'

                    : 'I see this too'}

              </Button>

            ) : null}

            {detailHref ? (

              <Button variant="outline" size="sm" className="min-h-touch flex-1" asChild>

                <Link to={detailHref}>

                  Details

                  <ChevronRight className="h-4 w-4" />

                </Link>

              </Button>

            ) : null}

          </div>

        ) : null}

      </div>

    </article>

  );

}



export function issueCardVariant(status: ReportStatus, nearUser?: boolean): IssueCardProps['variant'] {

  if (status === 'resolved') return 'resolved';

  if (nearUser) return 'highlighted';

  return 'default';

}


