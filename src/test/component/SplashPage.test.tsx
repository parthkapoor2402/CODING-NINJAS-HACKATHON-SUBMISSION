import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import SplashPage, { SPLASH_MS } from '@/features/onboarding/SplashPage';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { ROUTES } from '@/lib/constants';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('SplashPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearOnboardingState();
    resetMockAuthSession();
    useOnboardingStore.getState().resetOnboarding();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    useOnboardingStore.getState().hydrate();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('C1: renders brand and tagline', () => {
    render(
      <MemoryRouter>
        <SplashPage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('splash-page')).toBeInTheDocument();
    expect(screen.getByText(/Report\. Verify\. See it fixed\./)).toBeInTheDocument();
  });

  it('C2: transitions to onboarding when not complete', async () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.splash]}>
        <SplashPage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    await act(async () => {
      vi.advanceTimersByTime(SPLASH_MS + 50);
    });
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.onboarding);
  });

  it('C3: transitions to auth when onboarded without session', async () => {
    useOnboardingStore.getState().completeOnboarding();
    render(
      <MemoryRouter initialEntries={[ROUTES.splash]}>
        <SplashPage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    await act(async () => {
      vi.advanceTimersByTime(SPLASH_MS + 50);
    });
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.auth);
  });

  it('C4: transitions to home when onboarded with session', async () => {
    useOnboardingStore.getState().completeOnboarding();
    const signInPromise = useAuthStore.getState().signInAsGuest();
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    await signInPromise;
    render(
      <MemoryRouter initialEntries={[ROUTES.splash]}>
        <SplashPage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    await act(async () => {
      vi.advanceTimersByTime(SPLASH_MS + 100);
    });
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.home);
  });
});
