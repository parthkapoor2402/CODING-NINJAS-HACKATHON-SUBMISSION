import { Link } from 'react-router-dom';
import { Camera, ChevronRight, ShieldCheck } from 'lucide-react';
import { PERSONA_HOME, DEFAULT_PERSONA_HOME } from '@/features/onboarding/onboarding-config';
import { ROUTES } from '@/lib/constants';
import type { Persona } from '@/types/onboarding';
import { Button } from '@/components/ui/button';

const ROUTE_MAP = {
  report: ROUTES.report,
  community: ROUTES.community,
  nearby: ROUTES.nearby,
} as const;

interface HomeHeroProps {
  persona: Persona | null;
}

export function HomeHero({ persona }: HomeHeroProps) {
  const config = persona ? PERSONA_HOME[persona] : DEFAULT_PERSONA_HOME;

  return (
    <section data-testid="home-hero" className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-civic-teal-600">
        {config.greeting}
      </p>

      <Link
        to={ROUTE_MAP[config.primaryRoute]}
        className="group block overflow-hidden rounded-card border-0 shadow-fab transition-transform active:scale-[0.99]"
        data-testid="home-primary-cta"
      >
        <div className="gradient-civic-hero flex items-center gap-4 px-5 py-5 text-white">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Camera className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold leading-tight">{config.headline}</p>
            <p className="mt-0.5 text-sm text-white/85">{config.subline}</p>
          </div>
          <ChevronRight className="h-6 w-6 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>

      <Button variant="outline" className="w-full border-civic-teal-200 bg-civic-teal-50/50" asChild>
        <Link to={ROUTE_MAP[config.secondaryRoute]} data-testid="home-secondary-cta">
          <ShieldCheck className="h-4 w-4 text-civic-teal-600" />
          {config.secondaryCta}
        </Link>
      </Button>
    </section>
  );
}
