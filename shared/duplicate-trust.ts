/** Duplicate & Trust Agent — shared contract */

export type DuplicateClassification =
  | 'likely_unique'
  | 'possible_duplicate'
  | 'high_confidence_duplicate'
  | 'suspicious_low_signal';

export type DuplicateTrustAction =
  | 'submit_normally'
  | 'support_existing'
  | 'submit_needs_verification'
  | 'manual_review'
  | 'hold_reward_eligibility';

export type RewardEligibilityTier = 'full' | 'reduced' | 'hold' | 'none';

export interface DuplicateTrustMatch {
  reportId: string;
  title: string;
  score: number;
  distanceM: number;
  category: string;
  status: string;
  comparisonSummary?: string;
}

export interface DuplicateTrustResult {
  classification: DuplicateClassification;
  recommendedAction: DuplicateTrustAction;
  riskScore: number;
  matches: DuplicateTrustMatch[];
  trustSignals: string[];
  userMessage: string;
  adminRationale: string[];
  comparisonNarrative?: string;
  rewardEligibility: RewardEligibilityTier;
  supportExistingReportId?: string;
}

export interface DuplicateTrustPayload {
  description: string;
  title?: string;
  category: string;
  lat: number;
  lng: number;
  reporterId?: string;
  mediaFingerprints?: { fileName: string; sizeBytes: number; mimeType: string }[];
  lowQualityEvidence?: boolean;
  textOnlyFallback?: boolean;
  reportsToday?: number;
  duplicateAttemptsToday?: number;
}
