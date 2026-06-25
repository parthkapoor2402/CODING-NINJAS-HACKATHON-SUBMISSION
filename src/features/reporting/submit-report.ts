import { services } from '@/services/registry';
import { getMediaFile } from '@/store/reportMediaFiles';
import { useAuthStore } from '@/store/authStore';
import { useReportDraftStore } from '@/store/reportDraftStore';

export async function submitReportDraft(): Promise<string> {
  const draft = useReportDraftStore.getState().draft;
  const user = useAuthStore.getState().session?.user;
  if (!user || !draft.category || !draft.location) {
    throw new Error('Report incomplete');
  }

  const mediaIds: string[] = [];
  for (const attachment of draft.mediaAttachments) {
    const file = getMediaFile(attachment.id);
    const blob =
      file ??
      new Blob([new Uint8Array(attachment.sizeBytes || 1)], {
        type: attachment.mimeType,
      });
    const asset = await services.media.upload(blob, {
      reportId: 'draft',
      type: attachment.type,
      mimeType: attachment.mimeType,
      captureSource: attachment.captureSource,
      durationSec: attachment.durationSec,
    });
    mediaIds.push(asset.id);
  }

  const report = await services.reports.create({
    reporterId: user.id,
    category: draft.category,
    description: `${draft.title.trim()}\n\n${draft.description.trim()}`,
    severity: draft.severity,
    location: draft.location,
    mediaIds,
    aiMetadata:
      draft.reportIntake || draft.duplicateTrust
        ? {
            ...(draft.reportIntake
              ? {
                  intake: {
                    auditId: draft.reportIntake.auditId,
                    model: draft.reportIntake.model,
                    fallbackUsed: draft.reportIntake.fallbackUsed,
                    analyzedAt: draft.reportIntake.analyzedAt,
                    confidence: draft.reportIntake.confidence,
                    safetyCues: draft.reportIntake.safetyCues,
                    explanation: draft.reportIntake.explanation,
                  },
                }
              : {}),
            ...(draft.duplicateTrust
              ? {
                  duplicateTrust: {
                    auditId: draft.duplicateTrust.auditId,
                    model: draft.duplicateTrust.model,
                    fallbackUsed: draft.duplicateTrust.fallbackUsed,
                    analyzedAt: draft.duplicateTrust.analyzedAt,
                    classification: draft.duplicateTrust.classification,
                    recommendedAction: draft.duplicateTrust.recommendedAction,
                    riskScore: draft.duplicateTrust.riskScore,
                    trustSignals: draft.duplicateTrust.trustSignals,
                    userMessage: draft.duplicateTrust.userMessage,
                    adminRationale: draft.duplicateTrust.adminRationale,
                    comparisonNarrative: draft.duplicateTrust.comparisonNarrative,
                    rewardEligibility: draft.duplicateTrust.rewardEligibility,
                    supportExistingReportId: draft.duplicateTrust.supportExistingReportId,
                    matches: draft.duplicateTrust.matches,
                  },
                }
              : {}),
          }
        : undefined,
  });

  useReportDraftStore.getState().setSubmitted(report.id);
  return report.id;
}
