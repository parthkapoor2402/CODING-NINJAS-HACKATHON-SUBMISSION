import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OnboardingPage from '@/features/onboarding/OnboardingPage';
import { CitizenShell } from '@/layouts/CitizenShell';
import AuthPage from '@/features/onboarding/AuthPage';
import { RequireCitizenApp } from '@/layouts/RequireAuth';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { ROUTES } from '@/lib/constants';

describe('BottomNavGate', () => {
  beforeEach(() => {
    clearOnboardingState();
    resetMockAuthSession();
    useOnboardingStore.getState().resetOnboarding();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    useOnboardingStore.getState().hydrate();
  });

  it('C27: bottom nav not on onboarding', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.onboarding]}>
        <OnboardingPage />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
  });

  it('C28: bottom nav visible after guest onboarding path', async () => {
    useOnboardingStore.getState().completeOnboarding();
    await useAuthStore.getState().signInAsGuest();
    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Routes>
          <Route
            path="/app"
            element={
              <RequireCitizenApp>
                <CitizenShell />
              </RequireCitizenApp>
            }
          >
            <Route path="home" element={<div>home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  it('C29: bottom nav not on auth page', () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
  });
});
