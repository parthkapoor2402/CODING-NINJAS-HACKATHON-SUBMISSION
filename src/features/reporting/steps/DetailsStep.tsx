import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { validateDescription, validateTitle } from '@/lib/report-validation';
import { useReportAIAssist } from '@/features/reporting/useReportAIAssist';
import { ISSUE_CATEGORIES } from '@/types/reporting';
import { useReportDraftStore } from '@/store/reportDraftStore';
import type { Severity } from '@/types';
import { cn } from '@/lib/utils';

function confidenceLabel(value?: number): string {
  if (value == null) return '';
  const pct = Math.round(value * 100);
  if (pct >= 75) return 'High confidence';
  if (pct >= 50) return 'Moderate confidence';
  return 'Low confidence — please confirm';
}

export function DetailsStep() {
  const draft = useReportDraftStore((s) => s.draft);
  const updateDraft = useReportDraftStore((s) => s.updateDraft);
  const setStep = useReportDraftStore((s) => s.setStep);
  const [showWhy, setShowWhy] = useState(true);

  useReportAIAssist();

  const titleError = draft.title ? validateTitle(draft.title) : null;
  const descriptionError = draft.description ? validateDescription(draft.description) : null;
  const suggestions = draft.aiSuggestions;
  const intake = draft.reportIntake;
  const suggestedCategory = suggestions?.category;

  const canContinue =
    draft.category != null &&
    validateTitle(draft.title) === null &&
    validateDescription(draft.description) === null;

  const applyCategory = () => {
    if (!suggestions?.category) return;
    updateDraft({ category: suggestions.category });
  };

  const applySeverity = () => {
    if (!suggestions?.severity) return;
    updateDraft({ severity: suggestions.severity });
  };

  const applyTitleAndSummary = () => {
    if (!suggestions) return;
    updateDraft({
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
          Analyzing your report for category, severity, and safety cues…
        </div>
      ) : null}

      {draft.aiStatus === 'unavailable' ? (
        <div
          className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 p-3 text-sm"
          data-testid="ai-unavailable-fallback"
          role="status"
        >
          <p className="font-medium text-amber-900">Suggestions unavailable</p>
          <p className="mt-1 text-xs text-amber-900/80">
            Fill in the fields below manually — reporting still works.
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
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="font-medium text-civic-teal-900">Report intake suggestions</p>
                <p className="text-xs text-civic-teal-800/80">
                  Editable — nothing is submitted until you tap Submit on the review step.
                </p>
              </div>

              {suggestedCategory ? (
                <div data-testid="ai-suggested-category">
                  <p className="text-xs font-semibold text-civic-teal-900">AI suggested category</p>
                  <p className="text-sm capitalize text-civic-teal-900">
                    {suggestedCategory.replace('_', ' ')}
                    <span className="ml-1 text-xs font-normal text-civic-teal-700">
                      ({confidenceLabel(suggestions.categoryConfidence)})
                    </span>
                  </p>
                  <Button variant="soft" size="sm" className="mt-1 h-8" onClick={applyCategory}>
                    Use this category
                  </Button>
                </div>
              ) : null}

              {suggestions.severity ? (
                <div data-testid="ai-suggested-severity">
                  <p className="text-xs font-semibold text-civic-teal-900">Suggested severity</p>
                  <p className="text-sm capitalize text-civic-teal-900">
                    {suggestions.severity}
                    <span className="ml-1 text-xs font-normal text-civic-teal-700">
                      ({confidenceLabel(suggestions.severityConfidence)})
                    </span>
                  </p>
                  <Button variant="soft" size="sm" className="mt-1 h-8" onClick={applySeverity}>
                    Use this severity
                  </Button>
                </div>
              ) : null}

              {suggestions.safetyCues && suggestions.safetyCues.length > 0 ? (
                <div data-testid="ai-safety-cues">
                  <p className="text-xs font-semibold text-civic-teal-900">Safety cues noted</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {suggestions.safetyCues.map((cue) => (
                      <span
                        key={cue}
                        className="rounded-full bg-civic-amber-100 px-2 py-0.5 text-[10px] font-medium text-civic-amber-900"
                      >
                        {cue}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {suggestions.explanation ? (
                <div data-testid="ai-why-suggested">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left text-xs font-semibold text-civic-teal-900"
                    onClick={() => setShowWhy((v) => !v)}
                  >
                    Why this was suggested
                    {showWhy ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                  {showWhy ? (
                    <p className="mt-1 text-xs leading-relaxed text-civic-teal-800/90">
                      {suggestions.explanation}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {intake?.fallbackUsed ? (
                <p className="text-[10px] text-civic-teal-700/80" data-testid="ai-fallback-notice">
                  Used offline rules — live AI was unavailable.
                </p>
              ) : null}
            </div>
          </div>
          {suggestions.suggestedTitle || suggestions.summary ? (
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={applyTitleAndSummary}>
              Apply suggested title & summary
            </Button>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium" htmlFor="report-title">
          Title <span className="font-normal text-muted-foreground">(editable)</span>
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
          Description <span className="font-normal text-muted-foreground">(editable)</span>
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
        <p className="text-sm font-medium">
          Category <span className="font-normal text-muted-foreground">(tap to edit)</span>
        </p>
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
              {suggestedCategory === cat.id && draft.aiStatus === 'suggestion' ? (
                <span className="ml-1 text-[10px] text-civic-teal-700">· suggested</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">
          Severity <span className="font-normal text-muted-foreground">(tap to edit)</span>
        </p>
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
