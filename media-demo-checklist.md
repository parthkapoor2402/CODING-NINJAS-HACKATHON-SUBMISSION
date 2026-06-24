# Media Demo Checklist — Phase 6

Use on a **physical mobile device** (or Playwright `mobile-chrome`) before judging demos.

## Evidence step

- [ ] Bottom sheet opens on first visit with camera / gallery / video options
- [ ] Gallery **image** upload shows `media-preview` thumbnail
- [ ] Gallery **video** upload shows preview + duration within limit
- [ ] **Camera denied** shows `permission-denied-camera` + gallery fallback
- [ ] **Text-only fallback** works; review step warns about verification impact
- [ ] **Oversized image** shows `media-error-oversized_image` (try >8MB if limit unchanged)
- [ ] **Oversized video** shows `media-error-oversized_video` or `video_too_long`
- [ ] **Low-quality tiny image** triggers low-quality warning on review (optional)

## Location step

- [ ] GPS success pins map preview with coordinates
- [ ] **Location denied** shows `permission-denied-location` + manual pin adjust grid
- [ ] Pin adjust updates `location-pin-display`
- [ ] Duplicate risk banner on review when near seed pothole (`report-001` area)

## AI assist (details step)

- [ ] With description ≥10 chars after media: loading → suggestions **or** unavailable fallback
- [ ] **AI unavailable** (no API key / forced error): amber `ai-unavailable-fallback`, manual category still works
- [ ] Apply suggestions button fills category/severity when panel visible

## Review & submit

- [ ] Duplicate warning + **support existing** link when applicable
- [ ] Suspicious / low-quality warnings visible when seeded
- [ ] Submit disabled until complete; success shows `report-success`

## Citizen visibility

- [ ] Resolved report shows `resolution-proof` — pending vs approved states
- [ ] Suspicious issue (`report-003`) shows `suspicious-issue-notice`

## Admin proof review

- [ ] `report-002` — pending proof with approve/reject on admin detail
- [ ] Approved proof on `report-004` visible to citizens after admin approval

## Regression commands

```bash
npm run test:integration
npm run test:e2e -- --project=mobile-chrome
```
