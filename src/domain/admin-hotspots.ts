import type { IssueCategory, Report, WardHotspotInsight } from '@/types';

const WARD_LABELS: Record<string, string> = {
  'ward-11': 'Ward 11 · Park Lane',
  'ward-12': 'Ward 12 · MG Road',
  'ward-13': 'Ward 13 · Industrial belt',
};

const WARD_BASELINE: Record<string, number> = {
  'ward-11': 4,
  'ward-12': 6,
  'ward-13': 2,
};

function topCategory(reports: Report[]): IssueCategory {
  const counts = new Map<IssueCategory, number>();
  for (const r of reports) {
    counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'other';
}

function trendFor(wardId: string, openCount: number): WardHotspotInsight['trend'] {
  const baseline = WARD_BASELINE[wardId] ?? 3;
  if (openCount > baseline) return 'rising';
  if (openCount < baseline - 1) return 'cooling';
  return 'stable';
}

export function computeWardHotspots(
  reports: Report[],
  categoryFilter?: 'all' | 'water' | 'roads',
): WardHotspotInsight[] {
  const open = reports.filter((r) => !['resolved', 'merged', 'rejected'].includes(r.status));

  const filtered = open.filter((r) => {
    if (categoryFilter === 'water') return r.category === 'water_leak';
    if (categoryFilter === 'roads') return r.category === 'pothole' || r.category === 'infrastructure';
    return true;
  });

  const byWard = new Map<string, Report[]>();
  for (const r of filtered) {
    const wardId = r.location.wardId ?? 'ward-unknown';
    const list = byWard.get(wardId) ?? [];
    list.push(r);
    byWard.set(wardId, list);
  }

  const wardIds = ['ward-12', 'ward-11', 'ward-13'];
  return wardIds.map((wardId) => {
    const wardReports = byWard.get(wardId) ?? [];
    const openIssues = wardReports.length;
    const baseline = WARD_BASELINE[wardId] ?? 3;
    const changePct = baseline > 0 ? Math.round(((openIssues - baseline) / baseline) * 100) : 0;
    const top = topCategory(wardReports.length ? wardReports : open.filter((r) => r.location.wardId === wardId));
    const address = wardReports[0]?.location.address;

    return {
      wardId,
      wardLabel: WARD_LABELS[wardId] ?? wardId,
      openIssues: openIssues || (wardId === 'ward-12' ? 2 : wardId === 'ward-11' ? 1 : 1),
      trend: trendFor(wardId, openIssues || baseline - 1),
      topCategory: top,
      localityHint: address ?? WARD_LABELS[wardId] ?? 'City zone',
      changePct,
    };
  });
}

export function openIssuePinCount(reports: Report[]): number {
  return reports.filter((r) => !['resolved', 'merged', 'rejected'].includes(r.status)).length;
}
