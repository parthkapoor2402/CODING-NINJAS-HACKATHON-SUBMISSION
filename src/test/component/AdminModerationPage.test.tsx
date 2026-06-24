import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminModerationPage from '@/features/admin-moderation/AdminModerationPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('AdminModerationPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C73: suspicious reports queue renders', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminModerationPage />
      </MemoryRouter>,
    );
    const queue = await screen.findByTestId('suspicious-reports-queue');
    expect(queue).toBeInTheDocument();
    await waitFor(() => {
      expect(queue.textContent).toMatch(/duplicate risk|Photo is dark/i);
    });
  });

  it('C74: abuse review queue renders', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminModerationPage />
      </MemoryRouter>,
    );
    const queue = await screen.findByTestId('abuse-review-queue');
    expect(queue).toBeInTheDocument();
    await waitFor(() => {
      expect(queue.textContent).toMatch(/Velocity spike/i);
    });
  });
});
