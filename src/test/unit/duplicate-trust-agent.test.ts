import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeDuplicateTrustLocally } from '@/domain/duplicate-trust-local';
import {
  analyzeDuplicateTrust,
  duplicateTrustToDraftUpdates,
} from '@/services/ai/duplicate-trust-agent';

vi.mock('@/services/ai/agent-client', () => ({
  invokeAgent: vi.fn(),
}));

vi.mock('@/services/ai/gateway-config', () => ({
  isAiGatewayEnabled: vi.fn(() => false),
}));

describe('duplicate trust agent client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns likely unique for distant report locally', async () => {
    const result = await analyzeDuplicateTrust({
      description: 'Streetlight out on far avenue',
      category: 'streetlight',
      lat: 12.8,
      lng: 77.3,
    });
    expect(result.classification).toBe('likely_unique');
    expect(result.recommendedAction).toBe('submit_normally');
  });

  it('returns duplicate support action for MG Road pothole', async () => {
    const result = await analyzeDuplicateTrustLocally({
      description: 'Deep pothole near school crossing dangerous for bikes',
      title: 'Pothole MG Road',
      category: 'pothole',
      lat: 12.9736,
      lng: 77.5956,
    });
    expect(['possible_duplicate', 'high_confidence_duplicate']).toContain(result.classification);
    expect(result.recommendedAction).toBe('support_existing');
    expect(result.matches[0]?.reportId).toBe('report-001');
  });

  it('maps suspicious result to draft updates', () => {
    const updates = duplicateTrustToDraftUpdates({
      classification: 'suspicious_low_signal',
      recommendedAction: 'submit_needs_verification',
      riskScore: 40,
      matches: [],
      trustSignals: ['Very short description'],
      userMessage: 'Need more detail',
      adminRationale: ['Classification: suspicious'],
      rewardEligibility: 'none',
      model: 'mock-rules',
      fallbackUsed: false,
      analyzedAt: new Date().toISOString(),
    });
    expect(updates.suspiciousFlag.flagged).toBe(true);
    expect(updates.suspiciousFlag.requiresVerification).toBe(true);
    expect(updates.rewardEligible).toBe(false);
  });

  it('maps duplicate result to duplicate warning', () => {
    const updates = duplicateTrustToDraftUpdates({
      classification: 'high_confidence_duplicate',
      recommendedAction: 'support_existing',
      riskScore: 85,
      matches: [
        {
          reportId: 'report-001',
          title: 'Pothole',
          score: 85,
          distanceM: 40,
          category: 'pothole',
          status: 'verified',
        },
      ],
      trustSignals: [],
      userMessage: 'Support existing',
      adminRationale: [],
      rewardEligibility: 'reduced',
      supportExistingReportId: 'report-001',
      model: 'mock-rules',
      fallbackUsed: false,
      analyzedAt: new Date().toISOString(),
    });
    expect(updates.duplicateWarning).toEqual({ reportId: 'report-001', score: 85 });
  });
});
