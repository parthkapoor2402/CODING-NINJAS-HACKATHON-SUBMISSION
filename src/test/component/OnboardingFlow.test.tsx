import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import OnboardingPage from '@/features/onboarding/OnboardingPage';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { ROUTES } from '@/lib/constants';

function LocationDisplay() {
  const loc = useLocation();
  return <div data-testid="location">{loc.pathname}</div>;
}

function renderOnboarding(initial = ROUTES.onboarding) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path={ROUTES.onboarding} element={<OnboardingPage />} />
        <Route path={ROUTES.auth} element={<div data-testid="auth-destination">auth</div>} />
        <Route path={ROUTES.home} element={<div data-testid="home-destination">home</div>} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  );
}

async function advanceThroughPermissions() {
  fireEvent.click(screen.getByTestId('persona-commuter'));
  fireEvent.click(screen.getByTestId('onboarding-continue'));

  fireEvent.click(screen.getByText(/location makes sense/i));
  fireEvent.click(screen.getByTestId('onboarding-continue'));

  fireEvent.click(screen.getByText(/camera makes sense/i));
  fireEvent.click(screen.getByTestId('onboarding-continue'));

  fireEvent.click(screen.getByText(/notifications make sense/i));
  fireEvent.click(screen.getByTestId('onboarding-continue'));
}

describe('OnboardingFlow', () => {
  beforeEach(() => {
    clearOnboardingState();
    resetMockAuthSession();
    useOnboardingStore.getState().resetOnboarding();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    useOnboardingStore.getState().hydrate();
  });

  it('C5: renders persona step first', () => {
    renderOnboarding();
    expect(screen.getByTestId('persona-step')).toBeInTheDocument();
    expect(screen.getByText(/What brings you here/i)).toBeInTheDocument();
  });

  it('C6: persona selection enables continue', () => {
    renderOnboarding();
    const btn = screen.getByTestId('onboarding-continue');
    expect(btn).toBeDisabled();
    fireEvent.click(screen.getByTestId('persona-resident'));
    expect(btn).not.toBeDisabled();
  });

  it('C12-C13: lists personas and stores selection', () => {
    renderOnboarding();
    expect(screen.getByTestId('persona-commuter')).toBeInTheDocument();
    expect(screen.getByTestId('persona-family')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('persona-student'));
    expect(useOnboardingStore.getState().persona).toBe('student');
  });

  it('C7-C8: progresses to location education', () => {
    renderOnboarding();
    fireEvent.click(screen.getByTestId('persona-commuter'));
    fireEvent.click(screen.getByTestId('onboarding-continue'));
    expect(screen.getByTestId('permission-location')).toBeInTheDocument();
    expect(screen.getByText(/Location helps crews/i)).toBeInTheDocument();
  });

  it('C9: camera education screen', () => {
    renderOnboarding();
    fireEvent.click(screen.getByTestId('persona-commuter'));
    fireEvent.click(screen.getByTestId('onboarding-continue'));
    fireEvent.click(screen.getByText(/location makes sense/i));
    fireEvent.click(screen.getByTestId('onboarding-continue'));
    expect(screen.getByTestId('permission-camera')).toBeInTheDocument();
    expect(screen.getByText(/Camera evidence/i)).toBeInTheDocument();
  });

  it('C10-C11: notification then auth choice', async () => {
    renderOnboarding();
    await advanceThroughPermissions();
    expect(screen.getByTestId('auth-choice-step')).toBeInTheDocument();
    expect(screen.getByTestId('guest-continue')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-continue')).toBeInTheDocument();
  });

  it('C17: guest branch completes onboarding and navigates home', async () => {
    renderOnboarding();
    await advanceThroughPermissions();
    fireEvent.click(screen.getByTestId('guest-continue'));
    await waitFor(() => {
      expect(useOnboardingStore.getState().onboardingComplete).toBe(true);
      expect(useAuthStore.getState().session?.isGuest).toBe(true);
    });
    expect(screen.getByTestId('home-destination')).toBeInTheDocument();
  });

  it('C18: sign-in branch navigates to auth', async () => {
    renderOnboarding();
    await advanceThroughPermissions();
    fireEvent.click(screen.getByTestId('sign-in-continue'));
    expect(screen.getByTestId('auth-destination')).toBeInTheDocument();
    expect(useOnboardingStore.getState().authPath).toBe('sign-in');
  });
});
