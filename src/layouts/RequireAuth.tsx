import { Navigate } from 'react-router-dom';
import { useCurrentUser, useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { canAccessCitizenApp } from '@/lib/splash-navigation';
import { ROUTES } from '@/lib/constants';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = useCurrentUser();
  if (!user) return <Navigate to={ROUTES.auth} replace />;
  return <>{children}</>;
}

/** Citizen app requires completed onboarding + active session (guest or signed-in). */
export function RequireCitizenApp({ children }: RequireAuthProps) {
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
  const session = useAuthStore((s) => s.session);

  if (!onboardingComplete) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }
  if (!canAccessCitizenApp(onboardingComplete, Boolean(session))) {
    return <Navigate to={ROUTES.auth} replace />;
  }
  return <>{children}</>;
}

/** Skip onboarding when already completed. */
export function RequireOnboardingIncomplete({ children }: RequireAuthProps) {
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);
  const session = useAuthStore((s) => s.session);

  if (onboardingComplete && session) {
    return <Navigate to={ROUTES.home} replace />;
  }
  if (onboardingComplete && !session) {
    return <Navigate to={ROUTES.auth} replace />;
  }
  return <>{children}</>;
}

export function RoleRedirect() {
  const user = useCurrentUser();
  const onboardingComplete = useOnboardingStore((s) => s.onboardingComplete);

  if (!user) return <Navigate to={ROUTES.auth} replace />;
  if (!onboardingComplete) return <Navigate to={ROUTES.onboarding} replace />;
  if (user.role === 'admin' || user.role === 'moderator') {
    return <Navigate to={ROUTES.admin.dashboard} replace />;
  }
  return <Navigate to={ROUTES.home} replace />;
}
