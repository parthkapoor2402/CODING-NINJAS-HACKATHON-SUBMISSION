import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '@/lib/constants';
import { getSplashDestination } from '@/lib/splash-navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';

const SPLASH_MS = 800;

export default function SplashPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
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
      <div className="absolute -left-16 top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-12 bottom-24 h-56 w-56 rounded-full bg-civic-teal-400/20 blur-3xl" />

      <div className="relative animate-scale-in flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 shadow-elevated">
          <svg viewBox="0 0 32 32" className="h-10 w-10" fill="white" aria-hidden>
            <path d="M16 6L8 12v10h6v-6h4v6h6V12L16 6z" />
          </svg>
        </div>
        <h1 className="font-display text-display-md font-extrabold tracking-tight">{APP_NAME}</h1>
        <p className="mt-3 max-w-xs text-base font-medium text-white/90">
          Report. Verify. See it fixed.
        </p>
        <div className="mt-8 flex gap-2">
          {['Report', 'Verify', 'Resolve'].map((word) => (
            <span
              key={word}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export { SPLASH_MS };
