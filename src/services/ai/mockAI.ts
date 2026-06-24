import type { AIService } from '@/services/ai/types';
import { delay } from '@/utils/format';

export const mockAIService: AIService = {
  async categorize(input) {
    await delay(400);
    const text = input.description.toLowerCase();
    if (text.includes('pothole') || text.includes('road')) {
      return { category: 'pothole', confidence: 0.91 };
    }
    if (text.includes('water') || text.includes('leak')) {
      return { category: 'water_leak', confidence: 0.88 };
    }
    if (text.includes('light')) {
      return { category: 'streetlight', confidence: 0.85 };
    }
    if (text.includes('garbage') || text.includes('waste')) {
      return { category: 'garbage', confidence: 0.87 };
    }
    return { category: input.categoryHint ?? 'other', confidence: 0.55 };
  },

  async estimateSeverity(input) {
    await delay(300);
    const text = input.description.toLowerCase();
    if (text.includes('dangerous') || text.includes('school')) {
      return { severity: 'high', confidence: 0.82, rationale: 'Safety keywords detected' };
    }
    return { severity: 'medium', confidence: 0.65 };
  },

  async detectDuplicateRisk(input) {
    await delay(350);
    // Deterministic demo: high risk near MG Road junction
    const nearDemo =
      Math.abs(input.lat - 12.9736) < 0.001 && Math.abs(input.lng - 77.5956) < 0.001;
    if (nearDemo) {
      return {
        riskScore: 85,
        matches: [{ reportId: 'report-001', score: 85, distanceM: 45 }],
      };
    }
    return { riskScore: 12, matches: [] };
  },

  async summarize(description) {
    await delay(300);
    return description.length > 80 ? `${description.slice(0, 77)}...` : description;
  },
};
