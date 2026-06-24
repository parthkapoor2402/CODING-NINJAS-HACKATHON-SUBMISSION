import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HandHeart,
  ListChecks,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardSurfaces } from '@/lib/card-surfaces';
import type { CivicMission, MissionIcon } from '@/domain/home-missions';

const iconMap: Record<MissionIcon, typeof ShieldCheck> = {
  verify: ShieldCheck,
  support: HandHeart,
  track: ListChecks,
  challenge: GraduationCap,
};

interface TodaysCivicMissionsProps {
  missions: CivicMission[];
}

export function TodaysCivicMissions({ missions }: TodaysCivicMissionsProps) {
  if (missions.length === 0) return null;

  const activeCount = missions.filter((m) => !m.completed).length;
  const firstActiveIndex = missions.findIndex((m) => !m.completed);

  return (
    <section data-testid="civic-missions" className="space-y-2.5 sm:space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-bold">Today&apos;s civic missions</h2>
          <p className="text-xs text-muted-foreground">High-impact actions for your block</p>
        </div>
        <span className="rounded-full border border-civic-blue-200 bg-civic-blue-50 px-2 py-0.5 text-[10px] font-bold text-civic-blue-800">
          {activeCount} active
        </span>
      </div>

      <div className="space-y-2">
        {missions.map((mission, i) => (
          <MissionRow
            key={mission.id}
            mission={mission}
            index={i}
            featured={!mission.completed && i === firstActiveIndex}
          />
        ))}
      </div>
    </section>
  );
}

function MissionRow({
  mission,
  index,
  featured,
}: {
  mission: CivicMission;
  index: number;
  featured: boolean;
}) {
  const Icon = iconMap[mission.icon];
  const done = mission.completed;

  if (done) {
    return (
      <div
        data-testid={`mission-${mission.id}`}
        className={cn(
          'flex items-center gap-2.5 rounded-xl px-3 py-2.5 animate-scale-in sm:gap-3 sm:py-3',
          cardSurfaces.missionDone,
        )}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-civic-teal-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-civic-teal-900 line-through decoration-civic-teal-600/40">
            {mission.title}
          </p>
          <p className="text-[11px] text-civic-teal-700">Completed — thank you</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={mission.route}
      data-testid={`mission-${mission.id}`}
      className={cn(
        'group flex items-center gap-2.5 rounded-xl border transition-all duration-200 active:scale-[0.99] animate-slide-up sm:gap-3',
        featured ? cn('px-3.5 py-3.5', cardSurfaces.missionFeatured) : cn('px-3 py-2.5', cardSurfaces.missionDefault),
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl transition-colors',
          featured
            ? 'h-11 w-11 bg-gradient-to-br from-civic-blue-600 to-civic-teal-600 text-white shadow-sm'
            : 'h-9 w-9 bg-civic-blue-50 text-civic-blue-600 group-hover:bg-civic-blue-100',
        )}
      >
        <Icon className={cn(featured ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {featured ? (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-civic-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-civic-amber-900">
              <Star className="h-2.5 w-2.5" aria-hidden />
              Priority
            </span>
          ) : null}
          <p className={cn('font-semibold text-foreground', featured ? 'text-sm' : 'text-xs')}>
            {mission.title}
          </p>
          {mission.progressLabel ? (
            <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
              {mission.progressLabel}
            </span>
          ) : null}
        </div>
        <p
          className={cn(
            'mt-0.5 line-clamp-2 text-muted-foreground',
            featured ? 'text-xs' : 'text-[11px]',
          )}
        >
          {mission.description}
        </p>
        <p className="mt-1 text-[11px] font-bold text-civic-blue-700 sm:text-xs">{mission.cta}</p>
      </div>
      <ChevronRight
        className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-civic-blue-600',
          featured && 'text-civic-blue-600',
        )}
      />
    </Link>
  );
}
