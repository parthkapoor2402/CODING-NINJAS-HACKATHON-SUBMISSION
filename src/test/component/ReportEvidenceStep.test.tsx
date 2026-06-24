import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EvidenceStep } from '@/features/reporting/steps/EvidenceStep';
import { DEFAULT_MEDIA_LIMITS } from '@/lib/media-validation';
import {
  resetMediaCaptureAdapter,
  setMediaCaptureAdapter,
} from '@/lib/media-capture';
import * as videoMetadata from '@/lib/video-metadata';
import { clearReportDraft } from '@/lib/report-draft-persistence';
import { useReportDraftStore } from '@/store/reportDraftStore';

function mockFile(type: string, sizeBytes: number, name: string): File {
  return new File([new ArrayBuffer(sizeBytes)], name, { type });
}

function renderEvidence() {
  return render(<EvidenceStep />);
}

describe('ReportEvidenceStep', () => {
  beforeEach(() => {
    clearReportDraft();
    useReportDraftStore.getState().resetDraft();
    resetMediaCaptureAdapter();
    vi.restoreAllMocks();
    vi.spyOn(videoMetadata, 'readVideoDuration').mockResolvedValue(10);
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
        file: mockFile('video/mp4', 1_000_000, 'camera.mp4'),
        source: 'camera',
        durationSec: 5,
      }),
    });
  });

  it('C28: gallery image upload', async () => {
    renderEvidence();
    const input = screen.getByTestId('report-gallery-image-input');
    const file = mockFile('image/jpeg', 50_000, 'gallery.jpg');
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByTestId('media-preview')).toBeInTheDocument();
    });
    expect(useReportDraftStore.getState().draft.mediaAttachments).toHaveLength(1);
    expect(useReportDraftStore.getState().draft.mediaAttachments[0].type).toBe('photo');
  });

  it('C29: mocked camera capture', async () => {
    renderEvidence();
    fireEvent.click(screen.getByTestId('report-camera-capture'));
    await waitFor(() => {
      expect(screen.getByTestId('media-preview')).toBeInTheDocument();
    });
    expect(useReportDraftStore.getState().draft.mediaAttachments[0].captureSource).toBe('camera');
  });

  it('C30: gallery video upload', async () => {
    vi.spyOn(videoMetadata, 'readVideoDuration').mockResolvedValue(10);
    renderEvidence();
    const input = screen.getByTestId('report-gallery-video-input');
    const file = mockFile('video/mp4', 2_000_000, 'clip.mp4');
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByTestId('media-preview')).toBeInTheDocument();
    });
    expect(useReportDraftStore.getState().draft.mediaAttachments[0].type).toBe('video');
  });

  it('C31: video capture abstraction', async () => {
    renderEvidence();
    fireEvent.click(screen.getByTestId('report-video-capture'));
    await waitFor(() => {
      expect(screen.getByTestId('media-preview')).toBeInTheDocument();
    });
    expect(useReportDraftStore.getState().draft.mediaAttachments[0].type).toBe('video');
  });

  it('C40: unsupported media type', async () => {
    renderEvidence();
    const input = screen.getByTestId('report-gallery-image-input');
    fireEvent.change(input, {
      target: { files: [mockFile('application/pdf', 1000, 'bad.pdf')] },
    });
    await waitFor(() => {
      expect(screen.getByTestId('media-error-unsupported_type')).toBeInTheDocument();
    });
  });

  it('C41: oversized image', async () => {
    renderEvidence();
    const input = screen.getByTestId('report-gallery-image-input');
    fireEvent.change(input, {
      target: {
        files: [mockFile('image/jpeg', DEFAULT_MEDIA_LIMITS.maxImageBytes + 1, 'big.jpg')],
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('media-error-oversized_image')).toBeInTheDocument();
    });
  });

  it('C42: oversized video', async () => {
    renderEvidence();
    const input = screen.getByTestId('report-gallery-video-input');
    fireEvent.change(input, {
      target: {
        files: [mockFile('video/mp4', DEFAULT_MEDIA_LIMITS.maxVideoBytes + 1, 'big.mp4')],
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId('media-error-oversized_video')).toBeInTheDocument();
    });
  });

  it('C43: video too long', async () => {
    vi.spyOn(videoMetadata, 'readVideoDuration').mockResolvedValue(
      DEFAULT_MEDIA_LIMITS.maxVideoSec + 5,
    );
    renderEvidence();
    const input = screen.getByTestId('report-gallery-video-input');
    const file = mockFile('video/mp4', 2_000_000, 'long.mp4');
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByTestId('media-error-video_too_long')).toBeInTheDocument();
    });
  });

  it('C44: denied camera permission', async () => {
    setMediaCaptureAdapter({
      detectCapabilities: () => ({
        imageCapture: true,
        getUserMedia: true,
        mediaRecorder: true,
      }),
      capturePhoto: async () => ({ ok: false, error: 'permission_denied' }),
      captureVideo: async () => ({ ok: false, error: 'permission_denied' }),
    });
    renderEvidence();
    fireEvent.click(screen.getByTestId('report-camera-capture'));
    await waitFor(() => {
      expect(screen.getByTestId('permission-denied-camera')).toBeInTheDocument();
    });
    expect(screen.getByText(/gallery upload/i)).toBeInTheDocument();
  });

  it('C46: live capture unavailable fallback', () => {
    setMediaCaptureAdapter({
      detectCapabilities: () => ({
        imageCapture: false,
        getUserMedia: false,
        mediaRecorder: false,
      }),
      capturePhoto: async () => ({ ok: false, error: 'unavailable' }),
      captureVideo: async () => ({ ok: false, error: 'unavailable' }),
    });
    renderEvidence();
    expect(screen.getByTestId('capture-fallback-gallery')).toBeInTheDocument();
    expect(screen.queryByTestId('report-camera-capture')).not.toBeInTheDocument();
  });
});
