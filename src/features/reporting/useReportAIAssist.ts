import { useEffect, useRef } from 'react';
import { fileToDataUrl } from '@/services/ai/grok-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';
import { gatewayGenerateReportCopy } from '@/services/ai/gatewayAIService';
import { services } from '@/services/registry';
import { getMediaFile } from '@/store/reportMediaFiles';
import { useReportDraftStore } from '@/store/reportDraftStore';

/** Runs AI assist when description is long enough; never blocks manual edits. */
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
      let imageUrl: string | undefined = firstPhoto?.previewUrl;
      const file = firstPhoto ? getMediaFile(firstPhoto.id) : undefined;
      if (file && isAiGatewayEnabled()) {
        try {
          imageUrl = await fileToDataUrl(file);
        } catch {
          imageUrl = firstPhoto?.previewUrl;
        }
      }

      const input = {
        description: draft.description,
        categoryHint: draft.category,
        imageUrl,
        location: draft.location
          ? { lat: draft.location.lat, lng: draft.location.lng }
          : undefined,
      };

      try {
        const [categoryResult, severityResult] = await Promise.all([
          services.ai.categorize(input),
          services.ai.estimateSeverity(input),
        ]);

        let summary = draft.aiSuggestions?.summary;
        let suggestedTitle = draft.aiSuggestions?.suggestedTitle;

        if (isAiGatewayEnabled()) {
          try {
            const copy = await gatewayGenerateReportCopy(
              draft.description,
              categoryResult.category,
              imageUrl,
            );
            summary = copy.summary;
            suggestedTitle = copy.title;
          } catch {
            summary = await services.ai.summarize(draft.description);
          }
        } else {
          summary = await services.ai.summarize(draft.description);
        }

        if (currentRun !== runId.current) return;

        updateDraft({
          aiStatus: 'suggestion',
          aiSuggestion: {
            category: categoryResult.category,
            severity: severityResult.severity,
          },
          aiSuggestions: {
            category: categoryResult.category,
            categoryConfidence: categoryResult.confidence,
            severity: severityResult.severity,
            severityConfidence: severityResult.confidence,
            severityRationale: severityResult.rationale,
            summary,
            suggestedTitle,
          },
          ...(draft.category ? {} : { category: categoryResult.category }),
          ...(draft.title.trim() ? {} : { title: suggestedTitle ?? draft.title }),
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
