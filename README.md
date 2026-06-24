# CivicResolve

Mobile-first civic issue reporting for citizens, with an admin operations dashboard in the same repository. Community-powered: report with evidence, verify neighbors' signal, track resolution, and earn responsible recognition.

**Handoff:** See [`FINAL_HANDOFF.md`](FINAL_HANDOFF.md) for scope, modules, and next steps.

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

---

## Install

```bash
git clone <your-repo-url>
cd CODING-NINJAS-HACKATHON-SUBMISSION   # or your clone folder name
npm install
```

---

## Environment setup

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_USE_MOCKS` | `true` | Mock backend, AI, maps |
| `VITE_BACKEND_PROVIDER` | `mock` | `mock` \| `supabase` \| `firebase` (stubs) |
| `VITE_AI_PROVIDER` | `mock` | `mock` \| `grok` |
| `VITE_MAPS_PROVIDER` | `mock` | `mock` \| `mapbox` \| `google` |
| `VITE_FORCE_GALLERY_ONLY` | `false` | `true` for laptop gallery demos |
| `VITE_GROK_API_KEY` | *(empty)* | **Optional** — only in `.env`, never commit |

**No API keys required** for the default demo. To enable live Grok AI:

```env
VITE_AI_PROVIDER=grok
VITE_GROK_API_KEY=your_key_here
```

Keys are read only from env via `import.meta.env` in `src/services/ai/grok-client.ts` — never hardcoded.

`.env` is gitignored. Only `.env.example` (placeholders) is tracked.

---

## Run locally

```bash
npm run dev
```

Open **http://localhost:5173**

| Route | Description |
|-------|-------------|
| `/auth` | Demo sign-in (citizen, admin, youth, parent) |
| `/app/home` | Citizen home |
| `/app/report` | Report wizard |
| `/app/community` | Community verification |
| `/app/nearby` | Nearby issues |
| `/app/rewards` | Rewards & badges |
| `/admin/dashboard` | Admin KPIs |
| `/admin/queue` | Issue queue |
| `/admin/moderation` | Suspicious & abuse queues |
| `/admin/analytics` | Analytics |

**Demo accounts** (no password — click on `/auth`):

| Role | Email |
|------|-------|
| Citizen | `demo-citizen@local.dev` |
| Admin | `demo-admin@local.dev` |
| Youth | `demo-youth@local.dev` |
| Parent | `demo-parent@local.dev` |

---

## Test commands

```bash
# All Vitest (unit + component + integration) — 175 tests
npm test

# By layer
npm run test:unit
npm run test:component
npm run test:integration

# Watch mode
npm run test:watch

# Playwright E2E (24 tests, chromium + mobile-chrome)
npx playwright install chromium   # first time only
npm run test:e2e
```

**Expected limitations:** E2E requires Chromium installed. Mock data resets on full page reload except auth/onboarding persisted in browser storage. See `known-limitations.md`.

---

## Build

```bash
npm run build      # tsc + vite → dist/
npm run preview    # serve production build locally
```

---

## Demo notes

- **Judge script:** `judge-demo-script.md`
- **Pre-flight checklist:** `launch-readiness-checklist.md`
- **Media modes:** `demo-media-strategy.md` — phone (live camera) vs laptop (`VITE_FORCE_GALLERY_ONLY=true` + `src/test/fixtures/demo-photo.jpg`)
- **Four seed scenarios:** school pothole, Russell Market garbage, Park Lane streetlight, Lakeview Apartments water leak

---

## Architecture summary

```
┌─────────────────────────────────────────────────────────┐
│              Vite SPA (React 19 + TypeScript)           │
│  Citizen routes (/app/*)  │  Admin routes (/admin/*)   │
│  Zustand stores           │  React Router guards         │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Service registry (env-selected adapters)               │
│  • mockAuth / mockReports / mockBackend  (default)      │
│  • mockAI ↔ grokAI (resilient fallback)                 │
│  • mockMaps                                             │
│  • supabase / firebase stubs (Phase 2)                  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  domain/ — pure trust, duplicate, reward, admin logic   │
└─────────────────────────────────────────────────────────┘
```

**Layers:** `features/` (pages) → `services/` (I/O) → `domain/` (rules). Trust and duplicate logic stay out of UI components.

Full detail: [`architecture.md`](architecture.md)

---

## Project structure

```
src/
├── app/              # Bootstrap
├── routes/           # Route definitions
├── layouts/          # Shells + auth guards
├── features/         # Citizen + admin pages
├── components/       # Shared UI
├── domain/           # Pure business logic
├── services/         # Adapters (mock, AI, maps, backend)
├── store/            # Zustand
├── lib/              # Constants, flags, validation
└── test/             # unit, component, integration, e2e
```

---

## Deploy (Vercel)

1. Import repo in Vercel.
2. **Framework preset:** Vite
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. **Install command:** `npm install`
6. Add env vars in Vercel dashboard (same names as `.env.example`, no secrets in repo).
7. `vercel.json` includes SPA rewrites for React Router.

---

## Key documentation

| File | Topic |
|------|-------|
| `FINAL_HANDOFF.md` | Engineer handoff |
| `product-requirements.md` | PRD |
| `architecture.md` | Technical architecture |
| `known-limitations.md` | Mock / MVP boundaries |
| `feature-map.md` | Brief → prototype map |

---

## License

Hackathon submission — private unless otherwise specified.
