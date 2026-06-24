import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Skeleton } from '@/components/ui/skeleton';

function AppBootstrap() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateOnboarding = useOnboardingStore((s) => s.hydrate);

  useEffect(() => {
    hydrateOnboarding();
    void hydrateAuth();
  }, [hydrateAuth, hydrateOnboarding]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center p-8">
          <Skeleton className="h-8 w-48" />
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppBootstrap />
    </BrowserRouter>
  );
}
