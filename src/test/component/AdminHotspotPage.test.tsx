import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminHotspotPage from '@/features/admin-hotspots/AdminHotspotPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('AdminHotspotPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C75: hotspot map renders', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminHotspotPage />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('hotspot-map')).toBeInTheDocument();
  });

  it('C81: hotspot trend cards render', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminHotspotPage />
      </MemoryRouter>,
    );
    const cards = await screen.findByTestId('hotspot-trend-cards');
    expect(cards).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('hotspot-trend-card-ward-12')).toBeInTheDocument();
    });
  });
});
