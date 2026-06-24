# Project Setup Checklist — CivicResolve Scaffold

Use this list to verify the foundation before building features.

## Environment

- [ ] Node.js 20+ installed (`node -v`)
- [ ] `npm install` completes without errors
- [ ] `.env` copied from `.env.example`
- [ ] `VITE_USE_MOCKS=true` in `.env`

## Run locally

- [ ] `npm run dev` starts on http://localhost:5173
- [ ] `/auth` renders sign-in page
- [ ] Citizen demo button → `/app/home`
- [ ] Admin demo button → `/admin/dashboard`
- [ ] Bottom nav switches citizen tabs
- [ ] Admin sidebar switches admin sections

## Build & quality

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (unit + component)
- [ ] `npm run test:e2e` passes (smoke tests)

## Architecture verification

- [ ] `src/services/registry.ts` resolves mock adapters by default
- [ ] `src/lib/feature-flags.ts` gates advanced modules
- [ ] `src/store/` — auth, reportDraft, map stores exist
- [ ] `src/types/index.ts` — domain entities defined
- [ ] Mock seeds in `src/services/mock/seed/`

## Route skeleton

### Citizen (`/app/*`)
- [ ] home
- [ ] report
- [ ] track
- [ ] community (verification)
- [ ] rewards
- [ ] profile
- [ ] family (youth mode)

### Admin (`/admin/*`)
- [ ] dashboard
- [ ] queue
- [ ] analytics
- [ ] moderation

## UI foundation

- [ ] Tailwind + design tokens in `src/styles/globals.css`
- [ ] shadcn-style primitives in `src/components/ui/`
- [ ] `StatusBadge`, `TrustScoreRing`, `MapPlaceholder`, `EmptyState`

## Not in scaffold (next prompts)

- [ ] Full report wizard with media capture
- [ ] Live Mapbox/Google map
- [ ] Grok AI integration
- [ ] Supabase/Firebase live backend
- [ ] Trust domain pure functions
- [ ] Duplicate intercept UX

## API keys — when to add

| Key | When |
|-----|------|
| `VITE_GROK_API_KEY` | Phase 2 — live AI in report flow |
| `VITE_MAPBOX_TOKEN` | Phase 2 — live maps |
| `VITE_SUPABASE_*` or `VITE_FIREBASE_*` | Phase 2 — persistent backend |

MVP scaffold: **no keys required**.
