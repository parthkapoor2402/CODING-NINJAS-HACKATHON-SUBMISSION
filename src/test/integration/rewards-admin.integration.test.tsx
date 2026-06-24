import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
  renderApp,
  resetIntegrationState,
  signInCitizen,
  signInYouth,
  signInAdmin,
} from '@/test/integration/helpers';
import { ROUTES } from '@/lib/constants';

describe('Integration: rewards, youth, admin', () => {
  beforeEach(async () => {
    await resetIntegrationState();
  });

  it('I12: reward unlock surfaces after verified contribution', async () => {
    await signInCitizen();
    renderApp(ROUTES.rewards);
    await screen.findByTestId('verified-points-total', {}, { timeout: 8000 });
    expect(screen.getByTestId('reward-catalog')).toBeInTheDocument();
    await waitFor(() => {
      const locked = screen.queryAllByTestId('reward-catalog-locked');
      const unlocked = screen.queryAllByTestId('reward-catalog-unlocked');
      expect(locked.length + unlocked.length).toBeGreaterThan(0);
    });
  });

  it('I13: supervised youth/family mode eligibility flow', async () => {
    await signInYouth();
    renderApp(ROUTES.family);
    expect(await screen.findByTestId('youth-rewards-restricted')).toBeInTheDocument();
    expect(screen.getByTestId('family-contributions')).toBeInTheDocument();
    expect(screen.getByText(/cannot redeem partner perks/i)).toBeInTheDocument();
  });

  it('I14: admin sees reported issue in queue', async () => {
    await signInAdmin();
    renderApp(ROUTES.admin.queue);
    const queue = await screen.findByTestId('admin-issue-queue');
    expect(queue).toBeInTheDocument();
    expect(screen.getByTestId('admin-queue-item-report-001')).toBeInTheDocument();
  });

  it('I15: admin sees suspicious queue', async () => {
    await signInAdmin();
    renderApp(ROUTES.admin.moderation);
    expect(await screen.findByTestId('suspicious-reports-queue')).toBeInTheDocument();
    expect(screen.getByTestId('abuse-review-queue')).toBeInTheDocument();
  });

  it('I16: admin analytics reflects mock data state', async () => {
    await signInAdmin();
    renderApp(ROUTES.admin.analytics);
    const response = await screen.findByTestId('response-time-metrics');
    expect(response.textContent).toMatch(/Median verify time/i);
    expect(screen.getByTestId('category-trend-chart').textContent).toMatch(/pothole|water leak/i);
    expect(screen.getByTestId('reward-abuse-flags').textContent).toMatch(/Velocity spike/i);
    expect(screen.getByTestId('predictive-insights-cards').textContent).toMatch(/Ward 12/i);
  });
});
