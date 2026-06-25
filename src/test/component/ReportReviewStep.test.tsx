import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReviewStep } from '@/features/reporting/steps/ReviewStep';
import { SuccessStep } from '@/features/reporting/steps/SuccessStep';
import { clearReportDraft } from '@/lib/report-draft-persistence';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import * as duplicateTrustAgent from '@/services/ai/duplicate-trust-agent';
import { useAuthStore } from '@/store/authStore';
import { useReportDraftStore } from '@/store/reportDraftStore';

function seedCompleteDraft() {
  useReportDraftStore.getState().updateDraft({
    title: 'Pothole on MG Road',
    description: 'Deep pothole causing traffic slowdown near junction.',
    category: 'pothole',
    severity: 'high',
    location: { lat: 12.9736, lng: 77.5956 },
    mediaAttachments: [
      {
        id: 'm1',
        type: 'photo',
        fileName: 'proof.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 50_000,
        captureSource: 'gallery',
      },
    ],
    step: 3,
  });
}

function renderReview(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ReportReviewStep', () => {
  beforeEach(async () => {
    clearReportDraft();
    resetMockAuthSession();
    useReportDraftStore.getState().resetDraft();
    useAuthStore.setState({ session: null, isLoading: false, error: null });
    await useAuthStore.getState().signInAsGuest();
    vi.restoreAllMocks();
  });

  it('C38: duplicate warning banner', async () => {
    seedCompleteDraft();
    vi.spyOn(duplicateTrustAgent, 'analyzeDuplicateTrust').mockResolvedValue({
      classification: 'high_confidence_duplicate',
      recommendedAction: 'support_existing',
      riskScore: 85,
      matches: [
        {
          reportId: 'report-001',
          title: 'Pothole at school crossing',
          score: 85,
          distanceM: 45,
          category: 'pothole',
          status: 'verified',
        },
      ],
      trustSignals: [],
      userMessage: 'A similar report is already open nearby.',
      adminRationale: ['Classification: high confidence duplicate'],
      rewardEligibility: 'reduced',
      supportExistingReportId: 'report-001',
      model: 'mock-rules',
      fallbackUsed: false,
      analyzedAt: new Date().toISOString(),
    });
    renderReview(<ReviewStep />);
    await waitFor(() => {
      expect(screen.getByTestId('duplicate-warning')).toBeInTheDocument();
    });
  });

  it('C39: low-quality upload warning', () => {
    useReportDraftStore.getState().updateDraft({
      title: 'Blurry photo',
      description: 'Hard to see but something on the curb.',
      category: 'other',
      severity: 'low',
      location: { lat: 12.9, lng: 77.5 },
      mediaAttachments: [
        {
          id: 'm-low',
          type: 'photo',
          fileName: 'tiny.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 500,
          captureSource: 'gallery',
          lowQualityWarning: true,
        },
      ],
      step: 3,
    });
    renderReview(<ReviewStep />);
    expect(screen.getByTestId('low-quality-warning')).toBeInTheDocument();
  });

  it('C47: submit disabled when incomplete', () => {
    useReportDraftStore.getState().updateDraft({ step: 3 });
    renderReview(<ReviewStep />);
    expect(screen.getByTestId('report-submit-btn')).toBeDisabled();
  });

  it('C48: successful submit', async () => {
    seedCompleteDraft();
    renderReview(<ReviewStep />);
    await waitFor(() => {
      expect(screen.getByTestId('report-submit-btn')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('report-submit-btn'));
    await waitFor(() => {
      expect(useReportDraftStore.getState().draft.submittedReportId).toBeTruthy();
    });
  });

  it('C49: post-submit success state', async () => {
    seedCompleteDraft();
    const { rerender } = renderReview(<ReviewStep />);
    await waitFor(() => {
      expect(screen.getByTestId('report-submit-btn')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('report-submit-btn'));
    await waitFor(() => {
      expect(useReportDraftStore.getState().draft.submittedReportId).toBeTruthy();
    });
    rerender(
      <MemoryRouter>
        <SuccessStep />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('report-success')).toBeInTheDocument();
    expect(screen.getByText(/started real momentum/i)).toBeInTheDocument();
    expect(screen.getByTestId('neighborhood-queue-step')).toBeInTheDocument();
    expect(screen.getByTestId('impact-visibility-feedback')).toBeInTheDocument();
    expect(screen.getByTestId('success-track-report')).toBeInTheDocument();
  }, 15000);
});
