/** In-memory store for draft media File blobs (not persisted to localStorage). */
const fileMap = new Map<string, File>();
const previewMap = new Map<string, string>();

export function storeMediaFile(attachmentId: string, file: File): string {
  fileMap.set(attachmentId, file);
  if (typeof URL.createObjectURL === 'function') {
    const existing = previewMap.get(attachmentId);
    if (existing) URL.revokeObjectURL(existing);
    previewMap.set(attachmentId, URL.createObjectURL(file));
  }
  return previewMap.get(attachmentId) ?? '';
}

export function getMediaFile(attachmentId: string): File | undefined {
  return fileMap.get(attachmentId);
}

export function getMediaPreviewUrl(attachmentId: string): string | undefined {
  return previewMap.get(attachmentId);
}

export function removeMediaFile(attachmentId: string): void {
  const preview = previewMap.get(attachmentId);
  if (preview && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(preview);
  }
  previewMap.delete(attachmentId);
  fileMap.delete(attachmentId);
}

export function clearMediaFiles(): void {
  for (const id of previewMap.keys()) {
    removeMediaFile(id);
  }
  fileMap.clear();
  previewMap.clear();
}
