import type { IssueCategory } from '@/types';

export interface ResponseTimeMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendLabel: string;
}

export interface CategoryTrend {
  category: IssueCategory;
  count: number;
  changePct: number;
}

export interface RewardAbuseFlag {
  id: string;
  userId: string;
  displayName: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PredictiveInsight {
  id: string;
  title: string;
  summary: string;
  confidence: number;
}

export const seedResponseTimeMetrics: ResponseTimeMetric[] = [
  { label: 'Median verify time', value: '18h', trend: 'down', trendLabel: '−4h vs last week' },
  { label: 'Median resolution', value: '4.2d', trend: 'down', trendLabel: '−0.6d vs last month' },
  { label: 'SLA breach rate', value: '6%', trend: 'down', trendLabel: '−2pp' },
];

export const seedCategoryTrends: CategoryTrend[] = [
  { category: 'pothole', count: 14, changePct: 12 },
  { category: 'water_leak', count: 9, changePct: -5 },
  { category: 'streetlight', count: 7, changePct: 3 },
  { category: 'garbage', count: 5, changePct: -8 },
];

export const seedRewardAbuseFlags: RewardAbuseFlag[] = [
  {
    id: 'abuse-flag-001',
    userId: 'user-citizen-1',
    displayName: 'Asha Verma',
    reason: 'Velocity spike — 5 reports in 1 hour',
    severity: 'high',
  },
  {
    id: 'abuse-flag-002',
    userId: 'user-citizen-1',
    displayName: 'Asha Verma',
    reason: 'Duplicate cluster farming attempt',
    severity: 'medium',
  },
];

export const seedPredictiveInsights: PredictiveInsight[] = [
  {
    id: 'insight-001',
    title: 'Ward 12 pothole cluster',
    summary: 'Likely 3–5 new pothole reports near MG Road in the next 7 days.',
    confidence: 82,
  },
  {
    id: 'insight-002',
    title: 'Water leak seasonality',
    summary: 'Pipe leaks typically rise 15% after heavy rain — prep Ward 11 crew.',
    confidence: 71,
  },
];
