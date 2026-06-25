import type { IssueCategory, Severity } from '@/types';
import type { GeoLocation } from '@/types';
import type { ReportIntakeMetadata } from '@/types/report-intake';

export const REPORT_DRAFT_STORAGE_KEY = 'civic-report-draft-v1';

export interface DraftMediaAttachment {
  id: string;
  type: 'photo' | 'video';
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationSec?: number;
  captureSource: 'camera' | 'gallery' | 'upload';
  lowQualityWarning?: boolean;
  previewUrl?: string;
}

export interface AISuggestions {
  category?: IssueCategory;
  categoryConfidence?: number;
  severity?: Severity;
  severityConfidence?: number;
  severityRationale?: string;
  summary?: string;
  suggestedTitle?: string;
  safetyCues?: string[];
  explanation?: string;
  intakeMetadata?: ReportIntakeMetadata;
}

export interface SuspiciousFlag {
  flagged: boolean;
  reasons: string[];
  requiresVerification: boolean;
  rewardEligible: boolean;
}

export type AIStatus = 'idle' | 'loading' | 'suggestion' | 'unavailable';

export interface DuplicateWarning {
  reportId: string;
  score: number;
}

export interface ReportDraft {
  title: string;
  description: string;
  category?: IssueCategory;
  severity: Severity;
  location?: GeoLocation;
  mediaAttachments: DraftMediaAttachment[];
  mediaIds: string[];
  step: number;
  duplicateWarning?: DuplicateWarning;
  aiStatus: AIStatus;
  aiSuggestion?: { category?: IssueCategory; severity?: Severity };
  aiSuggestions?: AISuggestions;
  reportIntake?: ReportIntakeMetadata;
  suspiciousFlag?: SuspiciousFlag;
  textOnlyFallback?: boolean;
  rewardEligible?: boolean;
  submittedReportId?: string;
  cameraPermissionDenied?: boolean;
  locationPermissionDenied?: boolean;
}

export interface PersistedReportDraft {
  title: string;
  description: string;
  category?: IssueCategory;
  severity: Severity;
  location?: GeoLocation;
  mediaAttachments: DraftMediaAttachment[];
  step: number;
  duplicateWarning?: DuplicateWarning;
  aiStatus: AIStatus;
  aiSuggestion?: { category?: IssueCategory; severity?: Severity };
}

export const DEFAULT_REPORT_DRAFT: ReportDraft = {
  title: '',
  description: '',
  severity: 'medium',
  mediaAttachments: [],
  mediaIds: [],
  step: 0,
  aiStatus: 'idle',
};

export const ISSUE_CATEGORIES: { id: IssueCategory; label: string }[] = [
  { id: 'pothole', label: 'Pothole / road' },
  { id: 'water_leak', label: 'Water leak' },
  { id: 'streetlight', label: 'Streetlight' },
  { id: 'garbage', label: 'Garbage / waste' },
  { id: 'sanitation', label: 'Sanitation' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'other', label: 'Other' },
];

export const REPORT_STEPS = ['Evidence', 'Details', 'Location', 'Review'] as const;
