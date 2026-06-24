import { describe, expect, it } from 'vitest';
import { buildSeedReports } from '@/services/mock/seed/reports';
import { seedUsers } from '@/services/mock/seed/users';
import {
  buildVerifyQueue,
  escalationMessage,
  verifyHeroCopy,
} from '@/domain/verify-queue';

describe('verify-queue', () => {
  const reports = buildSeedReports();
  const parent = seedUsers.find((u) => u.id === 'user-parent-1')!;

  it('ranks verifiable opportunities for parent', () => {
    const queue = buildVerifyQueue(reports, parent);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue[0].report.id).toBe('report-003');
    expect(queue[0].distanceKm).toBeGreaterThan(0);
  });

  it('excludes own reports for citizen', () => {
    const citizen = seedUsers.find((u) => u.id === 'user-citizen-1')!;
    const queue = buildVerifyQueue(reports, citizen);
    expect(queue.every((o) => o.report.reporterId !== citizen.id)).toBe(true);
  });

  it('hero copy reflects opportunity count', () => {
    expect(verifyHeroCopy(3).headline).toContain('3 local reports need');
    expect(verifyHeroCopy(1).headline).toContain('1 local report needs');
  });

  it('escalation message when threshold crossed', () => {
    expect(escalationMessage(1, 2)).toMatch(/crew review/i);
    expect(escalationMessage(0, 1)).toMatch(/closer to crew review/i);
  });
});
