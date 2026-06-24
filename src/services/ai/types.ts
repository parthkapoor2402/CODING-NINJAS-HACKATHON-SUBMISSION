import type { IssueCategory, Severity } from '@/types';

export interface AIReportInput {
  description: string;
  categoryHint?: IssueCategory;
  imageUrl?: string;
  location?: { lat: number; lng: number };
}

export interface CategorizationResult {
  category: IssueCategory;
  confidence: number;
}

export interface SeverityHint {
  severity: Severity;
  confidence: number;
  rationale?: string;
}

export interface DuplicateCheckInput {
  description: string;
  category: IssueCategory;
  lat: number;
  lng: number;
  imageHash?: string;
}

export interface DuplicateMatch {
  reportId: string;
  score: number;
  distanceM: number;
}

export interface DuplicateRiskResult {
  riskScore: number;
  matches: DuplicateMatch[];
}

export interface AIService {
  categorize(input: AIReportInput): Promise<CategorizationResult>;
  estimateSeverity(input: AIReportInput): Promise<SeverityHint>;
  detectDuplicateRisk(input: DuplicateCheckInput): Promise<DuplicateRiskResult>;
  summarize(description: string): Promise<string>;
}
