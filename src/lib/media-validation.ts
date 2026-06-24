import { MEDIA_LIMITS } from '@/lib/constants';

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'] as const;

export type MediaValidationError =
  | 'unsupported_type'
  | 'oversized_image'
  | 'oversized_video'
  | 'video_too_long';

export type MediaValidationWarning = 'low_quality';

export interface MediaLimits {
  maxImageBytes: number;
  maxVideoBytes: number;
  maxVideoSec: number;
  minImageBytesForQuality: number;
}

export const DEFAULT_MEDIA_LIMITS: MediaLimits = {
  maxImageBytes: MEDIA_LIMITS.maxImageMb * 1024 * 1024,
  maxVideoBytes: MEDIA_LIMITS.maxVideoMb * 1024 * 1024,
  maxVideoSec: MEDIA_LIMITS.maxVideoSec,
  minImageBytesForQuality: 10_000,
};

export interface MediaValidationSuccess {
  ok: true;
  type: 'photo' | 'video';
  warning?: MediaValidationWarning;
}

export interface MediaValidationFailure {
  ok: false;
  error: MediaValidationError;
}

export type MediaValidationResult = MediaValidationSuccess | MediaValidationFailure;

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isVideoMime(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export function validateMediaFile(
  file: Pick<File, 'type' | 'size'>,
  limits: MediaLimits = DEFAULT_MEDIA_LIMITS,
): MediaValidationResult {
  if (isImageMime(file.type)) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
      return { ok: false, error: 'unsupported_type' };
    }
    if (file.size > limits.maxImageBytes) {
      return { ok: false, error: 'oversized_image' };
    }
    if (file.size < limits.minImageBytesForQuality) {
      return { ok: true, type: 'photo', warning: 'low_quality' };
    }
    return { ok: true, type: 'photo' };
  }

  if (isVideoMime(file.type)) {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type as (typeof ACCEPTED_VIDEO_TYPES)[number])) {
      return { ok: false, error: 'unsupported_type' };
    }
    if (file.size > limits.maxVideoBytes) {
      return { ok: false, error: 'oversized_video' };
    }
    return { ok: true, type: 'video' };
  }

  return { ok: false, error: 'unsupported_type' };
}

export function validateVideoDuration(
  durationSec: number,
  limits: MediaLimits = DEFAULT_MEDIA_LIMITS,
): MediaValidationResult {
  if (durationSec > limits.maxVideoSec) {
    return { ok: false, error: 'video_too_long' };
  }
  return { ok: true, type: 'video' };
}
