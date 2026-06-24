export type UserRole =
  | 'citizen'
  | 'youth'
  | 'parent'
  | 'moderator'
  | 'admin'
  | 'field_worker';

export type ReportStatus =
  | 'draft'
  | 'submitted'
  | 'pending_verification'
  | 'verified'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'merged';

export type IssueCategory =
  | 'pothole'
  | 'water_leak'
  | 'streetlight'
  | 'garbage'
  | 'sanitation'
  | 'infrastructure'
  | 'other';

export type Severity = 'low' | 'medium' | 'high';

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  accuracyM?: number;
  wardId?: string;
}

export interface TrustSnapshot {
  trustScore: number;
  contributionScore: number;
  verificationScore: number;
  duplicateRisk: number;
  abuseFlags: string[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  trust: TrustSnapshot;
  youthProfileId?: string;
  familyHubId?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface MediaAsset {
  id: string;
  reportId: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  sizeBytes: number;
  durationSec?: number;
  captureSource: 'camera' | 'gallery' | 'upload';
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  category: IssueCategory;
  description: string;
  severity: Severity;
  status: ReportStatus;
  location: GeoLocation;
  mediaIds: string[];
  duplicateOfId?: string;
  corroborationCount: number;
  assignedWorkerId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  reopenedAt?: string;
}

export type IssueUpdateKind = 'system' | 'community' | 'crew' | 'moderation';

export interface IssueUpdate {
  id: string;
  reportId: string;
  kind: IssueUpdateKind;
  message: string;
  createdAt: string;
  actorLabel?: string;
}

export interface RewardEvent {
  id: string;
  userId: string;
  type: string;
  points: number;
  badgeId?: string;
  reportId?: string;
  verified: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

export type SuspiciousCaseKind =
  | 'duplicate'
  | 'media_quality'
  | 'velocity'
  | 'reward_farming';

export interface SuspiciousCase {
  id: string;
  reportId?: string;
  userId?: string;
  reason: string;
  riskScore: number;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  kind?: SuspiciousCaseKind;
  createdAt: string;
}

export type ResolutionProofStatus = 'pending_review' | 'approved' | 'rejected';

export interface ResolutionProof {
  id: string;
  reportId: string;
  workerId: string;
  beforeMediaId?: string;
  afterMediaId?: string;
  notes?: string;
  status: ResolutionProofStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedByAdminId?: string;
}

export interface FieldWorkerUpdate {
  id: string;
  reportId: string;
  workerId: string;
  message: string;
  createdAt: string;
  kind: 'status' | 'note' | 'proof_submitted';
}

export interface AdminDashboardSnapshot {
  openQueue: number;
  suspiciousOpen: number;
  resolvedLast7d: number;
  medianVerifyHours: number;
  slaAtRisk: number;
  duplicateClusters: number;
  assignedInProgress: number;
}

export interface WardHotspotInsight {
  wardId: string;
  wardLabel: string;
  openIssues: number;
  trend: 'rising' | 'stable' | 'cooling';
  topCategory: IssueCategory;
  localityHint: string;
  changePct: number;
}

export interface AdminQueueItem {
  report: Report;
  reporter: User;
  priorityScore: number;
  duplicateRisk: number;
  slaDueAt?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
  isGuest?: boolean;
}
