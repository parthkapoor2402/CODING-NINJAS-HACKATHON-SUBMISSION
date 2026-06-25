import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DetailsStep } from '@/features/reporting/steps/DetailsStep';
import { clearReportDraft } from '@/lib/report-draft-persistence';
import * as reportIntakeAgent from '@/services/ai/report-intake-agent';
import { REPORT_DRAFT_STORAGE_KEY } from '@/types/reporting';
import { useReportDraftStore } from '@/store/reportDraftStore';

describe('ReportDetailsStep', () => {
  beforeEach(() => {
    clearReportDraft();
    useReportDraftStore.getState().resetDraft();
    useReportDraftStore.getState().addMediaAttachment({
      id: 'm1',
      type: 'photo',
      fileName: 'a.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 50_000,
      captureSource: 'gallery',
    });
    useReportDraftStore.getState().setStep(1);
    vi.restoreAllMocks();
  });

  it('C32: manual category selection', () => {
    render(<DetailsStep />);
    fireEvent.click(screen.getByTestId('category-pothole'));
    expect(useReportDraftStore.getState().draft.category).toBe('pothole');
  });

  it('C33: AI suggestion placeholder', async () => {
    vi.spyOn(reportIntakeAgent, 'analyzeReportIntake').mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                model: 'mock-rules',
                fallbackUsed: false,
                analyzedAt: new Date().toISOString(),
                category: 'pothole',
                severity: 'medium',
                suggestedTitle: 'Pothole',
                summary: 'Large pothole',
                safetyCues: [],
                confidence: { category: 0.9, severity: 0.6, overall: 0.75 },
                explanation: 'Road keywords',
              }),
            100,
          ),
        ),
    );
    render(<DetailsStep />);
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'Large pothole on the main road near school.' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('ai-suggestion-placeholder')).toBeInTheDocument();
    });
  });

  it('shows AI suggested category and why panel', async () => {
    vi.spyOn(reportIntakeAgent, 'analyzeReportIntake').mockResolvedValue({
      model: 'mock-rules',
      fallbackUsed: false,
      analyzedAt: new Date().toISOString(),
      category: 'pothole',
      severity: 'high',
      suggestedTitle: 'Pothole near school',
      summary: 'Deep pothole near school crossing.',
      safetyCues: ['Near a school zone'],
      confidence: { category: 0.91, severity: 0.82, overall: 0.86 },
      explanation: 'Suggested pothole because road keywords in your description.',
      categoryRationale: 'Road keywords',
    });
    render(<DetailsStep />);
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'Large pothole near school crossing on MG Road.' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('ai-suggested-category')).toBeInTheDocument();
      expect(screen.getByTestId('ai-why-suggested')).toBeInTheDocument();
    });
  });

  it('C35: title and description validation', () => {
    render(<DetailsStep />);
    fireEvent.change(screen.getByTestId('report-title-input'), { target: { value: 'ab' } });
    fireEvent.change(screen.getByTestId('report-description-input'), { target: { value: 'short' } });
    expect(screen.getByText(/3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/10 characters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });

  it('C36: severity selection', () => {
    render(<DetailsStep />);
    fireEvent.click(screen.getByTestId('severity-high'));
    expect(useReportDraftStore.getState().draft.severity).toBe('high');
  });

  it('C37: draft save on edit', () => {
    render(<DetailsStep />);
    fireEvent.change(screen.getByTestId('report-title-input'), {
      target: { value: 'Saved draft title' },
    });
    expect(localStorage.getItem(REPORT_DRAFT_STORAGE_KEY)).toContain('Saved draft title');
  });

  it('C50: AI unavailable fallback', async () => {
    vi.spyOn(reportIntakeAgent, 'analyzeReportIntake').mockRejectedValue(new Error('AI down'));
    render(<DetailsStep />);
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'Garbage pile blocking sidewalk entrance.' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('ai-unavailable-fallback')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('category-garbage'));
    expect(useReportDraftStore.getState().draft.category).toBe('garbage');
  });
});
