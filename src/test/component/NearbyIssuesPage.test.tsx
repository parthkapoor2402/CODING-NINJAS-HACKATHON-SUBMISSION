import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NearbyIssuesPage from '@/features/feed/NearbyIssuesPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { resetMockReports } from '@/services/mock/mockReports';
import { resetMockCorroboration } from '@/services/mock/mockCorroboration';
import { useAuthStore } from '@/store/authStore';

function renderNearby() {
  return render(
    <MemoryRouter>
      <NearbyIssuesPage />
    </MemoryRouter>,
  );
}

describe('NearbyIssuesPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    resetMockReports();
    resetMockCorroboration();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C51: renders nearby feed with issue cards', async () => {
    renderNearby();
    const feed = await screen.findByTestId('nearby-feed');
    expect(feed).toBeInTheDocument();
    expect(feed.children.length).toBeGreaterThan(0);
  });

  it('C52: sort by distance / urgency updates order', async () => {
    renderNearby();
    const feed = await screen.findByTestId('nearby-feed');
    const distanceOrder = feed.getAttribute('data-order') ?? '';

    fireEvent.click(screen.getByTestId('sort-by-urgency'));
    await waitFor(() => {
      const urgencyOrder = feed.getAttribute('data-order') ?? '';
      expect(urgencyOrder).not.toBe(distanceOrder);
    });

    const urgentFirst = feed.getAttribute('data-order')?.split(',')[0];
    expect(urgentFirst).toBe('report-003');
  });
});
