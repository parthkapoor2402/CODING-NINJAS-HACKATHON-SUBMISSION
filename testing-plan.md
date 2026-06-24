# Testing Plan — CivicResolve

Aligned with `architecture.md` testing strategy and current scaffold.

## Tooling

| Layer | Tool | Location |
|-------|------|----------|
| Unit | Vitest | `src/test/unit/` |
| Component | Vitest + RTL | `src/test/component/` |
| E2E | Playwright | `src/test/e2e/` |
| Setup | jest-dom | `src/test/setup.ts` |

## Commands

```bash
npm run test          # CI-style single run
npm run test:watch    # local development
npm run test:e2e      # Playwright (mobile + desktop projects)
```

## Phase 0 — Scaffold (current)

### Unit
- [x] `cn` utility
- [x] `featureFlags` defaults
- [ ] Trust score calculators (when domain added)
- [ ] Duplicate risk scoring (when domain added)
- [ ] Report state machine transitions

### Component
- [x] `StatusBadge`
- [ ] `TrustScoreRing`
- [ ] `Button` variants
- [ ] Report stepper shell

### Integration
- [ ] `services.registry` mock resolution
- [ ] Auth sign-in → store hydration
- [ ] Report create via mock repository

### E2E
- [x] Auth page load
- [x] Citizen demo sign-in → home
- [ ] Admin demo sign-in → dashboard
- [ ] Mobile viewport bottom nav
- [ ] Track tab shows mock reports

## Phase 1 — MVP features

### Unit
- Media validation (size, duration, MIME)
- Reward eligibility rules
- Label/status helpers

### Component
- Permission denied cards
- Empty states per screen
- Duplicate suggestion sheet (mock)

### E2E (mobile 390×844)
1. Report flow placeholder → submit mock
2. Duplicate redirect path
3. Admin queue → open item
4. Youth supervised gate

## Phase 2 — Live services

### Contract tests
- Grok adapter with mocked `fetch`
- Mapbox adapter init
- Supabase/Firebase adapter stubs replaced

### E2E guardrails
- AI timeout → manual category fallback
- Camera denied → gallery path
- Oversized file rejection

## CI pipeline (recommended)

```
lint → tsc -b → vitest run → playwright (on main/PR)
```

## Coverage targets (MVP)

| Area | Target |
|------|--------|
| `src/domain/` | 90%+ when introduced |
| `src/services/mock/` | 70%+ |
| Critical UI paths | E2E smoke on every PR |

## Playwright projects

- `chromium` — admin desktop flows
- `mobile-chrome` (Pixel 5) — citizen flows

## Mocking conventions

- Use `services` registry in tests; never import mock files directly from components
- E2E uses demo account buttons (no real auth)
- `page.route()` for future live API contract tests
