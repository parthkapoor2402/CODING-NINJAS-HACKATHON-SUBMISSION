import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateDescription, validateTitle } from '@/lib/report-validation';
import { useReportAIAssist } from '@/features/reporting/useReportAIAssist';
import { ISSUE_CATEGORIES } from '@/types/reporting';
import { useReportDraftStore } from '@/store/reportDraftStore';
import type { Severity } from '@/types';
import { cn } from '@/lib/utils';

export function DetailsStep() {
  const draft = useReportDraftStore((s) => s.draft);
  const updateDraft = useReportDraftStore((s) => s.updateDraft);
  const setStep = useReportDraftStore((s) => s.setStep);

  useReportAIAssist();

  const titleError = draft.title ? validateTitle(draft.title) : null;
  const descriptionError = draft.description ? validateDescription(draft.description) : null;
  const suggestions = draft.aiSuggestions;

  const canContinue =
    draft.category != null &&
    validateTitle(draft.title) === null &&
    validateDescription(draft.description) === null;

  const applyAISuggestions = () => {
    if (!suggestions) return;
    updateDraft({
      category: suggestions.category ?? draft.category,
      severity: suggestions.severity ?? draft.severity,
      title: suggestions.suggestedTitle ?? draft.title,
      description: suggestions.summary ?? draft.description,
    });
  };

  return (
    <div className="space-y-4" data-testid="report-details-step">
      {draft.aiStatus === 'loading' ? (
        <div
          className="rounded-xl border border-dashed border-civic-blue-200 bg-civic-blue-50/50 p-3 text-sm text-civic-blue-800"
          data-testid="ai-suggestion-placeholder"
        >
          Analyzing your description for category hints…
        </div>
      ) : null}

      {draft.aiStatus === 'unavailable' ? (
        <div
          className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 p-3 text-sm"
          data-testid="ai-unavailable-fallback"
          role="status"
        >
          <p className="font-medium text-amber-900">AI suggestions unavailable</p>
          <p className="mt-1 text-xs text-amber-900/80">
            Select a category manually — reporting still works.
          </p>
        </div>
      ) : null}

      {draft.aiStatus === 'suggestion' && suggestions ? (
        <div
          className="rounded-xl border border-civic-teal-200 bg-civic-teal-50/50 p-3 text-sm"
          data-testid="ai-suggestions-panel"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-civic-teal-600" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-civic-teal-900">AI suggestions</p>
              {suggestions.category ? (
                <p className="mt-1 text-xs text-civic-teal-800">
                  Category: <strong>{suggestions.category.replace('_', ' ')}</strong>
                  {suggestions.categoryConfidence
                    ? ` (${Math.round(suggestions.categoryConfidence * 100)}% confidence)`
                    : ''}
                </p>
              ) : null}
              {suggestions.severity ? (
                <p className="text-xs text-civic-teal-800">
                  Severity: <strong className="capitalize">{suggestions.severity}</strong>
                  {suggestions.severityRationale ? ` — ${suggestions.severityRationale}` : ''}
                </p>
              ) : null}
              {suggestions.summary ? (
                <p className="mt-1 text-xs leading-relaxed text-civic-teal-800/90">
                  {suggestions.summary}
                </p>
              ) : null}
            </div>
          </div>
          <Button variant="soft" size="sm" className="mt-2" onClick={applyAISuggestions}>
            Apply suggestions
          </Button>
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium" htmlFor="report-title">
          Title
        </label>
        <input
          id="report-title"
          data-testid="report-title-input"
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          placeholder="e.g. Pothole near crosswalk"
          className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        />
        {titleError ? <p className="mt-1 text-xs text-destructive">{titleError}</p> : null}
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="report-description">
          Description
        </label>
        <textarea
          id="report-description"
          data-testid="report-description-input"
          value={draft.description}
          onChange={(e) => updateDraft({ description: e.target.value })}
          placeholder="What do you see? Include landmarks or lane details."
          className="mt-1 min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        {descriptionError ? (
          <p className="mt-1 text-xs text-destructive">{descriptionError}</p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium">Category</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ISSUE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-testid={`category-${cat.id}`}
              onClick={() => updateDraft({ category: cat.id })}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                draft.category === cat.id
                  ? 'border-civic-blue-600 bg-civic-blue-50 text-civic-blue-800'
                  : 'border-border bg-card text-muted-foreground',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Severity</p>
        <div className="mt-2 flex gap-2">
          {(['low', 'medium', 'high'] as Severity[]).map((level) => (
            <button
              key={level}
              type="button"
              data-testid={`severity-${level}`}
              onClick={() => updateDraft({ severity: level })}
              className={cn(
                'flex-1 rounded-lg border py-2 text-xs font-semibold capitalize',
                draft.severity === level
                  ? 'border-civic-blue-600 bg-civic-blue-50 text-civic-blue-800'
                  : 'border-border text-muted-foreground',
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
          Back
        </Button>
        <Button variant="civic" className="flex-1" disabled={!canContinue} onClick={() => setStep(2)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
