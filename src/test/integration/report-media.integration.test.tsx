import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  mockFile,
  renderApp,
  resetIntegrationState,
  signInCitizen,
} from '@/test/integration/helpers';
import { ROUTES } from '@/lib/constants';
import {
  resetMediaCaptureAdapter,
  setMediaCaptureAdapter,
} from '@/lib/media-capture';
import { setGeolocationAdapter, resetGeolocationAdapter } from '@/lib/geolocation';
import * as videoMetadata from '@/lib/video-metadata';
import { useReportDraftStore } from '@/store/reportDraftStore';
import * as reportIntakeAgent from '@/services/ai/report-intake-agent';

describe('Integration: report media and fallbacks', () => {
  beforeEach(async () => {
    await resetIntegrationState();
    await signInCitizen();
    vi.spyOn(videoMetadata, 'readVideoDuration').mockResolvedValue(8);
    resetMediaCaptureAdapter();
    resetGeolocationAdapter();
    setMediaCaptureAdapter({
      detectCapabilities: () => ({
        imageCapture: true,
        getUserMedia: true,
        mediaRecorder: true,
      }),
      capturePhoto: async () => ({
        ok: true,
        file: mockFile('image/jpeg', 50_000, 'camera.jpg'),
        source: 'camera',
      }),
      captureVideo: async () => ({
        ok: true,
        file: mockFile('video/mp4', 1_500_000, 'clip.mp4'),
        source: 'camera',
        durationSec: 8,
      }),
    });
    setGeolocationAdapter({
      getCurrentPosition: async () => ({
        ok: true,
        location: { lat: 12.9736, lng: 77.5956, wardId: 'ward-12' },
      }),
    });
  });

  async function openReportFlow() {
    renderApp(ROUTES.report);
    await screen.findByTestId('report-evidence-step', {}, { timeout: 8000 });
  }

  it('I02: first report with AI-assisted suggestions', async () => {
    await openReportFlow();
    const imageInput = screen.getByTestId('report-gallery-image-input');
    fireEvent.change(imageInput, {
      target: { files: [mockFile('image/jpeg', 50_000, 'proof.jpg')] },
    });
    await waitFor(() => expect(screen.getByTestId('media-preview')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    const desc = screen.getByTestId('report-description-input');
    fireEvent.change(desc, {
      target: {
        value: 'Large pothole near school crossing causing traffic slowdown daily.',
      },
    });
    await waitFor(() => {
      const status = useReportDraftStore.getState().draft.aiStatus;
      expect(['loading', 'suggestion', 'unavailable']).toContain(status);
    });
    const panel =
      screen.queryByTestId('ai-suggestions-panel') ??
      screen.queryByTestId('ai-unavailable-fallback') ??
      screen.queryByTestId('ai-suggestion-placeholder');
    expect(panel).toBeTruthy();
  });

  it('I03: report with real image upload state', async () => {
    await openReportFlow();
    fireEvent.change(screen.getByTestId('report-gallery-image-input'), {
      target: { files: [mockFile('image/jpeg', 80_000, 'gallery.jpg')] },
    });
    await waitFor(() => {
      expect(screen.getByTestId('media-preview')).toBeInTheDocument();
      expect(useReportDraftStore.getState().draft.mediaAttachments[0].type).toBe('photo');
    });
  });

  it('I04: report with short video upload state', async () => {
    await openReportFlow();
    fireEvent.change(screen.getByTestId('report-gallery-video-input'), {
      target: { files: [mockFile('video/mp4', 2_000_000, 'short.mp4')] },
    });
    await waitFor(() => {
      expect(screen.getByTestId('media-preview')).toBeInTheDocument();
      expect(useReportDraftStore.getState().draft.mediaAttachments[0].type).toBe('video');
    });
  });

  it('I05: camera-permission-denied fallback flow', async () => {
    setMediaCaptureAdapter({
      detectCapabilities: () => ({
        imageCapture: true,
        getUserMedia: true,
        mediaRecorder: true,
      }),
      capturePhoto: async () => ({ ok: false, error: 'permission_denied' }),
      captureVideo: async () => ({ ok: false, error: 'permission_denied' }),
    });
    await openReportFlow();
    const cameraBtn = await screen.findByTestId('report-camera-capture');
    fireEvent.click(cameraBtn);
    await waitFor(() => {
      expect(screen.getByTestId('permission-denied-camera')).toBeInTheDocument();
      expect(screen.getByTestId('capture-fallback-gallery')).toBeInTheDocument();
    });
  });

  it('I06: location-permission-denied fallback flow', async () => {
    setGeolocationAdapter({
      getCurrentPosition: async () => ({ ok: false, error: 'permission_denied' }),
    });
    await openReportFlow();
    fireEvent.change(screen.getByTestId('report-gallery-image-input'), {
      target: { files: [mockFile('image/jpeg', 50_000, 'proof.jpg')] },
    });
    await waitFor(() => screen.getByTestId('media-preview'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'Blocked drain smell near park entrance.' },
    });
    fireEvent.click(screen.getByTestId('category-sanitation'));
    fireEvent.change(screen.getByTestId('report-title-input'), {
      target: { value: 'Drain blocked' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await waitFor(() => {
      expect(screen.getByTestId('permission-denied-location')).toBeInTheDocument();
      expect(screen.getByTestId('location-pin-adjust')).toBeInTheDocument();
    });
  });

  it('I07: duplicate warning flow on review', async () => {
    await openReportFlow();
    fireEvent.change(screen.getByTestId('report-gallery-image-input'), {
      target: { files: [mockFile('image/jpeg', 50_000, 'proof.jpg')] },
    });
    await waitFor(() => screen.getByTestId('media-preview'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'Deep pothole near school crossing dangerous for bikes.' },
    });
    fireEvent.click(screen.getByTestId('category-pothole'));
    fireEvent.change(screen.getByTestId('report-title-input'), {
      target: { value: 'Pothole MG Road' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await waitFor(() => screen.getByTestId('report-location-step'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await waitFor(() => {
      expect(
        screen.queryByTestId('duplicate-warning') ??
          useReportDraftStore.getState().draft.duplicateWarning,
      ).toBeTruthy();
    });
  });

  it('I16b: AI unavailable graceful fallback', async () => {
    vi.spyOn(reportIntakeAgent, 'analyzeReportIntake').mockRejectedValue(new Error('offline'));
    await openReportFlow();
    fireEvent.change(screen.getByTestId('report-gallery-image-input'), {
      target: { files: [mockFile('image/jpeg', 50_000, 'proof.jpg')] },
    });
    await waitFor(() => screen.getByTestId('media-preview'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.change(screen.getByTestId('report-description-input'), {
      target: { value: 'Streetlight has been out for several nights.' },
    });
    await waitFor(() => {
      expect(useReportDraftStore.getState().draft.aiStatus).toBe('unavailable');
    });
    expect(screen.getByTestId('ai-unavailable-fallback')).toBeInTheDocument();
  });

  it('I16c: oversized file shows validation error', async () => {
    await openReportFlow();
    const huge = mockFile('image/jpeg', 20 * 1024 * 1024, 'huge.jpg');
    fireEvent.change(screen.getByTestId('report-gallery-image-input'), {
      target: { files: [huge] },
    });
    await waitFor(() => {
      expect(screen.getByTestId('media-error-oversized_image')).toBeInTheDocument();
    });
  });
});
