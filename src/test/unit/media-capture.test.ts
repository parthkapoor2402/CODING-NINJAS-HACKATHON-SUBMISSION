import { describe, expect, it } from 'vitest';
import {
  getMediaCaptureAdapter,
  resetMediaCaptureAdapter,
  setMediaCaptureAdapter,
  type MediaCaptureAdapter,
} from '@/lib/media-capture';

describe('media-capture', () => {
  it('U34: detectCapabilities returns shape', () => {
    const caps = getMediaCaptureAdapter().detectCapabilities();
    expect(caps).toMatchObject({
      imageCapture: expect.any(Boolean),
      getUserMedia: expect.any(Boolean),
      mediaRecorder: expect.any(Boolean),
    });
  });

  it('U35: mock adapter capturePhoto success', async () => {
    const mock: MediaCaptureAdapter = {
      detectCapabilities: () => ({
        imageCapture: true,
        getUserMedia: true,
        mediaRecorder: true,
      }),
      capturePhoto: async () => ({
        ok: true,
        file: new File(['x'], 'cam.jpg', { type: 'image/jpeg' }),
        source: 'camera',
      }),
      captureVideo: async () => ({ ok: false, error: 'unavailable' }),
    };
    setMediaCaptureAdapter(mock);
    const result = await getMediaCaptureAdapter().capturePhoto();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe('camera');
      expect(result.file.type).toBe('image/jpeg');
    }
    resetMediaCaptureAdapter();
  });

  it('U36: mock adapter permission denied', async () => {
    const mock: MediaCaptureAdapter = {
      detectCapabilities: () => ({
        imageCapture: false,
        getUserMedia: true,
        mediaRecorder: false,
      }),
      capturePhoto: async () => ({ ok: false, error: 'permission_denied' }),
      captureVideo: async () => ({ ok: false, error: 'permission_denied' }),
    };
    setMediaCaptureAdapter(mock);
    const result = await getMediaCaptureAdapter().capturePhoto();
    expect(result).toEqual({ ok: false, error: 'permission_denied' });
    resetMediaCaptureAdapter();
  });
});
