import { describe, expect, it } from 'vitest';
import { partitionModerationCases } from '@/domain/admin-moderation-queues';
import { seedSuspiciousCases } from '@/services/mock/seed/admin';

describe('admin-moderation-queues', () => {
  it('U72: partitions report-linked vs abuse cases', () => {
    const { suspicious, abuse } = partitionModerationCases(seedSuspiciousCases);
    expect(suspicious.length).toBeGreaterThan(0);
    expect(abuse.length).toBeGreaterThan(0);
    expect(suspicious.every((c) => c.reportId)).toBe(true);
    expect(abuse.some((c) => !c.reportId)).toBe(true);
    expect(suspicious.map((c) => c.id)).toContain('suspicious-001');
    expect(abuse.map((c) => c.id)).toContain('suspicious-002');
  });
});
