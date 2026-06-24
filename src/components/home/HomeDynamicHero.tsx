import { Link } from 'react-router-dom';
import { Camera, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { cardSurfaces } from '@/lib/card-surfaces';
import type { DynamicHeroContent, HeroAccent } from '@/domain/home-missions';
import { Button } from '@/components/ui/button';

const accentIcon: Record<HeroAccent, typeof Sparkles> = {
  teal: Sparkles,
  blue: MapPin,
  amber: Camera,
};

interface HomeDynamicHeroProps {
  hero: DynamicHeroContent;
  wardLabel?: string;
}

export function HomeDynamicHero({ hero, wardLabel = 'Ward 12 · MG Road' }: HomeDynamicHeroProps) {
  const HeroIcon = accentIcon[hero.accent];

  return (
    <section data-testid="home-hero" className="space-y-2.5 animate-slide-up sm:space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-civic-teal-700">
          Your neighborhood
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-civic-blue-200 bg-civic-blue-50 px-2 py-0.5 text-[10px] font-semibold text-civic-blue-800">
          <MapPin className="h-3 w-3" aria-hidden />
          {wardLabel}
        </span>
      </div>

      <div
        data-testid="home-dynamic-hero"
        className={cn(
          'overflow-hidden rounded-card border p-3.5 sm:p-4',
          cardSurfaces.heroContext[hero.accent],
        )}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12',
              cardSurfaces.heroIcon[hero.accent],
            )}
            aria-hidden
          >
            <HeroIcon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-civic-blue-700/80">
              Context for today
            </p>
            <h1 className="mt-0.5 font-display text-base font-bold leading-snug text-foreground sm:text-lg">
              {hero.headline}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hero.subline}</p>
            <Button variant="soft" size="sm" className="mt-2.5 h-8 sm:mt-3" asChild>
              <Link to={hero.ctaRoute} data-testid="home-hero-context-cta">
                {hero.ctaLabel}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Link
        to={ROUTES.report}
        className="group block overflow-hidden rounded-card border-0 shadow-fab transition-transform active:scale-[0.99]"
        data-testid="home-primary-cta"
      >
        <div className="gradient-civic-hero relative flex items-center gap-3.5 px-4 py-4 text-white sm:gap-4 sm:px-5 sm:py-5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_55%)]"
            aria-hidden
          />
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/35 sm:h-12 sm:w-12">
            <Camera className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
          </div>
          <div className="relative min-w-0 flex-1">
            <p className="font-display text-base font-bold leading-tight sm:text-lg">Report an issue</p>
            <p className="mt-0.5 text-xs text-white/90 sm:text-sm">
              Photo or video + location — under a minute outdoors
            </p>
          </div>
          <ChevronRight className="relative h-5 w-5 shrink-0 text-white/85 transition-transform group-hover:translate-x-0.5 sm:h-6 sm:w-6" />
        </div>
      </Link>
    </section>
  );
}
