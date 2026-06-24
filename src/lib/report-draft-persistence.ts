import {
  DEFAULT_REPORT_DRAFT,
  REPORT_DRAFT_STORAGE_KEY,
  type PersistedReportDraft,
  type ReportDraft,
} from '@/types/reporting';

export function toPersistedDraft(draft: ReportDraft): PersistedReportDraft {
  return {
    title: draft.title,
    description: draft.description,
    category: draft.category,
    severity: draft.severity,
    location: draft.location,
    mediaAttachments: draft.mediaAttachments,
    step: draft.step,
    duplicateWarning: draft.duplicateWarning,
    aiStatus: draft.aiStatus,
    aiSuggestion: draft.aiSuggestion,
  };
}

export function loadReportDraft(storage: Storage = localStorage): ReportDraft {
  try {
    const raw = storage.getItem(REPORT_DRAFT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_REPORT_DRAFT };
    const parsed = JSON.parse(raw) as Partial<PersistedReportDraft>;
    return {
      ...DEFAULT_REPORT_DRAFT,
      ...parsed,
      mediaIds: [],
      mediaAttachments: parsed.mediaAttachments ?? [],
    };
  } catch {
    return { ...DEFAULT_REPORT_DRAFT };
  }
}

export function saveReportDraft(draft: ReportDraft, storage: Storage = localStorage): void {
  storage.setItem(REPORT_DRAFT_STORAGE_KEY, JSON.stringify(toPersistedDraft(draft)));
}

export function clearReportDraft(storage: Storage = localStorage): void {
  storage.removeItem(REPORT_DRAFT_STORAGE_KEY);
}
