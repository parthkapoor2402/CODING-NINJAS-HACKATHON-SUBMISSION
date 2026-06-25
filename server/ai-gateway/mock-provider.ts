import type { CivicCategory, CivicSeverity } from './validator.ts';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface CategorizeInput {
  description: string;
  categoryHint?: string;
  imageUrl?: string;
}

export interface SeverityInput {
  description: string;
  categoryHint?: string;
  imageUrl?: string;
}

export interface DuplicateInput {
  description: string;
  category: string;
  lat: number;
  lng: number;
}

export interface ModelExecutionResult {
  data: Record<string, unknown>;
  confidence: number | null;
  model: string;
}

export async function mockCategorize(input: CategorizeInput): Promise<ModelExecutionResult> {
  await delay(80);
  const text = input.description.toLowerCase();
  let category: CivicCategory = 'other';
  let confidence = 0.55;

  if (text.includes('pothole') || text.includes('road')) {
    category = 'pothole';
    confidence = 0.91;
  } else if (text.includes('water') || text.includes('leak')) {
    category = 'water_leak';
    confidence = 0.88;
  } else if (text.includes('light')) {
    category = 'streetlight';
    confidence = 0.85;
  } else if (text.includes('garbage') || text.includes('waste')) {
    category = 'garbage';
    confidence = 0.87;
  } else if (input.categoryHint) {
    category = input.categoryHint as CivicCategory;
  }

  return {
    data: { category, confidence },
    confidence,
    model: 'mock-rules',
  };
}

export async function mockEstimateSeverity(input: SeverityInput): Promise<ModelExecutionResult> {
  await delay(60);
  const text = input.description.toLowerCase();
  let severity: CivicSeverity = 'medium';
  let confidence = 0.65;
  let rationale = 'Standard neighborhood issue';

  if (text.includes('dangerous') || text.includes('school')) {
    severity = 'high';
    confidence = 0.82;
    rationale = 'Safety keywords detected';
  }

  return {
    data: { severity, confidence, rationale },
    confidence,
    model: 'mock-rules',
  };
}

export async function mockDetectDuplicateRisk(input: DuplicateInput): Promise<ModelExecutionResult> {
  await delay(70);
  const nearDemo =
    Math.abs(input.lat - 12.9736) < 0.001 && Math.abs(input.lng - 77.5956) < 0.001;
  if (nearDemo) {
    return {
      data: {
        riskScore: 85,
        matches: [{ reportId: 'report-001', score: 85, distanceM: 45 }],
      },
      confidence: 0.85,
      model: 'mock-rules',
    };
  }
  return {
    data: { riskScore: 12, matches: [] },
    confidence: 0.12,
    model: 'mock-rules',
  };
}

export async function mockSummarize(description: string): Promise<ModelExecutionResult> {
  await delay(50);
  const summary = description.length > 80 ? `${description.slice(0, 77)}...` : description;
  return {
    data: { summary },
    confidence: null,
    model: 'mock-rules',
  };
}

export async function mockGenerateCopy(
  description: string,
  _category?: string,
): Promise<ModelExecutionResult> {
  await delay(60);
  const title = description.slice(0, 60);
  return {
    data: { title, summary: description, description },
    confidence: null,
    model: 'mock-rules',
  };
}
