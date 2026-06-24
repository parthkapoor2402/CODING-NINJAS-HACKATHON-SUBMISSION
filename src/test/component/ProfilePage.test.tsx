import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '@/features/profile/ProfilePage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('ProfilePage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('renders civic identity header and strengths', async () => {
    await useAuthStore.getState().signIn('demo-citizen@local.dev');
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId('profile-page')).toBeInTheDocument();
    expect(await screen.findByTestId('civic-identity-header')).toBeInTheDocument();
    expect(await screen.findByTestId('civic-strengths')).toBeInTheDocument();
    expect(screen.getByText(/Asha Verma/i)).toBeInTheDocument();
  });

  it('shows next unlock and navigation links', async () => {
    await useAuthStore.getState().signIn('demo-citizen@local.dev');
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-next-unlock')).toBeInTheDocument();
      expect(screen.getByTestId('profile-nav-rewards')).toBeInTheDocument();
      expect(screen.getByTestId('profile-nav-track')).toBeInTheDocument();
    });
  });

  it('shows family nav for parent account', async () => {
    await useAuthStore.getState().signIn('demo-parent@local.dev');
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId('profile-nav-family')).toBeInTheDocument();
    expect(screen.getByText(/Review proposals/i)).toBeInTheDocument();
  });

  it('shows activity summary for citizen with rewards', async () => {
    await useAuthStore.getState().signIn('demo-citizen@local.dev');
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId('civic-activity-summary')).toBeInTheDocument();
    await waitFor(() => {
      const items = screen.queryAllByTestId(/^activity-item-/);
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
