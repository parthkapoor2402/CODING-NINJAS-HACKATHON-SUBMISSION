import { ShieldCheck, Sparkles, Award, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore, selectShowFirstSessionEducation } from '@/store/onboardingStore';

export function FirstSessionEducationCard() {
  const show = useOnboardingStore(selectShowFirstSessionEducation);
  const dismiss = useOnboardingStore((s) => s.dismissFirstSessionEducation);

  if (!show) return null;

  const items = [
    {
      icon: ShieldCheck,
      label: 'Trust',
      text: 'grows when your reports are verified by neighbors.',
    },
    {
      icon: Sparkles,
      label: 'Verification',
      text: 'confirms an issue is real before crews prioritize it.',
    },
    {
      icon: Award,
      label: 'Rewards',
      text: 'apply only to verified, useful contribution — not noise.',
    },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-card border border-civic-blue-200 bg-gradient-to-br from-civic-blue-50 to-white p-4 shadow-card animate-slide-up"
      data-testid="first-session-education"
      role="region"
      aria-label="How CivicResolve works"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-civic-teal-500/10" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-8 w-8"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <p className="relative pr-8 font-display text-sm font-bold text-civic-blue-800">
        Welcome — here&apos;s how impact works
      </p>
      <ul className="relative mt-3 space-y-3">
        {items.map(({ icon: Icon, label, text }) => (
          <li key={label} className="flex gap-3 text-sm text-civic-blue-900">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <Icon className="h-4 w-4 text-civic-blue-600" />
            </div>
            <span className="pt-0.5 leading-snug">
              <strong>{label}</strong> {text}
            </span>
          </li>
        ))}
      </ul>
      <Button variant="soft" size="sm" className="relative mt-4 gap-1" onClick={dismiss}>
        Got it
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
