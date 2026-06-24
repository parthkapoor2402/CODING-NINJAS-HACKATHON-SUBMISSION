import { describe, expect, it } from 'vitest';
import { canAccessCitizenApp, getSplashDestination } from '@/lib/splash-navigation';
import { ROUTES } from '@/lib/constants';

describe('getSplashDestination', () => {
  it('U8: routes to onboarding when not complete', () => {
    expect(
      getSplashDestination({ onboardingComplete: false, hasSession: false, isAdmin: false }),
    ).toBe(ROUTES.onboarding);
  });

  it('U9: routes to auth when complete without session', () => {
    expect(
      getSplashDestination({ onboardingComplete: true, hasSession: false, isAdmin: false }),
    ).toBe(ROUTES.auth);
  });

  it('U10: routes to home when complete with citizen session', () => {
    expect(
      getSplashDestination({ onboardingComplete: true, hasSession: true, isAdmin: false }),
    ).toBe(ROUTES.home);
  });

  it('U11: routes to admin dashboard for admin', () => {
    expect(
      getSplashDestination({ onboardingComplete: true, hasSession: true, isAdmin: true }),
    ).toBe(ROUTES.admin.dashboard);
  });
});

describe('canAccessCitizenApp', () => {
  it('U12: false when onboarding incomplete', () => {
    expect(canAccessCitizenApp(false, true)).toBe(false);
  });

  it('U13: true when complete with session (guest)', () => {
    expect(canAccessCitizenApp(true, true)).toBe(true);
  });

  it('U14: true when complete with signed-in session', () => {
    expect(canAccessCitizenApp(true, true)).toBe(true);
  });

  it('U15: false when complete but no session', () => {
    expect(canAccessCitizenApp(true, false)).toBe(false);
  });
});
