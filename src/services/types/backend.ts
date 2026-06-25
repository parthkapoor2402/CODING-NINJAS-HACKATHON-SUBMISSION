import type {
  AdminDashboardSnapshot,
  AdminQueueItem,
  Badge,
  FieldWorkerUpdate,
  Report,
  ResolutionProof,
  RewardEvent,
  SuspiciousCase,
  User,
  WardHotspotInsight,
} from '@/types';
import type { RewardCatalogItem } from '@/domain/reward-catalog';
import type {
  CategoryTrend,
  PredictiveInsight,
  ResponseTimeMetric,
  RewardAbuseFlag,
} from '@/services/mock/seed/admin-analytics';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  contributionScore: number;
  trustScore: number;
}

export interface BackendAdapter {
  users: {
    list(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
  };
  rewards: {
    listByUser(userId: string): Promise<RewardEvent[]>;
    listBadges(): Promise<Badge[]>;
    listCatalog(): Promise<RewardCatalogItem[]>;
    listLeaderboard(): Promise<LeaderboardEntry[]>;
  };
  admin: {
    getQueue(): Promise<AdminQueueItem[]>;
    getDashboardSnapshot(): Promise<AdminDashboardSnapshot>;
    getSuspiciousCases(): Promise<SuspiciousCase[]>;
    getFieldWorkers(): Promise<User[]>;
    assignWorker(reportId: string, workerId: string, reason?: string): Promise<Report>;
    reviewSuspiciousCase(caseId: string): Promise<SuspiciousCase>;
    dismissSuspiciousCase(caseId: string): Promise<SuspiciousCase>;
    resolveSuspiciousCase(caseId: string): Promise<SuspiciousCase>;
    mergeDuplicateReport(canonicalId: string, duplicateId: string): Promise<Report | null>;
    overrideReportStatus(
      reportId: string,
      status: 'verified' | 'rejected' | 'acknowledged',
      reason?: string,
    ): Promise<Report>;
    recordModerationNote(reportId: string, message: string): Promise<void>;
    getResponseTimeMetrics(): Promise<ResponseTimeMetric[]>;
    getCategoryTrends(): Promise<CategoryTrend[]>;
    getRewardAbuseFlags(): Promise<RewardAbuseFlag[]>;
    getPredictiveInsights(): Promise<PredictiveInsight[]>;
    getHotspotInsights(categoryFilter?: 'all' | 'water' | 'roads'): Promise<WardHotspotInsight[]>;
    getOpenIssuePinCount(): Promise<number>;
    getDuplicateRedirectRate(): Promise<number>;
    getResolutionProof(reportId: string): Promise<ResolutionProof | null>;
    reviewResolutionProof(
      proofId: string,
      action: 'approve' | 'reject',
      adminId: string,
    ): Promise<ResolutionProof>;
    getFieldWorkerUpdates(reportId: string): Promise<FieldWorkerUpdate[]>;
  };
}
