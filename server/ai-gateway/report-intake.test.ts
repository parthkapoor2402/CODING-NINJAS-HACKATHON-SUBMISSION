import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuditLog } from './audit-log.ts';
import { resetRateLimits } from './rate-limit.ts';
import { executeAgentInvocation } from './secure-agent-wrapper.ts';
import { parseModelJson, validateReportIntakeOutput } from './validator.ts';
import * as grokHandlers from './report-intake.ts';

describe('report intake agent', () => {
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

  it('returns valid structured intake for pothole description', async () => {
    const response = await executeAgentInvocation({
      agent: 'report_intake',
      action: 'analyze',
      trigger: 'unit_test',
      payload: { description: 'Large pothole on MG Road near school crossing' },
    });

    expect(response.success).toBe(true);
    expect(response.data?.category).toBe('pothole');
    expect(response.data?.severity).toBe('high');
    expect(Array.isArray(response.data?.safetyCues)).toBe(true);
    expect((response.data?.safetyCues as string[]).length).toBeGreaterThan(0);
    expect(response.data?.explanation).toBeTruthy();
    expect(response.data?.confidence).toMatchObject({
      category: expect.any(Number),
      severity: expect.any(Number),
      overall: expect.any(Number),
    });
  });

  it('handles low-confidence other category safely', () => {
    const result = validateReportIntakeOutput(
      {
        category: 'not_a_category',
        categoryConfidence: 0.2,
        severity: 'low',
        severityConfidence: 0.3,
        suggestedTitle: 'Something',
        summary: 'Vague issue',
        safetyCues: [],
        explanation: 'Unclear details',
      },
      'Vague issue on the street',
    );
    expect(result.category).toBe('other');
    expect(result.confidence.category).toBe(0.2);
    expect(result.confidence.overall).toBeLessThan(0.5);
  });

  it('rejects malformed model JSON', () => {
    expect(() => parseModelJson('not json')).toThrow('MODEL_JSON_MISSING');
  });

  it('falls back to heuristics when live model fails', async () => {
    process.env.AI_PROVIDER = 'grok';
    process.env.GROK_API_KEY = 'test-key';
    vi.spyOn(grokHandlers, 'grokAnalyzeIntake').mockRejectedValue(new Error('GROK down'));

    const response = await executeAgentInvocation({
      agent: 'report_intake',
      action: 'analyze',
      trigger: 'unit_test',
      payload: { description: 'water leak in basement corridor' },
    });

    expect(response.fallbackUsed).toBe(true);
    expect(response.data?.category).toBe('water_leak');
    expect(response.model).toBe('mock-rules');
  });
});
