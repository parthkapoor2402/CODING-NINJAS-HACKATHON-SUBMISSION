import { describe, expect, it } from 'vitest';
import { filterAdminQueue } from '@/domain/admin-queue-filters';
import { buildAdminQueue } from '@/domain/admin-queue-build';
import { cloneSeedReports } from '@/services/mock/seed';
import { getUserById } from '@/services/mock/seed/users';

const queue = buildAdminQueue(cloneSeedReports(), getUserById);

describe('admin-queue-filters', () => {
  it('U67: filters by category', () => {
    const filtered = filterAdminQueue(queue, {
      category: 'water_leak',
      severity: 'all',
      status: 'all',
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.report.category === 'water_leak')).toBe(true);
    expect(filtered.some((item) => item.report.category === 'pothole')).toBe(false);
  });

  it('U68: filters by severity', () => {
    const filtered = filterAdminQueue(queue, {
      category: 'all',
      severity: 'high',
      status: 'all',
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.report.severity === 'high')).toBe(true);
  });

  it('U69: filters by status', () => {
    const filtered = filterAdminQueue(queue, {
      category: 'all',
      severity: 'all',
      status: 'verified',
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.report.status === 'verified')).toBe(true);
  });
});
