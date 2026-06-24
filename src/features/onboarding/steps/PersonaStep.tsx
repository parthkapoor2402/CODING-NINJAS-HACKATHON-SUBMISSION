import { MapPin, Home, GraduationCap, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PERSONAS, VALUE_PILLARS } from '@/features/onboarding/onboarding-config';
import type { Persona } from '@/types/onboarding';
import { useOnboardingStore } from '@/store/onboardingStore';

const PERSONA_ICONS = {
  commuter: MapPin,
  resident: Home,
  student: GraduationCap,
  family: Users,
} as const;

interface PersonaStepProps {
  selected: Persona | null;
  onSelect: (persona: Persona) => void;
}

export function PersonaStep({ selected, onSelect }: PersonaStepProps) {
  return (
    <div className="space-y-6" data-testid="persona-step">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">What brings you here?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We&apos;ll tailor tips to how you participate — not how many points you earn.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2" data-testid="value-pillars">
        {VALUE_PILLARS.map((pillar) => (
          <div
            key={pillar.id}
            className="rounded-xl border border-civic-blue-100 bg-white/80 px-3 py-2.5 shadow-sm"
          >
            <p className="text-[11px] font-semibold leading-tight text-civic-blue-800">
              {pillar.title}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {PERSONAS.map((persona) => {
          const active = selected === persona.id;
          const Icon = PERSONA_ICONS[persona.id];
          return (
            <button
              key={persona.id}
              type="button"
              data-testid={`persona-${persona.id}`}
              aria-pressed={active}
              onClick={() => onSelect(persona.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all active:scale-[0.99]',
                active
                  ? 'border-civic-blue-600 bg-white shadow-elevated ring-1 ring-civic-blue-600'
                  : 'border-border bg-card hover:border-civic-blue-200 hover:shadow-card',
              )}
            >
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  active ? 'bg-civic-blue-600 text-white' : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{persona.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{persona.description}</p>
              </div>
              {active ? <Check className="h-5 w-5 shrink-0 text-civic-blue-600" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PersonaStepConnected() {
  const persona = useOnboardingStore((s) => s.persona);
  const setPersona = useOnboardingStore((s) => s.setPersona);
  return <PersonaStep selected={persona} onSelect={setPersona} />;
}
