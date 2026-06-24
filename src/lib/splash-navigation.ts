import { ROUTES } from '@/lib/constants';

export interface SplashNavigationInput {
  onboardingComplete: boolean;
  hasSession: boolean;
  isAdmin: boolean;
}

export function getSplashDestination({
  onboardingComplete,
  hasSession,
  isAdmin,
}: SplashNavigationInput): string {
  if (!onboardingComplete) return ROUTES.onboarding;
  if (!hasSession) return ROUTES.auth;
  if (isAdmin) return ROUTES.admin.dashboard;
  return ROUTES.home;
}

export function canAccessCitizenApp(
  onboardingComplete: boolean,
  hasSession: boolean,
): boolean {
  return onboardingComplete && hasSession;
}
