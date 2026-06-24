import type { Report } from '@/types';
import { distanceKm } from '@/lib/issue-sorting';

/** Suggest supporting a stronger canonical report instead of filing anew. */
export function findSupportCanonicalNudge(
  report: Report,
  peers: Report[],
): { canonicalReportId: string; similarityScore: number } | null {
  if (report.duplicateOfId) {
    return { canonicalReportId: report.duplicateOfId, similarityScore: 95 };
  }

  let best: { id: string; score: number } | null = null;

  for (const peer of peers) {
    if (peer.id === report.id) continue;
    if (peer.status === 'merged' || peer.status === 'resolved') continue;
    if (peer.category !== report.category) continue;

    const km = distanceKm(
      report.location.lat,
      report.location.lng,
      peer.location.lat,
      peer.location.lng,
    );
    if (km > 0.3) continue;

    const score = Math.round(70 + peer.corroborationCount * 5 - km * 10);
    if (peer.corroborationCount <= report.corroborationCount) continue;
    if (!best || score > best.score) {
      best = { id: peer.id, score };
    }
  }

  return best ? { canonicalReportId: best.id, similarityScore: best.score } : null;
}
