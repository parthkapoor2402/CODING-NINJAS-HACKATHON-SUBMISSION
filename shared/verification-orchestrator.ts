/** Verification Orchestrator — shared contract */

export const DEFAULT_CONFIRMATION_THRESHOLD = 2;

export interface VerificationRecommendPayload {
  userId: string;
  wardId?: string;
  lat?: number;
  lng?: number;
  dismissedReportIds?: string[];
  snoozedReportIds?: string[];
  recentVerifyCount24h?: number;
  recentNudges24h?: number;
  supportedReportIds?: string[];
}

export interface VerificationPlanPayload {
  reportId: string;
  wardId: string;
  threshold?: number;
}

export interface VerificationRecommendation {
  reportId: string;
  rankScore: number;
  distanceKm: number;
  confirmationsNeeded: number;
  nearYouLabel: string;
  confirmationsLabel: string;
  promptReason: string;
  impactMessage: string;
  suppressed: boolean;
  suppressionReason?: string;
}

export interface VerificationInviteCandidate {
  userId: string;
  score: number;
  reason: string;
  deepLink: string;
}

export interface VerificationOrchestratorResult {
  recommendations: VerificationRecommendation[];
  topRecommendation?: VerificationRecommendation;
  invitations?: VerificationInviteCandidate[];
  capsApplied: { wardDaily: number; perReport: number };
  confidenceSufficientCount: number;
}
