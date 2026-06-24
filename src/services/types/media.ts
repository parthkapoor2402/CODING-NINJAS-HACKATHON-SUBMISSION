import type { MediaAsset } from '@/types';

export interface MediaUploadMeta {
  reportId: string;
  type: 'photo' | 'video';
  mimeType: string;
  captureSource: 'camera' | 'gallery' | 'upload';
  durationSec?: number;
}

export interface MediaStorage {
  upload(file: Blob, meta: MediaUploadMeta): Promise<MediaAsset>;
  getById(id: string): Promise<MediaAsset | null>;
  getSignedUrl(id: string): Promise<string>;
}
