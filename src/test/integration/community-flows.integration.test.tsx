import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  renderApp,
  resetIntegrationState,
  signInCitizen,
  signInParent,
} from '@/test/integration/helpers';
import { ROUTES } from '@/lib/constants';
import { services } from '@/services/registry';

describe('Integration: community flows', () => {
  beforeEach(async () => {
    await resetIntegrationState();
  });

  it('I08: support-existing-report flow on issue detail', async () => {
    await signInParent();
    const corroborateSpy = vi.spyOn(services.reports, 'corroborate');
    renderApp(ROUTES.issueDetail('report-003'));
    const btn = await screen.findByTestId('support-existing-btn', {}, { timeout: 8000 });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(corroborateSpy).toHaveBeenCalledWith('report-003', 'user-parent-1');
    });
  });

  it('I09: suspicious-report flow shows notice', async () => {
    await signInCitizen();
    renderApp(ROUTES.issueDetail('report-003'));
    expect(await screen.findByTestId('suspicious-issue-notice')).toBeInTheDocument();
    expect(screen.getByText(/Photo is dark or distant/i)).toBeInTheDocument();
  });

  it('I10: community verification flow', async () => {
    await signInParent();
    renderApp(ROUTES.community);
    const verifyBtn = await screen.findByTestId('verify-issue-btn');
    fireEvent.click(verifyBtn);
    await waitFor(() => {
      expect(screen.getByText(/Confirmation recorded/i)).toBeInTheDocument();
    });
  });

  it('I11: issue status progression timeline', async () => {
    await signInCitizen();
    renderApp(ROUTES.track);
    const timelines = await screen.findAllByTestId('issue-timeline');
    expect(timelines.length).toBeGreaterThan(0);
    expect(screen.getByTestId('my-reports-list')).toBeInTheDocument();
  });

  it('I07b: duplicate warning links to support existing on review', async () => {
    await signInCitizen();
    renderApp(ROUTES.report);
    const { useReportDraftStore } = await import('@/store/reportDraftStore');
    useReportDraftStore.getState().updateDraft({
      step: 3,
      title: 'Dup test',
      description: 'Near duplicate pothole',
      category: 'pothole',
      severity: 'high',
      location: { lat: 12.9736, lng: 77.5956 },
      mediaAttachments: [
        {
          id: 'm1',
          type: 'photo',
          fileName: 'a.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 50_000,
          captureSource: 'gallery',
        },
      ],
      duplicateWarning: { reportId: 'report-001', score: 90 },
    });
    await waitFor(() => {
      expect(screen.getByTestId('duplicate-warning')).toBeInTheDocument();
      expect(screen.getByTestId('support-existing-report')).toBeInTheDocument();
    });
  });
});
