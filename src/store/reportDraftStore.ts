import { create } from 'zustand';
import { canSubmitReport } from '@/lib/report-validation';
import {
  clearReportDraft,
  loadReportDraft,
  saveReportDraft,
} from '@/lib/report-draft-persistence';
import { clearMediaFiles } from '@/store/reportMediaFiles';
import {
  DEFAULT_REPORT_DRAFT,
  type DraftMediaAttachment,
  type DuplicateWarning,
  type ReportDraft,
} from '@/types/reporting';

interface ReportDraftState {
  draft: ReportDraft;
  hydrated: boolean;
  setStep: (step: number) => void;
  updateDraft: (partial: Partial<ReportDraft>) => void;
  addMediaAttachment: (attachment: DraftMediaAttachment) => void;
  setDuplicateWarning: (warning?: DuplicateWarning) => void;
  setSubmitted: (reportId: string) => void;
  resetDraft: () => void;
  hydrate: () => void;
  persist: () => void;
}

export const useReportDraftStore = create<ReportDraftState>((set, get) => ({
  draft: { ...DEFAULT_REPORT_DRAFT },
  hydrated: false,

  setStep: (step) => {
    set((s) => ({ draft: { ...s.draft, step } }));
    get().persist();
  },

  updateDraft: (partial) => {
    set((s) => ({ draft: { ...s.draft, ...partial } }));
    get().persist();
  },

  addMediaAttachment: (attachment) => {
    set((s) => ({
      draft: {
        ...s.draft,
        mediaAttachments: [...s.draft.mediaAttachments, attachment],
      },
    }));
    get().persist();
  },

  setDuplicateWarning: (warning) => {
    set((s) => ({ draft: { ...s.draft, duplicateWarning: warning } }));
    get().persist();
  },

  setSubmitted: (reportId) => {
    set((s) => ({ draft: { ...s.draft, submittedReportId: reportId, step: 0 } }));
    clearReportDraft();
  },

  resetDraft: () => {
    clearReportDraft();
    clearMediaFiles();
    set({ draft: { ...DEFAULT_REPORT_DRAFT }, hydrated: true });
  },

  hydrate: () => {
    const loaded = loadReportDraft();
    set({ draft: loaded, hydrated: true });
  },

  persist: () => {
    saveReportDraft(get().draft);
  },
}));

export function selectCanSubmit(state: ReportDraftState): boolean {
  return canSubmitReport(state.draft);
}

export type { ReportDraft, DraftMediaAttachment };
