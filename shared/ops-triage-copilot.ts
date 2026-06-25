/** Ops Triage Copilot — shared contract */

export type OpsPriorityTier = 'urgent' | 'high' | 'normal' | 'monitor';

export type OpsTriageAction =
  | 'review_now'
  | 'request_verification'
  | 'merge_candidate_review'
  | 'assign_field_crew'
  | 'monitor';

export interface OpsTriageScoreFactor {
  factor: string;
  points: number;
  note?: string;
}

export interface OpsTriageSuggestedAction {
  action: OpsTriageAction;
  label: string;
  citation: string;
  draftPayload: Record<string, unknown>;
}

export interface OpsTriageIssueResult {
  reportId: string;
  priorityTier: OpsPriorityTier;
  urgencyScore: number;
  confidenceScore: number;
  explanation: string;
  queuePlacement: {
    suggestedRank: number;
    scoreBreakdown: OpsTriageScoreFactor[];
  };
  suggestedActions: OpsTriageSuggestedAction[];
  hotspotNote?: string;
}

export interface OpsTriageQueueExplanation {
  reportId: string;
  rank: number;
  priorityTier: OpsPriorityTier;
  summary: string;
}

export interface OpsTriagePayload {
  adminId: string;
  reportId?: string;
  wardId?: string;
  duplicateRisk?: number;
  hotspotRising?: boolean;
}

export interface OpsTriageResult {
  issue?: OpsTriageIssueResult;
  queueExplanations: OpsTriageQueueExplanation[];
}
