import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeReportIntakeLocally } from '@/domain/report-intake-heuristics';
import { analyzeReportIntake, intakeToSuggestions } from '@/services/ai/report-intake-agent';
import * as agentClient from '@/services/ai/agent-client';
import * as gatewayConfig from '@/services/ai/gateway-config';

describe('report intake agent (client)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('local heuristics return structured intake with explanation', () => {
    const intake = analyzeReportIntakeLocally({
      description: 'Dangerous pothole near school gate on Main Road',
    });
    expect(intake.category).toBe('pothole');
    expect(intake.severity).toBe('high');
    expect(intake.safetyCues.length).toBeGreaterThan(0);
    expect(intake.explanation).toContain('pothole');
    expect(intake.confidence.overall).toBeGreaterThan(0);
  });

  it('maps intake to UI suggestions', () => {
    const intake = analyzeReportIntakeLocally({
      description: 'Garbage pile blocking sidewalk',
    });
    const suggestions = intakeToSuggestions(intake);
    expect(suggestions.category).toBe('garbage');
    expect(suggestions.intakeMetadata).toBe(intake);
    expect(suggestions.explanation).toBeTruthy();
  });

  it('uses gateway response when available', async () => {
    vi.spyOn(gatewayConfig, 'isAiGatewayEnabled').mockReturnValue(true);
    vi.spyOn(agentClient, 'invokeAgent').mockResolvedValue({
      requestId: 'req_1',
      auditId: 'audit_1',
      agent: 'report_intake',
      action: 'analyze',
      success: true,
      data: {
        category: 'streetlight',
        severity: 'medium',
        suggestedTitle: 'Broken streetlight',
        summary: 'Light out on Park Lane',
        safetyCues: ['Visibility or lighting concern'],
        confidence: { category: 0.9, severity: 0.7, overall: 0.8 },
        explanation: 'Lighting keywords matched.',
      },
      confidence: 0.8,
      fallbackUsed: false,
      humanOverrideRequired: false,
      model: 'grok-vision',
      latencyMs: 120,
    });

    const intake = await analyzeReportIntake({
      description: 'Street light not working on Park Lane',
    });

    expect(intake.category).toBe('streetlight');
    expect(intake.auditId).toBe('audit_1');
    expect(intake.safetyCues).toContain('Visibility or lighting concern');
  });

  it('falls back locally when gateway returns empty data', async () => {
    vi.spyOn(gatewayConfig, 'isAiGatewayEnabled').mockReturnValue(true);
    vi.spyOn(agentClient, 'invokeAgent').mockResolvedValue({
      requestId: 'req_2',
      auditId: 'audit_2',
      agent: 'report_intake',
      action: 'analyze',
      success: true,
      data: null,
      confidence: null,
      fallbackUsed: true,
      humanOverrideRequired: false,
      model: 'grok-vision',
      latencyMs: 50,
    });

    const intake = await analyzeReportIntake({ description: 'Pothole on road' });
    expect(intake.category).toBe('pothole');
    expect(intake.model).toBe('mock-rules');
  });
});
