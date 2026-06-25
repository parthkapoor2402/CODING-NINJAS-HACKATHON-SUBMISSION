import type {
  OpsTriageAction,
  OpsTriageIssueResult,
  OpsTriagePayload,
  OpsTriageQueueExplanation,
  OpsTriageResult,
} from '@shared/ops-triage-copilot';

export type {
  OpsTriageAction,
  OpsTriageIssueResult,
  OpsTriagePayload,
  OpsTriageQueueExplanation,
  OpsTriageResult,
};

export interface OpsTriageMetadata extends OpsTriageResult {
  auditId?: string;
  requestId?: string;
  model: string;
  fallbackUsed: boolean;
  analyzedAt: string;
}
