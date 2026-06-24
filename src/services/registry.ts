import type { AIService } from '@/services/ai/types';
import { grokAIService } from '@/services/ai/grokAI';
import { hasGrokApiKey } from '@/services/ai/grok-client';
import { mockAIService } from '@/services/ai/mockAI';
import { createResilientAIService } from '@/services/ai/resilientAI';
import type { MapsProvider } from '@/services/maps/types';
import { mapboxMapsProvider } from '@/services/maps/mapboxMaps';
import { mockMapsProvider } from '@/services/maps/mockMaps';
import type { AuthBackend } from '@/services/types/auth';
import type { BackendAdapter } from '@/services/types/backend';
import type { MediaStorage } from '@/services/types/media';
import type { ReportRepository } from '@/services/types/reports';
import { firebaseBackendAdapter } from '@/services/firebase/adapter';
import { supabaseBackendAdapter } from '@/services/supabase/adapter';
import { mockAuthBackend } from '@/services/mock/mockAuth';
import { mockBackendAdapter } from '@/services/mock/mockBackend';
import { mockMediaStorage } from '@/services/mock/mockMedia';
import { mockReportRepository } from '@/services/mock/mockReports';
import { getIssueUpdatesForReport } from '@/services/mock/mockIssueUpdates';
import { featureFlags } from '@/lib/feature-flags';

function resolveBackend(): BackendAdapter {
  const provider = import.meta.env.VITE_BACKEND_PROVIDER ?? 'mock';
  if (featureFlags.useMocks || provider === 'mock') return mockBackendAdapter;
  if (provider === 'supabase') return supabaseBackendAdapter;
  if (provider === 'firebase') return firebaseBackendAdapter;
  return mockBackendAdapter;
}

function resolveAI(): AIService {
  if (hasGrokApiKey()) {
    return createResilientAIService(grokAIService, mockAIService);
  }
  const provider = import.meta.env.VITE_AI_PROVIDER ?? 'mock';
  if (provider === 'grok') {
    return createResilientAIService(grokAIService, mockAIService);
  }
  return mockAIService;
}

function resolveMaps(): MapsProvider {
  const provider = import.meta.env.VITE_MAPS_PROVIDER ?? 'mock';
  if (provider === 'mapbox' && import.meta.env.VITE_MAPBOX_TOKEN) return mapboxMapsProvider;
  return mockMapsProvider;
}

/** Central service registry — swap implementations via env without touching features */
export const services = {
  auth: mockAuthBackend as AuthBackend,
  reports: mockReportRepository as ReportRepository,
  issueUpdates: { getForReport: getIssueUpdatesForReport },
  media: mockMediaStorage as MediaStorage,
  backend: resolveBackend(),
  ai: resolveAI(),
  maps: resolveMaps(),
} as const;

export type Services = typeof services;
