import { Suspense } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { DEMO_ACCOUNTS } from '@/lib/constants';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { clearReportDraft } from '@/lib/report-draft-persistence';
import { resetMediaCaptureAdapter } from '@/lib/media-capture';
import { resetGeolocationAdapter } from '@/lib/geolocation';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useReportDraftStore } from '@/store/reportDraftStore';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { resetVerifyActivityStore } from '@/store/verifyActivityStore';

export function renderApp(initialPath: string): RenderResult {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Suspense fallback={<div data-testid="app-loading">Loading…</div>}>
        <AppRoutes />
      </Suspense>
    </MemoryRouter>,
  );
}

export async function resetIntegrationState(): Promise<void> {
  clearOnboardingState();
  clearReportDraft();
  resetMediaCaptureAdapter();
  resetGeolocationAdapter();
  resetMockAuthSession();
  resetVerifyActivityStore();
  useOnboardingStore.getState().resetOnboarding();
  useOnboardingStore.getState().hydrate();
  useReportDraftStore.getState().resetDraft();
  useAuthStore.setState({ session: null, isLoading: false, error: null });
}

export async function signInCitizen(): Promise<void> {
  await useAuthStore.getState().signIn(DEMO_ACCOUNTS.citizen);
  useOnboardingStore.getState().completeOnboarding();
}

export async function signInAdmin(): Promise<void> {
  await useAuthStore.getState().signIn(DEMO_ACCOUNTS.admin);
  useOnboardingStore.getState().completeOnboarding();
}

export async function signInYouth(): Promise<void> {
  await useAuthStore.getState().signIn(DEMO_ACCOUNTS.youth);
  useOnboardingStore.getState().completeOnboarding();
}

export async function signInParent(): Promise<void> {
  await useAuthStore.getState().signIn(DEMO_ACCOUNTS.parent);
  useOnboardingStore.getState().completeOnboarding();
}

export function mockFile(type: string, sizeBytes: number, name: string): File {
  return new File([new ArrayBuffer(sizeBytes)], name, { type });
}

export async function advanceOnboardingPermissions(): Promise<void> {
  const { expect } = await import('vitest');
  const { fireEvent, screen, waitFor } = await import('@testing-library/react');
  fireEvent.click(screen.getByTestId('persona-commuter'));
  fireEvent.click(screen.getByTestId('onboarding-continue'));
  fireEvent.click(screen.getByText(/location makes sense/i));
  fireEvent.click(screen.getByTestId('onboarding-continue'));
  fireEvent.click(screen.getByText(/camera makes sense/i));
  fireEvent.click(screen.getByTestId('onboarding-continue'));
  fireEvent.click(screen.getByText(/notifications make sense/i));
  fireEvent.click(screen.getByTestId('onboarding-continue'));
  await waitFor(() => {
    expect(screen.getByTestId('auth-choice-step')).toBeInTheDocument();
  });
}
