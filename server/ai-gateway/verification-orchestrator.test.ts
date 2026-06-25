import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuditLog } from './audit-log.ts';
import { resetRateLimits } from './rate-limit.ts';
import { executeAgentInvocation } from './secure-agent-wrapper.ts';
import { planVerificationInvitesCore, recommendVerificationCore } from './verification-orchestrator.ts';

describe('verification orchestrator agent', () => {
  beforeEach(() => {
    clearAuditLog();
    resetRateLimits();
    vi.unstubAllEnvs();
    process.env.AI_PROVIDER = 'mock';
    delete process.env.GROK_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('recommends pending verification issues for a user', async () => {
    const response = await executeAgentInvocation({
      agent: 'verification_orchestrator',
      action: 'recommend',
      trigger: 'unit_test',
      payload: { userId: 'user-parent-1', lat: 12.9716, lng: 77.5946 },
    });

    expect(response.success).toBe(true);
    const recs = response.data?.recommendations as unknown[];
    expect(recs.length).toBeGreaterThan(0);
    const top = response.data?.topRecommendation as Record<string, unknown>;
    expect(top.promptReason).toBeTruthy();
    expect(top.impactMessage).toMatch(/verification/i);
  });

  it('never recommends reporter own report', () => {
    const result = recommendVerificationCore({
      userId: 'user-citizen-1',
      lat: 12.9716,
      lng: 77.5946,
    });
    expect(result.recommendations.every((r) => r.reportId !== 'report-003')).toBe(true);
  });

  it('plans invite candidates for under-confirmed report', async () => {
    const response = await executeAgentInvocation({
      agent: 'verification_orchestrator',
      action: 'plan',
      trigger: 'unit_test',
      payload: { reportId: 'report-003', wardId: 'ward-11' },
    });

    expect(response.success).toBe(true);
    const invites = response.data?.invitations as unknown[];
    expect(invites.length).toBeGreaterThan(0);
    expect(invites.length).toBeLessThanOrEqual(3);
    const ids = (invites as { userId: string }[]).map((i) => i.userId);
    expect(ids).not.toContain('user-citizen-1');
  });

  it('returns empty plan when confidence sufficient', () => {
    const result = planVerificationInvitesCore({
      reportId: 'report-001',
      wardId: 'ward-12',
    });
    expect(result.invitations).toHaveLength(0);
  });

  it('requires userId for recommend', async () => {
    await expect(
      executeAgentInvocation({
        agent: 'verification_orchestrator',
        action: 'recommend',
        trigger: 'unit_test',
        payload: {},
      }),
    ).rejects.toMatchObject({ code: 'INVALID_USER' });
  });
});
