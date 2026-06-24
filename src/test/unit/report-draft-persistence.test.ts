import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearReportDraft,
  loadReportDraft,
  saveReportDraft,
} from '@/lib/report-draft-persistence';
import { DEFAULT_REPORT_DRAFT, REPORT_DRAFT_STORAGE_KEY } from '@/types/reporting';

describe('report-draft-persistence', () => {
  beforeEach(() => {
    clearReportDraft();
  });

  it('U31: saveDraft writes to localStorage', () => {
    saveReportDraft({ ...DEFAULT_REPORT_DRAFT, title: 'Saved title' });
    expect(localStorage.getItem(REPORT_DRAFT_STORAGE_KEY)).toContain('Saved title');
  });

  it('U32: loadDraft restores fields', () => {
    saveReportDraft({
      ...DEFAULT_REPORT_DRAFT,
      title: 'Restored',
      category: 'garbage',
      step: 2,
    });
    const loaded = loadReportDraft();
    expect(loaded.title).toBe('Restored');
    expect(loaded.category).toBe('garbage');
    expect(loaded.step).toBe(2);
  });

  it('U33: clearDraft removes storage', () => {
    saveReportDraft({ ...DEFAULT_REPORT_DRAFT, title: 'Temp' });
    clearReportDraft();
    expect(localStorage.getItem(REPORT_DRAFT_STORAGE_KEY)).toBeNull();
  });
});
