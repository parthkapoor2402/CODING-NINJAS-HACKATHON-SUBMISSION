import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TrackingPage from '@/features/tracking/TrackingPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { resetMockReports } from '@/services/mock/mockReports';
import { resetMockCorroboration } from '@/services/mock/mockCorroboration';
import { useAuthStore } from '@/store/authStore';

describe('TrackingPage', () => {
  beforeEach(async () => {
    resetMockAuthSession();
    resetMockReports();
    resetMockCorroboration();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    await useAuthStore.getState().signIn('demo-citizen@local.dev');
  });

  it('C58: issue timeline on report card', async () => {
    render(
      <MemoryRouter>
        <TrackingPage />
      </MemoryRouter>,
    );
    const timelines = await screen.findAllByTestId('issue-timeline');
    expect(timelines.length).toBeGreaterThan(0);
  });

  it('C59: my reports list renders user reports', async () => {
    render(
      <MemoryRouter>
        <TrackingPage />
      </MemoryRouter>,
    );
    const list = await screen.findByTestId('my-reports-list');
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBeGreaterThan(0);
  });

  it('C60: filters narrow the list', async () => {
    render(
      <MemoryRouter>
        <TrackingPage />
      </MemoryRouter>,
    );
    await screen.findByTestId('my-reports-list');
    const allCount = screen.getByTestId('my-reports-list').children.length;

    fireEvent.click(screen.getByTestId('my-reports-filter-resolved'));
    await waitFor(() => {
      const resolvedCount = screen.getByTestId('my-reports-list').children.length;
      expect(resolvedCount).toBeLessThan(allCount);
      expect(resolvedCount).toBe(1);
    });

    fireEvent.click(screen.getByTestId('my-reports-filter-needs_action'));
    await waitFor(() => {
      expect(screen.getByTestId('my-reports-list').children.length).toBe(1);
    });
  });

  it('C61: reopen unresolved changes status', async () => {
    render(
      <MemoryRouter>
        <TrackingPage />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByTestId('my-reports-filter-resolved'));
    const reopenBtn = await screen.findByTestId('reopen-issue-btn');
    fireEvent.click(reopenBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('reopen-issue-btn')).not.toBeInTheDocument();
    });
  });

  it('C62: resolution proof on resolved reports', async () => {
    render(
      <MemoryRouter>
        <TrackingPage />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByTestId('my-reports-filter-resolved'));
    expect(await screen.findByTestId('resolution-proof')).toBeInTheDocument();
  });
});
