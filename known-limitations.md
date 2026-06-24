# Known Limitations — CivicResolve Prototype

## Testing

- **Vitest:** 175 tests (unit + component + integration) — `npm test`
- **Playwright:** 24 E2E tests (chromium + mobile-chrome) — `npm run test:e2e` after `npx playwright install chromium`
- Mock state resets between Vitest runs; browser `sessionStorage` persists demo sign-in across reloads.

## Platform & backend

- **Mock-first** — all data is in-memory; refresh resets report/corroboration state. Demo sign-in and onboarding persist via `sessionStorage` / `localStorage`.
- **No live municipal ERP** — assignment and resolution are simulated.
- **No real-time sync** — admin dashboard does not websocket-update.
- **Supabase / Firebase adapters** throw — use `VITE_BACKEND_PROVIDER=mock`.

## Maps & location

- **Map previews are stylized placeholders**, not Mapbox tiles.
- **Geolocation in tests** uses injectable adapters; real device GPS may differ from seed wards.
- **Manual pin adjust** is the fallback when permission is denied — accuracy depends on user input.

## Media & camera

- **Camera capture** uses `getUserMedia` / adapter abstraction — desktop browsers may differ from mobile.
- **HEIC/HEIF** accepted in validation but preview may vary by browser.
- **Video duration** read via metadata API — corrupt files may fail silently in some browsers.
- **E2E upload fixture** is a minimal JPEG; very old browsers may reject.

## AI

- **Grok** optional via `VITE_GROK_API_KEY` — without it, mock AI + summarize path runs.
- **AI never blocks submit** — unavailable state shows amber fallback; manual category required.
- **Resilient wrapper** may fall back to mock on Grok errors.

## Rewards & trust

- **Points are demo seed values** — not connected to payment partners.
- **Youth cannot redeem** — by design; parent account required for catalog redemption.
- **Abuse flags** are illustrative; no legal enforcement workflow.

## Admin

- **No audit export** — moderation actions log to issue updates only.
- **Hotspot “predictions”** are seed + heuristic, not trained ML.
- **Resolution proof** uses seed media references, not a real CDN.

## Mobile demo

- **Safe-area / notch** — Tailwind utilities used; not tested on all devices.
- **Playwright mobile** emulates Pixel 5; real iOS Safari may differ for file inputs.
- **Bottom sheet** evidence picker requires tap targets ≥ 44px — verify on physical device.

## Out of scope (by design)

- Push notifications (onboarding educates only)
- Offline queue / sync
- Multi-tenant RBAC
- CSV / PDF export
