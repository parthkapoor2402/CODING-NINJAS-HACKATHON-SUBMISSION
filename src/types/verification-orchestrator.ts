import type { VerificationRecommendation } from '@shared/verification-orchestrator';

export interface VerificationOrchestratorMetadata {
  recommendations: VerificationRecommendation[];
  topRecommendation?: VerificationRecommendation;
  capsApplied: { wardDaily: number; perReport: number };
  confidenceSufficientCount: number;
  auditId?: string;
  requestId?: string;
  model: string;
  fallbackUsed: boolean;
  analyzedAt: string;
}
