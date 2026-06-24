# FINAL_HANDOFF — CivicResolve

> Handoff for engineers continuing this hackathon MVP.

---

## App purpose

**CivicResolve** is a mobile-first, community-powered civic platform. Residents **identify** neighborhood issues, **report** with photo/video and geolocation, **validate** each other's signal, **track** accountability to resolution, and earn **responsible** recognition — with an **admin** ops layer for triage, moderation, and analytics.

It is intentionally **not** a generic complaint box: duplicate steering, trust scoring, corroboration, and protective review are visible in the UX.

---

## Current scope (MVP shipped)

| Area | Status |
|------|--------|
| Onboarding + demo auth | ✅ Mock one-click accounts |
| Citizen app (home, report, track, verify, nearby, rewards, profile, family) | ✅ |
| Admin app (dashboard, queue, issue detail, moderation, hotspots, analytics) | ✅ |
| Media capture + validation + fallbacks | ✅ |
| AI assist (categorization, duplicate hints) | ✅ Mock default; Grok optional |
| Trust, rewards, youth mode | ✅ Mock-backed |
| Live Supabase / Firebase / Mapbox | ❌ Adapters stub — throw or no-op |
| Real-time sync | ❌ |
| Partner redemption | ❌ UI only |

**Tests:** 175 Vitest (unit + component + integration) + 24 Playwright E2E — all green when run with `npm test` and `npm run test:e2e` (requires `npx playwright install chromium` once).

**Known mock limitations:** See `known-limitations.md`.

---

## Major modules

```
src/
├── app/                 App bootstrap, router shell
├── routes/              Citizen + admin route tables
├── layouts/             CitizenShell, AdminShell, auth guards
├── features/            Page-level modules (home, reporting, admin-*, etc.)
├── components/          Shared UI (cards, states, rewards, admin)
├── domain/              Pure trust, duplicate, reward, admin logic
├── services/
│   ├── mock/            In-memory MVP backend (default)
│   ├── ai/              mockAI + grokAI + resilient wrapper
│   ├── maps/            mock maps
│   ├── supabase/        Phase 2 stub
│   └── firebase/        Phase 2 stub
├── store/               Zustand (auth, onboarding, report draft)
└── test/                unit, component, integration, e2e
```

**Entry:** `src/main.tsx` → `src/app/App.tsx` → `src/routes/index.tsx`

**Service wiring:** `src/services/registry.ts` — selects providers from `VITE_*` env vars.

---

## Mocked vs real services

| Service | Default | Env switch | Notes |
|---------|---------|------------|-------|
| Auth | `mockAuth` | — | sessionStorage persistence for demo reloads |
| Reports / corroboration | `mockReports` | — | Resets between Vitest tests |
| Admin backend | `mockBackend` | — | Queue, analytics, moderation |
| AI | `mockAI` | `VITE_AI_PROVIDER=grok` + `VITE_GROK_API_KEY` | Resilient fallback to mock on error |
| Maps | `mockMaps` | `VITE_MAPS_PROVIDER=mapbox` | Placeholder map UI |
| Supabase | stub | `VITE_BACKEND_PROVIDER=supabase` | Not implemented |
| Firebase | stub | `VITE_BACKEND_PROVIDER=firebase` | Not implemented |

**Secrets:** Only `VITE_GROK_API_KEY` (and future map/backend keys) via `.env`. Never commit `.env`. See `src/services/ai/grok-client.ts`.

---

## Next implementation priorities

1. **Supabase or Firebase adapter** — persist reports, auth, media storage; wire `registry.ts`.
2. **Live maps** — Mapbox/Google tiles in `MapPreviewCard` and location step.
3. **Grok in production** — set `VITE_AI_PROVIDER=grok`; keep resilient fallback.
4. **Media CDN** — upload blobs to storage; replace SVG feed thumbnails.
5. **Realtime** — admin dashboard subscriptions for queue updates.
6. **PWA / offline queue** — `featureFlags.offlineQueue` is false today.
7. **Expand seed → production data model** — 6 curated reports → ward-scale dataset.

---

## Demo & ops docs

| Doc | Use |
|-----|-----|
| `judge-demo-script.md` | Live presentation script |
| `launch-readiness-checklist.md` | Pre-demo QA |
| `demo-media-strategy.md` | Phone vs laptop media modes |
| `feature-map.md` | Brief → prototype mapping |
| `architecture.md` | Full technical design |

---

## Contact / context

Hackathon submission — **CivicResolve** codename. Private repo recommended until keys are managed via CI secrets.
