import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import IssueDetailPage from '@/features/feed/IssueDetailPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { resetMockReports } from '@/services/mock/mockReports';
import { resetMockCorroboration } from '@/services/mock/mockCorroboration';
import { useAuthStore } from '@/store/authStore';
import { services } from '@/services/registry';
import { ROUTES } from '@/lib/constants';

function renderDetail(id: string) {
  return render(
    <MemoryRouter initialEntries={[ROUTES.issueDetail(id)]}>
      <Routes>
        <Route path="/app/issue/:id" element={<IssueDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('IssueDetailPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    resetMockReports();
    resetMockCorroboration();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C53: detail page renders with description', async () => {
    renderDetail('report-003');
    const page = await screen.findByTestId('issue-detail-page');
    expect(page).toBeInTheDocument();
    expect(screen.getByText(/Broken streetlight on Park Lane/i)).toBeInTheDocument();
  });

  it('C54: support existing action corroborates issue', async () => {
    await useAuthStore.getState().signIn('demo-parent@local.dev');
    const corroborateSpy = vi.spyOn(services.reports, 'corroborate');

    renderDetail('report-003');
    const btn = await screen.findByTestId('support-existing-btn');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(corroborateSpy).toHaveBeenCalledWith('report-003', 'user-parent-1');
    });
  });

  it('C56: duplicate marker when duplicate', async () => {
    renderDetail('report-005');
    expect(await screen.findByTestId('duplicate-issue-marker')).toBeInTheDocument();
  });

  it('C63: suspicious notice when flagged', async () => {
    renderDetail('report-003');
    expect(await screen.findByTestId('suspicious-issue-notice')).toBeInTheDocument();
    expect(screen.getByText(/Photo is dark or distant/i)).toBeInTheDocument();
  });
});
