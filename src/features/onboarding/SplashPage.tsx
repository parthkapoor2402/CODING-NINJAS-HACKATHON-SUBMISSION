import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText, ShieldCheck } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { getSplashDestination } from '@/lib/splash-navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';

const SPLASH_MS = 1100;

const VALUE_CHIPS = [
  { label: 'Report', icon: FileText },
  { label: 'Verify', icon: Eye },
  { label: 'Resolve', icon: ShieldCheck },
] as const;

export default function SplashPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const hydrateOnboarding = useOnboardingStore((s) => s.hydrate);
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
  const hydrated = useOnboardingStore((s) => s.hydrated);
  const session = useAuthStore((s) => s.session);
  const hydrateAuth = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrateOnboarding();
    void hydrateAuth();
  }, [hydrateOnboarding, hydrateAuth]);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, Math.round((elapsed / SPLASH_MS) * 100)));
      if (elapsed < SPLASH_MS) requestAnimationFrame(tick);
    };
    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timer = setTimeout(() => {
      setVisible(false);
      const user = session?.user;
      const destination = getSplashDestination({
        onboardingComplete,
        hasSession: Boolean(session),
        isAdmin: user?.role === 'admin' || user?.role === 'moderator',
      });
      navigate(destination, { replace: true });
    }, SPLASH_MS);

    return () => clearTimeout(timer);
  }, [hydrated, onboardingComplete, session, navigate]);

  if (!visible) return null;

  return (
    <div
      className="gradient-civic-hero relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 text-white"
      data-testid="splash-page"
    >
      <div className="pointer-events-none absolute -left-16 top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-24 h-56 w-56 rounded-full bg-civic-teal-400/20 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative flex flex-col items-center text-center animate-scale-in">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 shadow-elevated">
          <svg viewBox="0 0 32 32" className="h-10 w-10" fill="white" aria-hidden>
            <path d="M16 6L8 12v10h6v-6h4v6h6V12L16 6z" />
          </svg>
        </div>
        <h1 className="font-display text-display-md font-extrabold tracking-tight">{APP_NAME}</h1>
        <p className="mt-3 max-w-xs text-base font-medium text-white/90">
          Report. Verify. See it fixed.
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
          Community-powered civic action for Ward 12 — neighbors confirm, crews respond, progress stays
          visible.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {VALUE_CHIPS.map(({ label, icon: Icon }, i) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </span>
          ))}
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Verified impact · accountable resolution
        </p>
      </div>

      <div
        className="absolute bottom-10 left-8 right-8"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading CivicResolve"
      >
        <div className="h-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white/90 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export { SPLASH_MS };
