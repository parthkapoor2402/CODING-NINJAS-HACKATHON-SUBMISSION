import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildAdminQueue } from '@/domain/admin-queue-build';
import { cloneSeedReports } from '@/services/mock/seed/reports';
import { getUserById } from '@/services/mock/seed/users';
import { suggestOpsTriage } from '@/services/ai/ops-triage-copilot-agent';

vi.mock('@/services/ai/agent-client', () => ({
  invokeAgent: vi.fn(),
}));

vi.mock('@/services/ai/gateway-config', () => ({
  isAiGatewayEnabled: vi.fn(() => false),
}));

describe('ops triage copilot client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns local triage metadata for report', async () => {
    const queue = buildAdminQueue(cloneSeedReports(), getUserById);
    const meta = await suggestOpsTriage(
      { adminId: 'user-admin-1', reportId: 'report-003' },
      queue,
    );
    expect(meta.issue?.reportId).toBe('report-003');
    expect(meta.issue?.priorityTier).toBeTruthy();
    expect(meta.queueExplanations.length).toBeGreaterThan(0);
  });
});
