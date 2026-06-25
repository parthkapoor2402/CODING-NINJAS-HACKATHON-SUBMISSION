import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuditLog, getAuditEntries } from './audit-log.ts';
import { resetRateLimits } from './rate-limit.ts';
import { executeAgentInvocation } from './secure-agent-wrapper.ts';
import { parseModelJson, validateCategorizeOutput } from './validator.ts';
import { sanitizePlainText } from './sanitizer.ts';
import * as grokHandlers from './grok-handlers.ts';

describe('ai-gateway validator', () => {
  it('rejects malformed JSON from model output', () => {
    expect(() => parseModelJson('not json at all')).toThrow('MODEL_JSON_MISSING');
    expect(() => parseModelJson('{ category: pothole }')).toThrow('MODEL_JSON_INVALID');
  });

  it('normalizes categorize output with safe defaults', () => {
    const result = validateCategorizeOutput({ category: 'not_real', confidence: 4 });
    expect(result.category).toBe('other');
    expect(result.confidence).toBe(1);
  });
});

describe('ai-gateway sanitizer', () => {
  it('strips unsafe HTML from text', () => {
    const cleaned = sanitizePlainText('<script>alert(1)</script> Pothole <b>here</b>');
    expect(cleaned).not.toContain('<');
    expect(cleaned).toContain('Pothole');
  });
});

describe('secure agent wrapper', () => {
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

  it('executes report_intake.categorize and writes audit entry', async () => {
    const response = await executeAgentInvocation({
      agent: 'report_intake',
      action: 'categorize',
      trigger: 'unit_test',
      payload: { description: 'Large pothole on MG Road' },
      actor: { id: 'user-1', role: 'citizen' },
    });

    expect(response.success).toBe(true);
    expect(response.data?.category).toBe('pothole');
    expect(response.fallbackUsed).toBe(false);
    expect(response.humanOverrideRequired).toBe(false);
    expect(getAuditEntries()).toHaveLength(1);
    expect(getAuditEntries()[0]?.agent).toBe('report_intake');
    expect(getAuditEntries()[0]?.sanitizedInputSummary).toContain('MG Road');
  });

  it('falls back to mock rules when live model fails', async () => {
    process.env.AI_PROVIDER = 'grok';
    process.env.GROK_API_KEY = 'test-key';
    vi.spyOn(grokHandlers, 'grokCategorize').mockRejectedValue(new Error('GROK down'));

    const response = await executeAgentInvocation({
      agent: 'report_intake',
      action: 'categorize',
      trigger: 'unit_test',
      payload: { description: 'water leak near school' },
    });

    expect(response.success).toBe(true);
    expect(response.fallbackUsed).toBe(true);
    expect(response.model).toBe('mock-rules');
    expect(response.data?.category).toBe('water_leak');
  });

  it('marks duplicate_trust as human override required', async () => {
    const response = await executeAgentInvocation({
      agent: 'duplicate_trust',
      action: 'detect_risk',
      trigger: 'unit_test',
      payload: {
        description: 'pothole',
        category: 'pothole',
        lat: 12.9736,
        lng: 77.5956,
      },
    });

    expect(response.humanOverrideRequired).toBe(true);
    expect(response.data?.riskScore).toBeGreaterThan(50);
  });

  it('enforces rate limits on repeated invocations', async () => {
    process.env.AI_GATEWAY_RATE_LIMIT_PER_MIN = '2';

    const invoke = () =>
      executeAgentInvocation({
        agent: 'report_intake',
        action: 'summarize',
        trigger: 'rate_test',
        payload: { description: 'short issue' },
        actor: { id: 'heavy-user', role: 'citizen' },
      });

    await invoke();
    await invoke();
    await expect(invoke()).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });
});
