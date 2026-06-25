import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildSeedReports } from '@/services/mock/seed/reports';
import { seedUsers } from '@/services/mock/seed/users';
import { recommendVerification } from '@/services/ai/verification-orchestrator-agent';

vi.mock('@/services/ai/agent-client', () => ({
  invokeAgent: vi.fn(),
}));

vi.mock('@/services/ai/gateway-config', () => ({
  isAiGatewayEnabled: vi.fn(() => false),
}));

describe('verification orchestrator client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns ranked queue locally when gateway disabled', async () => {
    const parent = seedUsers.find((u) => u.id === 'user-parent-1')!;
    const reports = buildSeedReports();
    const { queue, metadata } = await recommendVerification(
      { userId: parent.id },
      reports,
      parent,
      {
        dismissedIds: [],
        nudgeContext: { history: [], snoozedUntil: {}, recentVerifyCount24h: 0 },
      },
    );
    expect(queue.length).toBeGreaterThan(0);
    expect(metadata.topRecommendation?.reportId).toBe(queue[0].report.id);
    expect(queue[0].promptReason).toBeTruthy();
  });
});
