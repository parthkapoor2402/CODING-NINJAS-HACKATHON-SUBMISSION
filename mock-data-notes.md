# Mock Data Notes — CivicResolve

Reference for seeded demo data used by the mock service layer.

## Location

```
src/services/mock/seed/
├── users.ts       # 6 demo users (all roles)
├── reports.ts     # 6 reports incl. 1 merged duplicate
├── media.ts       # 5 media assets → public/mock-media/*.svg
├── rewards.ts     # Badges + reward events
├── admin.ts       # Queue + suspicious cases
└── index.ts       # Re-exports
```

## Users

| ID | Email | Role |
|----|-------|------|
| user-citizen-1 | demo-citizen@local.dev | citizen |
| user-admin-1 | demo-admin@local.dev | admin |
| user-youth-1 | demo-youth@local.dev | youth |
| user-parent-1 | demo-parent@local.dev | parent |
| user-worker-1 | demo-worker@local.dev | field_worker |
| user-moderator-1 | mod@local.dev | moderator |

## Reports (geo cluster)

Base coordinates: **12.9716, 77.5946** (demo neighborhood).

| ID | Category | Status | Notes |
|----|----------|--------|-------|
| report-001 | pothole | verified | Duplicate cluster canonical |
| report-002 | water_leak | in_progress | Assigned to field worker |
| report-003 | streetlight | pending_verification | Pending reward |
| report-004 | garbage | resolved | Resolution demo |
| report-005 | pothole | merged | duplicateOf report-001 |
| report-006 | sanitation | acknowledged | Queue item |

## Duplicate demo trigger

Mock AI `detectDuplicateRisk` returns **risk 85** when submitting near:
- lat ≈ **12.9736**
- lng ≈ **77.5956**

Use this in E2E for duplicate-intercept demos.

## Admin queue

Built from non-terminal reports, sorted by `priorityScore` (severity × corroborations).

## Suspicious cases

1. **suspicious-001** — duplicate risk on report-005
2. **suspicious-002** — velocity spike (user-level)
3. **suspicious-003** — low media quality on report-003

## Rewards

- **badge-first-report**, **badge-duplicate-defender**, **badge-streak**
- Citizen has 3 verified reward events + 1 pending (report-003)

## Runtime mutation

`mockReportRepository` and `mockMediaStorage` clone seeds into in-memory arrays — creates persist for the browser session until refresh.

`mockAuthBackend` holds session in module memory (not localStorage yet).

## Media assets

Placeholder SVGs in `public/mock-media/` — replace with real JPEG/MP4 for richer demos.

## Switching off mocks

```env
VITE_USE_MOCKS=false
VITE_BACKEND_PROVIDER=supabase   # when implemented
VITE_AI_PROVIDER=grok            # when implemented
VITE_MAPS_PROVIDER=mapbox        # when implemented
```

Until live adapters are implemented, keep `VITE_USE_MOCKS=true`.

---

## Grok API key — when to add

| Phase | AI mode | Action |
|-------|---------|--------|
| **Scaffold + MVP demo** | `VITE_AI_PROVIDER=mock` | **Do not add** `VITE_GROK_API_KEY` |
| **Phase 2 — report wizard** | `VITE_AI_PROVIDER=grok` | Add to `.env`: `VITE_GROK_API_KEY=...` and implement `src/services/ai/grokAI.ts` |
| **Phase 2+ — admin insights** | grok | Same key; optional summary/prioritization endpoints |

**First phase requiring real AI calls:** **Phase 2**, when building the report wizard's live categorization, severity hints, and duplicate-risk assistance. The scaffold and MVP demo runs entirely on `mockAIService` with deterministic responses.
