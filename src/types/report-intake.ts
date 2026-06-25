import type { IssueCategory, Severity } from '@/types';

export interface ReportIntakeConfidence {
  category: number;
  severity: number;
  overall: number;
}

/** Machine-readable intake output stored on draft and passed to downstream agents. */
export interface ReportIntakeMetadata {
  auditId?: string;
  requestId?: string;
  model: string;
  fallbackUsed: boolean;
  analyzedAt: string;
  category: IssueCategory;
  severity: Severity;
  suggestedTitle: string;
  summary: string;
  safetyCues: string[];
  confidence: ReportIntakeConfidence;
  explanation: string;
  categoryRationale?: string;
  severityRationale?: string;
}

export interface ReportIntakePayload {
  description: string;
  categoryHint?: IssueCategory;
  imageUrl?: string;
  hasVideo?: boolean;
  location?: { lat: number; lng: number; wardId?: string };
}
