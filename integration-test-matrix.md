# Integration Test Matrix — Phase 6

Cross-feature flows exercised with Vitest + React Testing Library + full `AppRoutes`.

| ID | Flow | File | Key assertions |
|----|------|------|----------------|
| I01 | New user onboarding → sign-in → home | `onboarding-home.integration.test.tsx` | `auth-choice-step` → `auth-page` → `home-hero` |
| I02 | First report + AI assist | `report-media.integration.test.tsx` | `ai-suggestions-panel` or `ai-unavailable-fallback` |
| I03 | Image upload state | `report-media.integration.test.tsx` | `media-preview`, photo attachment |
| I04 | Short video upload state | `report-media.integration.test.tsx` | `media-preview`, video attachment |
| I05 | Camera permission denied fallback | `report-media.integration.test.tsx` | `permission-denied-camera`, `capture-fallback-gallery` |
| I06 | Location permission denied fallback | `report-media.integration.test.tsx` | `permission-denied-location`, `location-pin-adjust` |
| I07 | Duplicate warning on review | `report-media.integration.test.tsx` | `duplicate-warning` or draft warning |
| I07b | Support-existing link on duplicate | `community-flows.integration.test.tsx` | `support-existing-report` |
| I08 | Support existing report | `community-flows.integration.test.tsx` | `support-existing-btn` disabled after click |
| I09 | Suspicious report notice | `community-flows.integration.test.tsx` | `suspicious-issue-notice` |
| I10 | Community verification | `community-flows.integration.test.tsx` | verify btn + confirmation feedback |
| I11 | Issue status progression | `community-flows.integration.test.tsx` | `issue-timeline` on tracking |
| I12 | Rewards after verified contribution | `rewards-admin.integration.test.tsx` | `verified-points-total`, unlocked catalog |
| I13 | Youth / family supervised mode | `rewards-admin.integration.test.tsx` | `youth-rewards-restricted`, `family-contributions` |
| I14 | Admin sees reported issue | `rewards-admin.integration.test.tsx` | `admin-queue-item-report-001` |
| I15 | Admin suspicious + abuse queues | `rewards-admin.integration.test.tsx` | both queue test IDs |
| I16 | Admin analytics from mock state | `rewards-admin.integration.test.tsx` | response, category, abuse, insights |
| I16b | AI unavailable fallback | `report-media.integration.test.tsx` | `ai-unavailable-fallback` |
| I16c | Oversized file UX | `report-media.integration.test.tsx` | `media-error-oversized_image` |

## Commands

```bash
npm run test:unit
npm run test:component
npm run test:integration
npm test          # all Vitest (unit + component + integration)
```

## Setup

- `src/test/integration/helpers.tsx` — `renderApp`, auth helpers, mock file factory
- Global `beforeEach` in `src/test/setup.ts` resets mocks
