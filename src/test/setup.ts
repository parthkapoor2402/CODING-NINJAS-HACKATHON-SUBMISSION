import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';
import { resetMockAuthSession } from '@/services/mock/mockAuth';
import { resetMockReports } from '@/services/mock/mockReports';
import { resetMockCorroboration } from '@/services/mock/mockCorroboration';
import { resetMockIssueUpdates } from '@/services/mock/mockIssueUpdates';
import { resetMockRedemptions } from '@/services/mock/mockRedemptions';
import { resetMockAdmin } from '@/services/mock/mockAdmin';
import { resetMockResolutionProofs } from '@/services/mock/mockResolutionProofs';
import { resetMockFieldWorkerUpdates } from '@/services/mock/mockFieldWorkerUpdates';

beforeEach(() => {
  resetMockReports();
  resetMockCorroboration();
  resetMockIssueUpdates();
  resetMockRedemptions();
  resetMockAuthSession();
  resetMockAdmin();
  resetMockResolutionProofs();
  resetMockFieldWorkerUpdates();
});
