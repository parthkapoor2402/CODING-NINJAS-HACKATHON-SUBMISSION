import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import {
  advanceOnboardingPermissions,
  renderApp,
  resetIntegrationState,
} from '@/test/integration/helpers';
import { ROUTES } from '@/lib/constants';

describe('Integration: onboarding to home', () => {
  beforeEach(async () => {
    await resetIntegrationState();
  });

  it('I01: new user completes onboarding and signs in to home', async () => {
    renderApp(ROUTES.onboarding);
    await screen.findByTestId('persona-commuter', {}, { timeout: 8000 });
    await advanceOnboardingPermissions();
    fireEvent.click(screen.getByTestId('sign-in-continue'));
    await screen.findByTestId('auth-page', {}, { timeout: 8000 });
    fireEvent.click(screen.getByRole('button', { name: /Continue as citizen/i }));
    await screen.findByTestId('home-hero', {}, { timeout: 8000 });
    expect(screen.getByText(/Around you/i)).toBeInTheDocument();
  });
});
