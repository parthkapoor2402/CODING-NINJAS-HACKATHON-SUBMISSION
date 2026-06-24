import { describe, expect, it } from 'vitest';
import { canSubmitReport, validateDescription, validateTitle } from '@/lib/report-validation';
import { DEFAULT_REPORT_DRAFT } from '@/types/reporting';

describe('report-validation', () => {
  it('U24: empty title', () => {
    expect(validateTitle('')).toMatch(/title/i);
  });

  it('U25: title too short', () => {
    expect(validateTitle('ab')).toMatch(/3 characters/i);
  });

  it('U26: empty description', () => {
    expect(validateDescription('')).toMatch(/describe/i);
  });

  it('U27: description too short', () => {
    expect(validateDescription('short')).toMatch(/10 characters/i);
  });

  it('U28: valid title and description', () => {
    expect(validateTitle('Pothole on Main')).toBeNull();
    expect(validateDescription('Large pothole near the crosswalk.')).toBeNull();
  });

  it('U29: canSubmitReport incomplete', () => {
    expect(canSubmitReport(DEFAULT_REPORT_DRAFT)).toBe(false);
  });

  it('U30: canSubmitReport complete', () => {
    expect(
      canSubmitReport({
        ...DEFAULT_REPORT_DRAFT,
        title: 'Road damage',
        description: 'Deep pothole blocking the bike lane.',
        category: 'pothole',
        location: { lat: 12.97, lng: 77.59 },
        mediaAttachments: [
          {
            id: 'm1',
            type: 'photo',
            fileName: 'a.jpg',
            mimeType: 'image/jpeg',
            sizeBytes: 50_000,
            captureSource: 'gallery',
          },
        ],
      }),
    ).toBe(true);
  });
});
