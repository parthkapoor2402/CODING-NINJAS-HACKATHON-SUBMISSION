import type { MediaStorage, MediaUploadMeta } from '@/services/types/media';
import type { MediaAsset } from '@/types';
import { seedMedia } from '@/services/mock/seed';
import { delay } from '@/utils/format';

const mediaStore: MediaAsset[] = [...seedMedia];

export const mockMediaStorage: MediaStorage = {
  async upload(file: Blob, meta: MediaUploadMeta): Promise<MediaAsset> {
    await delay(250);
    const asset: MediaAsset = {
      id: `media-${Date.now()}`,
      reportId: meta.reportId,
      type: meta.type,
      url:
        typeof URL.createObjectURL === 'function'
          ? URL.createObjectURL(file)
          : `blob:mock-${Date.now()}`,
      mimeType: meta.mimeType,
      sizeBytes: file.size,
      durationSec: meta.durationSec,
      captureSource: meta.captureSource,
      createdAt: new Date().toISOString(),
    };
    mediaStore.push(asset);
    return asset;
  },

  async getById(id: string) {
    await delay(50);
    return mediaStore.find((m) => m.id === id) ?? null;
  },

  async getSignedUrl(id: string) {
    const asset = mediaStore.find((m) => m.id === id);
    if (!asset) throw new Error(`Media ${id} not found`);
    return asset.url;
  },
};
