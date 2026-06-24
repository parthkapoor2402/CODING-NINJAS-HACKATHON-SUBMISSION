# E2E Scenarios — Playwright

Base URL: `http://localhost:5173` (Vite dev server via `webServer` in `playwright.config.ts`).

Projects: **Desktop Chrome** + **Pixel 5** (mobile).

| ID | Scenario | Spec | Steps |
|----|----------|------|-------|
| E01 | Onboarding → home | `happy-paths.spec.ts` | Full onboarding → sign-in → citizen → `home-hero` |
| E02 | Report + image upload | `happy-paths.spec.ts` | Home CTA → gallery image → `media-preview` → details |
| E03 | Text-only / capture fallback | `happy-paths.spec.ts` | Report → `text-only-fallback` |
| E04 | Support existing (nearby) | `happy-paths.spec.ts` | Nearby feed → `support-existing-btn` |
| E05 | Community verification | `happy-paths.spec.ts` | Parent sign-in → community → verify |
| E06 | Rewards catalog | `happy-paths.spec.ts` | Citizen → rewards → points + catalog |
| E07 | Youth family restrictions | `happy-paths.spec.ts` | Youth → family → supervised notice |
| E08 | Admin queue + moderation | `happy-paths.spec.ts` | Admin → queue + moderation queues |
| E09 | Admin analytics | `happy-paths.spec.ts` | Admin → analytics sections |
| E10 | Suspicious issue detail | `happy-paths.spec.ts` | `report-003` → suspicious notice |
| E11 | Auth smoke | `smoke.spec.ts` | Auth page loads |
| E12 | Citizen sign-in smoke | `smoke.spec.ts` | Quick sign-in → home |

## Run

```bash
npm run test:e2e
npx playwright test --project=mobile-chrome
npx playwright show-report
```

## Fixtures

- `src/test/fixtures/demo-photo.jpg` — minimal JPEG for gallery upload tests
