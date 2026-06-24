import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminAnalyticsPage from '@/features/admin-analytics/AdminAnalyticsPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('AdminAnalyticsPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C79: response-time metrics render', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminAnalyticsPage />
      </MemoryRouter>,
    );
    const section = await screen.findByTestId('response-time-metrics');
    expect(section).toBeInTheDocument();
    await waitFor(() => {
      expect(section.textContent).toMatch(/Median verify time|Median resolution/i);
    });
  });

  it('C80: category trend chart renders', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminAnalyticsPage />
      </MemoryRouter>,
    );
    const section = await screen.findByTestId('category-trend-chart');
    expect(section).toBeInTheDocument();
    await waitFor(() => {
      expect(section.textContent).toMatch(/pothole|water leak/i);
    });
  });

  it('C82: reward abuse flags render', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminAnalyticsPage />
      </MemoryRouter>,
    );
    const section = await screen.findByTestId('reward-abuse-flags');
    expect(section).toBeInTheDocument();
    await waitFor(() => {
      expect(section.textContent).toMatch(/Velocity spike|Duplicate cluster/i);
    });
  });

  it('C83: predictive insights cards render', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminAnalyticsPage />
      </MemoryRouter>,
    );
    const section = await screen.findByTestId('predictive-insights-cards');
    expect(section).toBeInTheDocument();
    await waitFor(() => {
      expect(section.textContent).toMatch(/Ward 12 pothole cluster|Water leak seasonality/i);
    });
  });
});
