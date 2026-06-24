# AI Reporting Fallbacks — CivicResolve

## Principle

**AI assists; citizens decide.** No Grok or mock AI failure may block submission when manual fields are complete.

## Fallback chain

```
Grok API (if VITE_GROK_API_KEY set)
    ↓ on error / timeout / invalid JSON
mockAIService (keyword + geo heuristics)
    ↓ on error
Manual-only UI (category chips, severity, title, description)
```

Implemented in `src/services/ai/resilientAI.ts` and consumed via `services.ai` in the registry.

## Per-feature behavior

| Feature | Grok path | Fallback | Manual override |
|---------|-----------|----------|-----------------|
| Category | Vision + text JSON | Keyword mock | Category chips always visible |
| Severity | Text JSON | Keyword mock | Severity buttons always visible |
| Summary / title | Text JSON | Truncate mock | Title + description inputs |
| Duplicate risk | Text JSON + local scoring | Local geo/text match only | User can support existing or continue |

## UI states

| `aiStatus` | User sees |
|------------|-----------|
| `idle` | No banner |
| `loading` | `ai-suggestion-placeholder` |
| `suggestion` | AI panel with Apply button |
| `unavailable` | `ai-unavailable-fallback` — calm, non-blocking |

## When Grok is skipped entirely

- No `VITE_GROK_API_KEY` → mock AI only (still wrapped in resilient for consistency)
- `useReportAIAssist` never throws; errors become `unavailable`

## Reporting without media

- `textOnlyFallback` allows submit without attachments (de-prioritized in UI)
- Suspicious assessment flags reduced verification trust; rewards gated

## Time budget

Target **under 20–30 seconds** for a typical image report: parallel categorize + severity, non-blocking review checks.
