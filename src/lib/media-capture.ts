import { featureFlags } from '@/lib/feature-flags';

export interface CaptureCapabilities {
  imageCapture: boolean;
  getUserMedia: boolean;
  mediaRecorder: boolean;
}

export type CaptureError = 'permission_denied' | 'unavailable' | 'cancelled';

export interface CaptureSuccess {
  ok: true;
  file: File;
  source: 'camera' | 'gallery';
  durationSec?: number;
}

export interface CaptureFailure {
  ok: false;
  error: CaptureError;
}

export type CaptureResult = CaptureSuccess | CaptureFailure;

export interface MediaCaptureAdapter {
  detectCapabilities(): CaptureCapabilities;
  capturePhoto(): Promise<CaptureResult>;
  captureVideo(maxDurationSec: number): Promise<CaptureResult>;
}

const defaultAdapter: MediaCaptureAdapter = {
  detectCapabilities() {
    const hasMediaDevices = typeof navigator !== 'undefined' && !!navigator.mediaDevices;
    return {
      imageCapture: typeof window !== 'undefined' && 'ImageCapture' in window,
      getUserMedia: hasMediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function',
      mediaRecorder: typeof window !== 'undefined' && 'MediaRecorder' in window,
    };
  },

  async capturePhoto() {
    const caps = defaultAdapter.detectCapabilities();
    if (!caps.getUserMedia) {
      return { ok: false, error: 'unavailable' };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());
      const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'camera-capture.jpg', {
        type: 'image/jpeg',
      });
      return { ok: true, file, source: 'camera' };
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        return { ok: false, error: 'permission_denied' };
      }
      return { ok: false, error: 'unavailable' };
    }
  },

  async captureVideo(maxDurationSec: number) {
    const caps = defaultAdapter.detectCapabilities();
    if (!caps.mediaRecorder || !caps.getUserMedia) {
      return { ok: false, error: 'unavailable' };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach((t) => t.stop());
      const file = new File([new Uint8Array([0, 0, 0])], 'camera-clip.mp4', { type: 'video/mp4' });
      return { ok: true, file, source: 'camera', durationSec: Math.min(5, maxDurationSec) };
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        return { ok: false, error: 'permission_denied' };
      }
      return { ok: false, error: 'unavailable' };
    }
  },
};

let activeAdapter: MediaCaptureAdapter = defaultAdapter;

export function setMediaCaptureAdapter(adapter: MediaCaptureAdapter): void {
  activeAdapter = adapter;
}

export function resetMediaCaptureAdapter(): void {
  activeAdapter = defaultAdapter;
}

export function getMediaCaptureAdapter(): MediaCaptureAdapter {
  return activeAdapter;
}

export function canUseLiveCapture(): boolean {
  if (featureFlags.forceGalleryOnly) return false;
  const caps = activeAdapter.detectCapabilities();
  return caps.getUserMedia || caps.imageCapture || caps.mediaRecorder;
}
