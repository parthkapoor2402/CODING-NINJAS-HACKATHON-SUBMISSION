import type { GeoLocation, IssueCategory, Report, ReportAiMetadata, ReportStatus, Severity } from '@/types';
import type { CorroborationResult } from '@/services/mock/mockCorroboration';

export interface CreateReportInput {
  reporterId: string;
  category: IssueCategory;
  description: string;
  severity: Severity;
  location: GeoLocation;
  mediaIds?: string[];
  aiMetadata?: ReportAiMetadata;
}

export interface ReportRepository {
  list(): Promise<Report[]>;
  getById(id: string): Promise<Report | null>;
  findNearby(lat: number, lng: number, radiusM: number): Promise<Report[]>;
  findByReporter(reporterId: string): Promise<Report[]>;
  create(input: CreateReportInput): Promise<Report>;
  updateStatus(id: string, status: ReportStatus): Promise<Report>;
  merge(canonicalId: string, duplicateIds: string[]): Promise<void>;
  corroborate(reportId: string, userId: string): Promise<CorroborationResult>;
  reopen(reportId: string, userId: string): Promise<Report>;
}
