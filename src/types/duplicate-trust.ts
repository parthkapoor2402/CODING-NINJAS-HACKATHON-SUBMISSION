import type {
  DuplicateClassification,
  DuplicateTrustAction,
  DuplicateTrustMatch,
  DuplicateTrustPayload,
  DuplicateTrustResult,
  RewardEligibilityTier,
} from '@shared/duplicate-trust';

export type {
  DuplicateClassification,
  DuplicateTrustAction,
  DuplicateTrustMatch,
  DuplicateTrustPayload,
  DuplicateTrustResult,
  RewardEligibilityTier,
};

export interface DuplicateTrustMetadata extends DuplicateTrustResult {
  auditId?: string;
  requestId?: string;
  model: string;
  fallbackUsed: boolean;
  analyzedAt: string;
}
