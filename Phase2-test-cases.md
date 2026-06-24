# Phase 2 Test Cases — Issue Reporting Core

## Scope

Home CTA → report wizard (evidence → details → location → review) → submit → success.

Media: gallery image, mocked camera photo, gallery video, optional live video capture abstraction.

Validation, permissions, warnings, draft persistence, AI placeholder / fallback.

---

## Principles

| Principle | Test expectation |
|-----------|------------------|
| Image **and** video are valid evidence | Both attach successfully and satisfy submit requirements |
| Reporting without live capture or AI | Gallery + manual category/severity always available |
| Duplicate / suspicious flags | Banners shown; user can still proceed or adjust |
| Permission denied | Helpful copy + recoverable fallback (gallery / manual pin) |
| Failure states | Explicit error UI — no dead ends |

---

## Unit tests

### `media-validation`

| ID | Case | Expected |
|----|------|----------|
| U16 | JPEG image within limits | `ok: true` |
| U17 | PNG image within limits | `ok: true` |
| U18 | Unsupported type (PDF) | `error: unsupported_type` |
| U19 | Oversized image (> max MB) | `error: oversized_image` |
| U20 | MP4 video within limits | `ok: true` |
| U21 | Oversized video (> max MB) | `error: oversized_video` |
| U22 | Video duration over max seconds | `error: video_too_long` |
| U23 | Tiny image file | `ok: true`, `warning: low_quality` |

### `report-validation`

| ID | Case | Expected |
|----|------|----------|
| U24 | Empty title | Error message |
| U25 | Title too short (< 3 chars) | Error message |
| U26 | Empty description | Error message |
| U27 | Description too short (< 10 chars) | Error message |
| U28 | Valid title + description | No errors |
| U29 | `canSubmitReport` — incomplete draft | `false` |
| U30 | `canSubmitReport` — complete draft | `true` |

### `report-draft-persistence`

| ID | Case | Expected |
|----|------|----------|
| U31 | `saveDraft` writes to localStorage | Key `civic-report-draft-v1` |
| U32 | `loadDraft` restores fields | Title, category, step restored |
| U33 | `clearDraft` removes storage | Key absent |

### `media-capture` (abstraction)

| ID | Case | Expected |
|----|------|----------|
| U34 | `detectCapabilities` returns shape | Booleans for imageCapture, getUserMedia, mediaRecorder |
| U35 | Mock adapter `capturePhoto` success | Returns File with `source: camera` |
| U36 | Mock adapter permission denied | Returns `error: permission_denied` |

---

## Component tests

### Launch (`ReportFlowLaunch`)

| ID | Case | Expected |
|----|------|----------|
| C27 | Home primary CTA | Navigates to `/app/report`, `report-flow` visible |

### Evidence step (`ReportEvidenceStep`)

| ID | Case | Expected |
|----|------|----------|
| C28 | Gallery image upload | `media-preview` shows; attachment in store |
| C29 | Mocked camera capture | Camera flow attaches photo evidence |
| C30 | Gallery video upload | Video attachment in store |
| C31 | Video capture abstraction | Supported path calls adapter; attaches clip |
| C40 | Unsupported media type | `media-error-unsupported_type` |
| C41 | Oversized image | `media-error-oversized_image` |
| C42 | Oversized video | `media-error-oversized_video` |
| C43 | Video too long | `media-error-video_too_long` |
| C44 | Denied camera permission | `permission-denied-camera` + recovery hint |
| C46 | Live capture unavailable | `capture-fallback-gallery` visible |

### Details step (`ReportDetailsStep`)

| ID | Case | Expected |
|----|------|----------|
| C32 | Manual category selection | `category-pothole` updates store |
| C33 | AI suggestion placeholder | `ai-suggestion-placeholder` while loading |
| C35 | Title / description validation | Inline errors; continue blocked |
| C36 | Severity selection | `severity-high` updates store |
| C37 | Draft save on edit | localStorage updated after title change |
| C50 | AI unavailable fallback | `ai-unavailable-fallback`; manual category still works |

### Location step (`ReportLocationStep`)

| ID | Case | Expected |
|----|------|----------|
| C34 | Location capture + pin adjust | GPS sets pin; adjust inputs update coords |
| C45 | Denied location permission | `permission-denied-location` + manual pin fallback |

### Review step (`ReportReviewStep`)

| ID | Case | Expected |
|----|------|----------|
| C38 | Duplicate warning banner | `duplicate-warning` when risk high |
| C39 | Low-quality upload warning | `low-quality-warning` when flagged |
| C47 | Submit disabled | `report-submit-btn` disabled when incomplete |
| C48 | Successful submit | Creates report via mock service |
| C49 | Post-submit success | `report-success` with confirmation copy |

---

## Test IDs contract

| Element | `data-testid` |
|---------|---------------|
| Report wizard root | `report-flow` |
| Evidence step | `report-evidence-step` |
| Gallery image input | `report-gallery-image-input` |
| Gallery video input | `report-gallery-video-input` |
| Camera capture button | `report-camera-capture` |
| Video capture button | `report-video-capture` |
| Media preview | `media-preview` |
| Media errors | `media-error-{error_code}` |
| Camera permission denied | `permission-denied-camera` |
| Location permission denied | `permission-denied-location` |
| Capture fallback | `capture-fallback-gallery` |
| Details step | `report-details-step` |
| Category chips | `category-{id}` |
| AI placeholder | `ai-suggestion-placeholder` |
| AI unavailable | `ai-unavailable-fallback` |
| Title / description | `report-title-input`, `report-description-input` |
| Severity | `severity-{low\|medium\|high}` |
| Location step | `report-location-step` |
| Pin adjust | `location-pin-adjust` |
| Duplicate warning | `duplicate-warning` |
| Low quality warning | `low-quality-warning` |
| Submit button | `report-submit-btn` |
| Success state | `report-success` |

---

## Out of scope (Phase 2 tests only)

- Full visual polish / animations
- Live Grok API integration
- Real map rendering
- E2E Playwright report flow (future)
