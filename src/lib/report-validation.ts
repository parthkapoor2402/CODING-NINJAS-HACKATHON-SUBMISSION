import type { ReportDraft } from '@/types/reporting';

export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (!trimmed) return 'Add a short title so crews know what to look for.';
  if (trimmed.length < 3) return 'Title must be at least 3 characters.';
  return null;
}

export function validateDescription(description: string): string | null {
  const trimmed = description.trim();
  if (!trimmed) return 'Describe what you see — location cues help verification.';
  if (trimmed.length < 10) return 'Description must be at least 10 characters.';
  return null;
}

export function canSubmitReport(draft: ReportDraft): boolean {
  const hasEvidence = draft.mediaAttachments.length > 0 || draft.textOnlyFallback === true;
  return (
    hasEvidence &&
    draft.category != null &&
    validateTitle(draft.title) === null &&
    validateDescription(draft.description) === null &&
    draft.location != null &&
    !draft.submittedReportId
  );
}
