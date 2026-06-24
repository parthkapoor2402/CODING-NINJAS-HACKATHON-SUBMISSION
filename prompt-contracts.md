# Prompt Contracts — Grok / CivicResolve

All Grok calls use `response_format: { type: "json_object" }` and system prompts in `src/services/ai/prompts.ts`.

## categorize

**Model:** `grok-2-vision-1212` (when image available)

**System:**
> Classify civic infrastructure issues. Return JSON: `{ category, confidence, rationale }`  
> Categories: pothole | water_leak | streetlight | garbage | sanitation | infrastructure | other

**User:** Description + optional category hint + optional image (base64 data URL)

**Output mapping:** `CategorizationResult` — invalid category → `other`

---

## estimateSeverity

**Model:** `grok-2-vision-1212` (when image available)

**System:**
> Assess dispatch priority. Return JSON: `{ severity, confidence, rationale }`  
> severity: low | medium | high

**User:** Category + description + optional image

---

## summarize / report copy

**Model:** `grok-2-latest`

**System:**
> Return JSON: `{ title, summary, description }` — citizen-friendly, factual, no emojis

**User:** Category + citizen notes (+ optional image via `grokGenerateReportCopy`)

---

## detectDuplicateRisk

**Model:** `grok-2-latest`

**System:**
> Return JSON: `{ riskScore, matches: [{ reportId, score, distanceM }] }`

**User:** Category, description, lat/lng

**Note:** Merged with local duplicate scoring in `src/domain/duplicate-detection.ts`

---

## Timeouts & errors

- Default timeout: **12s** (`grok-client.ts`)
- Parse failures throw → resilient wrapper → mock fallback
- Never surface raw API errors to citizens; use `ai-unavailable-fallback`
