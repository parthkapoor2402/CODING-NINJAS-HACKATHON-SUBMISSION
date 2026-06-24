export interface AbuseAssessmentInput {
  reportsLastHour: number;
  duplicateAttempts: number;
  existingAbuseFlags: string[];
}

export interface AbuseAssessmentResult {
  rewardsFrozen: boolean;
  eligibilityMultiplier: number;
  newFlags: string[];
}

const VELOCITY_THRESHOLD = 5;
const DUPLICATE_ABUSE_THRESHOLD = 3;

export function assessAbuseEligibility(input: AbuseAssessmentInput): AbuseAssessmentResult {
  const newFlags: string[] = [];

  if (input.reportsLastHour >= VELOCITY_THRESHOLD) {
    newFlags.push('velocity_spike');
  }
  if (input.duplicateAttempts >= DUPLICATE_ABUSE_THRESHOLD) {
    newFlags.push('duplicate_abuse');
  }

  const rewardsFrozen = newFlags.includes('velocity_spike');
  let eligibilityMultiplier = 1;
  if (newFlags.includes('duplicate_abuse')) {
    eligibilityMultiplier = 0.5;
  }

  return {
    rewardsFrozen,
    eligibilityMultiplier,
    newFlags: newFlags.filter((f) => !input.existingAbuseFlags.includes(f)),
  };
}
