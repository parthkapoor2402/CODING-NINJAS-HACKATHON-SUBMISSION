import { useEffect, useRef } from 'react';
import { fileToDataUrl } from '@/services/ai/grok-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';
import { analyzeReportIntake, intakeToSuggestions } from '@/services/ai/report-intake-agent';
import { getMediaFile } from '@/store/reportMediaFiles';
import { useReportDraftStore } from '@/store/reportDraftStore';

/** Runs Report Intake Agent when description is long enough; never blocks manual edits. */
export function useReportAIAssist() {
  const draft = useReportDraftStore((s) => s.draft);
  const updateDraft = useReportDraftStore((s) => s.updateDraft);
  const runId = useRef(0);

  useEffect(() => {
    if (draft.mediaAttachments.length === 0 && !draft.textOnlyFallback) return;
    if (draft.description.trim().length < 10) return;

    const currentRun = ++runId.current;
    updateDraft({ aiStatus: 'loading' });

    const run = async () => {
      const firstPhoto = draft.mediaAttachments.find((a) => a.type === 'photo');
      const hasVideo = draft.mediaAttachments.some((a) => a.type === 'video');
      let imageUrl: string | undefined = firstPhoto?.previewUrl;
      const file = firstPhoto ? getMediaFile(firstPhoto.id) : undefined;
      if (file && isAiGatewayEnabled()) {
        try {
          imageUrl = await fileToDataUrl(file);
        } catch {
          imageUrl = firstPhoto?.previewUrl;
        }
      }

      try {
        const intake = await analyzeReportIntake({
          description: draft.description,
          categoryHint: draft.category,
          imageUrl,
          hasVideo,
          location: draft.location
            ? { lat: draft.location.lat, lng: draft.location.lng }
            : undefined,
        });

        if (currentRun !== runId.current) return;

        const suggestions = intakeToSuggestions(intake);

        updateDraft({
          aiStatus: 'suggestion',
          aiSuggestion: {
            category: intake.category,
            severity: intake.severity,
          },
          aiSuggestions: suggestions,
          reportIntake: intake,
          ...(draft.category ? {} : { category: intake.category }),
          ...(draft.title.trim() ? {} : { title: intake.suggestedTitle }),
        });
      } catch {
        if (currentRun !== runId.current) return;
        updateDraft({ aiStatus: 'unavailable' });
      }
    };

    void run();

    return () => {
      runId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.description, draft.mediaAttachments.length, draft.textOnlyFallback]);
}
