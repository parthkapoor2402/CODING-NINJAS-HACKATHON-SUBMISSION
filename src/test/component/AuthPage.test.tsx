import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthPage from '@/features/onboarding/AuthPage';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { DEMO_ACCOUNTS, ROUTES } from '@/lib/constants';

describe('AuthPage', () => {
  beforeEach(() => {
    clearOnboardingState();
    resetMockAuthSession();
    useOnboardingStore.getState().resetOnboarding();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    useOnboardingStore.getState().hydrate();
  });

  it('C19: renders sign-in options', () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-options')).toBeInTheDocument();
    expect(screen.getByText('Continue as citizen')).toBeInTheDocument();
  });

  it('C20: sign-in completes onboarding from sign-in path', async () => {
    useOnboardingStore.getState().setAuthPath('sign-in');
    render(
      <MemoryRouter initialEntries={[ROUTES.auth]}>
        <Routes>
          <Route path={ROUTES.auth} element={<AuthPage />} />
          <Route path="/" element={<div data-testid="root-redirect">root</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Continue as citizen'));
    await waitFor(() => {
      expect(useOnboardingStore.getState().onboardingComplete).toBe(true);
      expect(useAuthStore.getState().session?.user.email).toBe(DEMO_ACCOUNTS.citizen);
    });
  });
});
