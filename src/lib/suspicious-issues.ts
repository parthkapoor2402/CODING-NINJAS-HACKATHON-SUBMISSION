import { seedSuspiciousCases } from '@/services/mock/seed/admin';

export function getSuspiciousReasonForReport(reportId: string): string | null {
  const match = seedSuspiciousCases.find(
    (c) => c.reportId === reportId && c.status !== 'dismissed',
  );
  return match?.reason ?? null;
}
