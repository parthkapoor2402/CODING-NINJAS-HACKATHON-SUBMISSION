import { describe, expect, it } from 'vitest';
import {
  duplicateAcknowledgment,
  impactVisibilityMessage,
  shouldShowFamilyChallenge,
  successHeadline,
} from '@/domain/report-success';

describe('report-success', () => {
  it('builds category-aware headline', () => {
    expect(successHeadline('pothole')).toMatch(/pothole/i);
    expect(successHeadline()).toMatch(/civic momentum/i);
  });

  it('returns visibility impact message', () => {
    expect(impactVisibilityMessage()).toMatch(/neighbors on your block/i);
    expect(impactVisibilityMessage()).toMatch(/community proof/i);
  });

  it('acknowledges distinct reports positively', () => {
    const note = duplicateAcknowledgment(undefined);
    expect(note?.tone).toBe('positive');
    expect(note?.title).toMatch(/distinct/i);
  });

  it('cautions when duplicate warning existed at submit', () => {
    const note = duplicateAcknowledgment({ reportId: 'report-001', score: 85 });
    expect(note?.tone).toBe('caution');
  });

  it('shows family challenge for household roles', () => {
    expect(shouldShowFamilyChallenge('parent', true)).toBe(true);
    expect(shouldShowFamilyChallenge('citizen', false)).toBe(false);
  });
});
