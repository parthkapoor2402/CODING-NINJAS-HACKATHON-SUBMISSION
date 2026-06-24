import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MEDIA_LIMITS,
  validateMediaFile,
  validateVideoDuration,
} from '@/lib/media-validation';

function mockFile(type: string, sizeBytes: number, name = 'file'): File {
  return new File([new ArrayBuffer(sizeBytes)], name, { type });
}

describe('media-validation', () => {
  it('U16: JPEG image within limits', () => {
    const result = validateMediaFile(mockFile('image/jpeg', 500_000, 'photo.jpg'));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.type).toBe('photo');
  });

  it('U17: PNG image within limits', () => {
    const result = validateMediaFile(mockFile('image/png', 200_000, 'photo.png'));
    expect(result.ok).toBe(true);
  });

  it('U18: unsupported type (PDF)', () => {
    const result = validateMediaFile(mockFile('application/pdf', 1000, 'doc.pdf'));
    expect(result).toEqual({ ok: false, error: 'unsupported_type' });
  });

  it('U19: oversized image', () => {
    const result = validateMediaFile(
      mockFile('image/jpeg', DEFAULT_MEDIA_LIMITS.maxImageBytes + 1, 'big.jpg'),
    );
    expect(result).toEqual({ ok: false, error: 'oversized_image' });
  });

  it('U20: MP4 video within limits', () => {
    const result = validateMediaFile(mockFile('video/mp4', 5_000_000, 'clip.mp4'));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.type).toBe('video');
  });

  it('U21: oversized video', () => {
    const result = validateMediaFile(
      mockFile('video/mp4', DEFAULT_MEDIA_LIMITS.maxVideoBytes + 1, 'big.mp4'),
    );
    expect(result).toEqual({ ok: false, error: 'oversized_video' });
  });

  it('U22: video duration over max', () => {
    const result = validateVideoDuration(DEFAULT_MEDIA_LIMITS.maxVideoSec + 1);
    expect(result).toEqual({ ok: false, error: 'video_too_long' });
  });

  it('U23: tiny image flagged low quality', () => {
    const result = validateMediaFile(mockFile('image/jpeg', 500, 'tiny.jpg'));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.warning).toBe('low_quality');
  });
});
