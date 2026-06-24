import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboardPage from '@/features/admin-dashboard/AdminDashboardPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C78: dashboard KPI cards render', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    );
    const kpis = await screen.findByTestId('admin-dashboard-kpis');
    expect(kpis).toBeInTheDocument();
    await waitFor(() => {
      expect(kpis.textContent).toMatch(/Open queue|Suspicious cases|Resolved/i);
    });
  });
});
