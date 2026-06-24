import { beforeEach, describe, expect, it } from 'vitest';
import { resetMockCorroboration } from '@/services/mock/mockCorroboration';
import { mockReportRepository, resetMockReports } from '@/services/mock/mockReports';

describe('corroboration', () => {
  beforeEach(() => {
    resetMockReports();
    resetMockCorroboration();
  });

  it('U41: first support succeeds — corroborationCount increments', async () => {
    const before = (await mockReportRepository.getById('report-003'))!;
    const countBefore = before.corroborationCount;
    const result = await mockReportRepository.corroborate('report-003', 'user-parent-1');
    expect(result.ok).toBe(true);
    expect(result.report?.corroborationCount).toBe(countBefore + 1);
  });

  it('U42: repeat support same user — rejected, no double credit', async () => {
    const first = await mockReportRepository.corroborate('report-003', 'user-parent-1');
    expect(first.ok).toBe(true);
    const countAfterFirst = first.report!.corroborationCount;
    const second = await mockReportRepository.corroborate('report-003', 'user-parent-1');
    expect(second.ok).toBe(false);
    expect(second.error).toBe('already_supported');
    const after = await mockReportRepository.getById('report-003');
    expect(after?.corroborationCount).toBe(countAfterFirst);
  });

  it('U43: support own report — rejected', async () => {
    const result = await mockReportRepository.corroborate('report-003', 'user-citizen-1');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('own_report');
  });
});
