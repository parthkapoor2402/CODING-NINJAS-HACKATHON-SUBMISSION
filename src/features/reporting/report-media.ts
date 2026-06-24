import { storeMediaFile } from '@/store/reportMediaFiles';
import type { DraftMediaAttachment } from '@/types/reporting';

export function createMediaAttachmentFromFile(
  file: File,
  captureSource: DraftMediaAttachment['captureSource'],
  options?: { durationSec?: number; lowQualityWarning?: boolean },
): DraftMediaAttachment {
  const type = file.type.startsWith('video/') ? 'video' : 'photo';
  const id = `draft-media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const previewUrl = storeMediaFile(id, file);
  return {
    id,
    type,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    durationSec: options?.durationSec,
    captureSource,
    lowQualityWarning: options?.lowQualityWarning,
    previewUrl: previewUrl || undefined,
  };
}

export function hasLowQualityWarning(attachments: DraftMediaAttachment[]): boolean {
  return attachments.some((a) => a.lowQualityWarning);
}
