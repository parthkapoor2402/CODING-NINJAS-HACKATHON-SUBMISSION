import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RequireCitizenApp, RequireOnboardingIncomplete } from '@/layouts/RequireAuth';
import OnboardingPage from '@/features/onboarding/OnboardingPage';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { ROUTES } from '@/lib/constants';

describe('RouteGuards', () => {
  beforeEach(() => {
    clearOnboardingState();
    resetMockAuthSession();
    useOnboardingStore.getState().resetOnboarding();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    useOnboardingStore.getState().hydrate();
  });

  it('C21: incomplete onboarding redirects from citizen app', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route
            path={ROUTES.home}
            element={
              <RequireCitizenApp>
                <div data-testid="home-protected">home</div>
              </RequireCitizenApp>
            }
          />
          <Route path={ROUTES.onboarding} element={<div data-testid="onboarding-redirect">onboarding</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('onboarding-redirect')).toBeInTheDocument();
  });

  it('C22: complete user with session skips onboarding', async () => {
    useOnboardingStore.getState().completeOnboarding();
    await useAuthStore.getState().signInAsGuest();
    render(
      <MemoryRouter initialEntries={[ROUTES.onboarding]}>
        <Routes>
          <Route
            path={ROUTES.onboarding}
            element={
              <RequireOnboardingIncomplete>
                <OnboardingPage />
              </RequireOnboardingIncomplete>
            }
          />
          <Route path={ROUTES.home} element={<div data-testid="home-redirect">home</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('home-redirect')).toBeInTheDocument();
  });

  it('C23: complete without session redirects to auth from citizen app', () => {
    useOnboardingStore.getState().completeOnboarding();
    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route
            path={ROUTES.home}
            element={
              <RequireCitizenApp>
                <div data-testid="home-protected">home</div>
              </RequireCitizenApp>
            }
          />
          <Route path={ROUTES.auth} element={<div data-testid="auth-redirect">auth</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('auth-redirect')).toBeInTheDocument();
  });
});
