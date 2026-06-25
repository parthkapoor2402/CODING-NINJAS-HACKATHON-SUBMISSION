import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminIssueDetailPage from '@/features/admin-issue/AdminIssueDetailPage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';
import { services } from '@/services/registry';

function renderDetail(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/admin/queue/${id}`]}>
      <Routes>
        <Route path="/admin/queue/:id" element={<AdminIssueDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AdminIssueDetailPage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  it('C76: moderation panel renders', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    renderDetail('report-001');
    expect(await screen.findByTestId('issue-moderation-panel')).toBeInTheDocument();
    expect(await screen.findByTestId('ops-triage-panel')).toBeInTheDocument();
    expect(screen.getByText(/Deep pothole/i)).toBeInTheDocument();
  });

  it('C77: assignment action assigns worker', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    const assignSpy = vi.spyOn(services.backend.admin, 'assignWorker');
    renderDetail('report-001');
    const btn = await screen.findByTestId('assign-issue-btn');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith('report-001', 'user-worker-1');
    });
  });

  it('C84: manual review and override actions', async () => {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    const overrideSpy = vi.spyOn(services.backend.admin, 'overrideReportStatus');
    renderDetail('report-003');
    const reviewBtn = await screen.findByTestId('manual-review-btn');
    const overrideBtn = screen.getByTestId('override-status-btn');
    fireEvent.click(reviewBtn);
    fireEvent.click(overrideBtn);
    await waitFor(() => {
      expect(overrideSpy).toHaveBeenCalledWith('report-003', 'verified', undefined);
    });
  });
});
