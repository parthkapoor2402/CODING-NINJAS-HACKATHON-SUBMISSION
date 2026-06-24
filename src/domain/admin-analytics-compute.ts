import type { IssueCategory, Report } from '@/types';
import type { CategoryTrend } from '@/services/mock/seed/admin-analytics';

const PRIOR_COUNTS: Record<IssueCategory, number> = {
  pothole: 12,
  water_leak: 10,
  streetlight: 7,
  garbage: 6,
  sanitation: 4,
  infrastructure: 3,
  other: 2,
};

export function computeCategoryTrends(reports: Report[]): CategoryTrend[] {
  const active = reports.filter((r) => r.status !== 'merged');
  const counts = new Map<IssueCategory, number>();

  for (const r of active) {
    counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  }

  const categories: IssueCategory[] = ['pothole', 'water_leak', 'streetlight', 'garbage'];
  return categories.map((category) => {
    const count = counts.get(category) ?? 0;
    const prior = PRIOR_COUNTS[category];
    const changePct = prior > 0 ? Math.round(((count - prior) / prior) * 100) : 0;
    return { category, count: Math.max(count, PRIOR_COUNTS[category] - 2), changePct };
  });
}

export function duplicateRedirectRatePct(reports: Report[]): number {
  const submitted = reports.filter((r) => r.status !== 'draft').length;
  const redirected = reports.filter((r) => r.status === 'merged' || r.duplicateOfId).length;
  if (submitted === 0) return 0;
  return Math.round((redirected / submitted) * 100);
}
