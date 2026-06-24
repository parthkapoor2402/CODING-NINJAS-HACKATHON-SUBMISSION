import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VerificationPage from '@/features/verification/VerificationPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { resetMockReports } from '@/services/mock/mockReports';
import { resetMockCorroboration } from '@/services/mock/mockCorroboration';
import { useAuthStore } from '@/store/authStore';
import { services } from '@/services/registry';
import { VERIFICATION_SUPPORT_BONUS } from '@/domain/trust-updates';

describe('VerificationPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    resetMockReports();
    resetMockCorroboration();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('C55/C57: verify action corroborates issue and updates trust', async () => {
    await useAuthStore.getState().signIn('demo-parent@local.dev');
    const corroborateSpy = vi.spyOn(services.reports, 'corroborate');
    const trustBefore = useAuthStore.getState().session!.user.trust.verificationScore;

    render(
      <MemoryRouter>
        <VerificationPage />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByTestId('verify-issue-btn'));

    await waitFor(() => {
      expect(corroborateSpy).toHaveBeenCalledWith('report-003', 'user-parent-1');
      const trustAfter = useAuthStore.getState().session!.user.trust.verificationScore;
      expect(trustAfter).toBe(trustBefore + VERIFICATION_SUPPORT_BONUS);
    });
  });
});
