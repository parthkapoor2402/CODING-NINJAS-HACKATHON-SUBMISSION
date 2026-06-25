import { describe, expect, it } from 'vitest';
import { buildAdminQueue } from '@/domain/admin-queue-build';
import { triageIssueFromQueueItem } from '@/domain/ops-triage-scoring';
import { cloneSeedReports } from '@/services/mock/seed/reports';
import { getUserById } from '@/services/mock/seed/users';

describe('ops triage scoring', () => {
  const queue = buildAdminQueue(cloneSeedReports(), getUserById);
  const report003 = queue.find((q) => q.report.id === 'report-003')!;

  it('separates urgency and confidence scores', () => {
    const result = triageIssueFromQueueItem(report003, 1);
    expect(result.urgencyScore).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
    expect(result.urgencyScore).not.toBe(result.confidenceScore);
  });

  it('includes score breakdown and suggested actions', () => {
    const result = triageIssueFromQueueItem(report003, 2, false, false);
    expect(result.queuePlacement.scoreBreakdown.length).toBeGreaterThan(0);
    expect(result.suggestedActions.length).toBeGreaterThan(0);
    expect(result.explanation).toMatch(/Urgency/i);
  });

  it('flags urgent tier for high duplicate risk', () => {
    const highDup = { ...report003, duplicateRisk: 90 };
    const result = triageIssueFromQueueItem(highDup, 1);
    expect(result.priorityTier).toBe('urgent');
    expect(result.suggestedActions.some((a) => a.action === 'merge_candidate_review')).toBe(true);
  });
});
