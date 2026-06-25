import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuditLog } from './audit-log.ts';
import { resetRateLimits } from './rate-limit.ts';
import { executeAgentInvocation } from './secure-agent-wrapper.ts';
import { suggestOpsTriageCore } from './ops-triage-copilot.ts';

describe('ops triage copilot agent', () => {
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

  it('returns issue triage with priority tier and actions', async () => {
    const response = await executeAgentInvocation({
      agent: 'ops_triage_copilot',
      action: 'suggest',
      trigger: 'unit_test',
      payload: { adminId: 'user-admin-1', reportId: 'report-003' },
      actor: { id: 'user-admin-1', role: 'admin' },
    });

    expect(response.success).toBe(true);
    expect(response.humanOverrideRequired).toBe(true);
    const issue = response.data?.issue as Record<string, unknown>;
    expect(issue.priorityTier).toBeTruthy();
    expect(issue.urgencyScore).toBeTypeOf('number');
    expect(issue.confidenceScore).toBeTypeOf('number');
    expect(issue.explanation).toBeTruthy();
    expect((issue.suggestedActions as unknown[]).length).toBeGreaterThan(0);
  });

  it('returns queue explanations without reportId', () => {
    const result = suggestOpsTriageCore({ adminId: 'user-admin-1' });
    expect(result.queueExplanations.length).toBeGreaterThan(0);
    expect(result.issue).toBeUndefined();
  });

  it('suggests verification for under-confirmed report', () => {
    const result = suggestOpsTriageCore({
      adminId: 'user-admin-1',
      reportId: 'report-003',
    });
    const actions = result.issue?.suggestedActions.map((a) => a.action) ?? [];
    expect(actions).toContain('request_verification');
  });

  it('requires adminId', async () => {
    await expect(
      executeAgentInvocation({
        agent: 'ops_triage_copilot',
        action: 'suggest',
        trigger: 'unit_test',
        payload: {},
      }),
    ).rejects.toMatchObject({ code: 'INVALID_ADMIN' });
  });
});
