/**
 * Feature flags for progressive rollout of advanced modules.
 * Toggle via env or hardcoded defaults for MVP demo reliability.
 */

import { hasGrokApiKey } from '@/services/ai/grok-client';

const envBool = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
};

export const featureFlags = {
  /** Use mock adapters for backend, AI, and maps */
  useMocks: envBool('VITE_USE_MOCKS', true),

  /** Live Grok AI categorization and duplicate hints */
  aiAssist: hasGrokApiKey() || (import.meta.env.VITE_AI_PROVIDER ?? 'mock') === 'grok',

  /** Live map provider (Mapbox/Google) */
  liveMaps: import.meta.env.VITE_MAPS_PROVIDER !== 'mock',

  /** Hotspot prediction heatmap (Phase 2) */
  hotspotPrediction: false,

  /** Partner rewards redemption */
  partnerRewards: false,

  /** Youth supervised mode UI */
  youthMode: true,

  /** Offline report draft queue */
  offlineQueue: false,

  /** PWA install shell */
  pwaShell: false,

  /** Force gallery-only media (demo fallback) */
  forceGalleryOnly: envBool('VITE_FORCE_GALLERY_ONLY', false),

  /** Realtime status subscriptions */
  realtimeUpdates: false,

  /** Admin bulk actions */
  adminBulkActions: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
