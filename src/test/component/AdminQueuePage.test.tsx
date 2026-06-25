import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminQueuePage from '@/features/admin-queue/AdminQueuePage';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { useAuthStore } from '@/store/authStore';

describe('AdminQueuePage', () => {
  beforeEach(() => {
    resetMockAuthSession();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
  });

  async function renderQueue() {
    await useAuthStore.getState().signIn('demo-admin@local.dev');
    render(
      <MemoryRouter>
        <AdminQueuePage />
      </MemoryRouter>,
    );
    return screen.findByTestId('admin-issue-queue');
  }

  it('C69: issue queue renders', async () => {
    const queue = await renderQueue();
    expect(queue).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('admin-queue-item-report-001')).toBeInTheDocument();
      expect(screen.getByTestId('ops-triage-queue-summary')).toBeInTheDocument();
    });
  });

  it('C70: filter by category', async () => {
    await renderQueue();
    await screen.findByTestId('admin-queue-item-report-001');
    fireEvent.change(screen.getByTestId('admin-filter-category'), {
      target: { value: 'water_leak' },
    });
    await waitFor(() => {
      expect(screen.queryByTestId('admin-queue-item-report-001')).not.toBeInTheDocument();
      expect(screen.getByTestId('admin-queue-item-report-002')).toBeInTheDocument();
    });
  });

  it('C71: filter by severity', async () => {
    await renderQueue();
    await screen.findByTestId('admin-queue-item-report-001');
    fireEvent.change(screen.getByTestId('admin-filter-severity'), {
      target: { value: 'medium' },
    });
    await waitFor(() => {
      expect(screen.queryByTestId('admin-queue-item-report-001')).not.toBeInTheDocument();
      expect(screen.getByTestId('admin-queue-item-report-003')).toBeInTheDocument();
    });
  });

  it('C72: filter by status', async () => {
    await renderQueue();
    await screen.findByTestId('admin-queue-item-report-001');
    fireEvent.change(screen.getByTestId('admin-filter-status'), {
      target: { value: 'in_progress' },
    });
    await waitFor(() => {
      expect(screen.queryByTestId('admin-queue-item-report-001')).not.toBeInTheDocument();
      expect(screen.getByTestId('admin-queue-item-report-002')).toBeInTheDocument();
    });
  });
});
