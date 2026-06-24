# Demo Media Strategy

CivicResolve supports **two judge-ready demo modes** without code changes — only environment flags and device choice.

---

## Mode A — Live capture (real phone)

**When:** You want to show camera-native civic reporting.

| Setting | Value |
|---------|--------|
| `VITE_FORCE_GALLERY_ONLY` | `false` |
| Device | iOS/Android phone or tablet with camera |
| Browser | Chrome / Safari mobile |

**Flow:**
1. Report → evidence sheet opens
2. **Take photo now** or **Record short video**
3. Grant camera permission (or deny once to demo fallback)

**Talking points:**
- Outdoor, one-handed reporting
- Permission denied → gallery upload still works
- Unsupported desktop → "Live capture unavailable" banner

---

## Mode B — Seeded upload (predictable judging)

**When:** Laptop projection, unreliable camera, or scripted demo.

| Setting | Value |
|---------|--------|
| `VITE_FORCE_GALLERY_ONLY` | `true` |
| Fixture | `src/test/fixtures/demo-photo.jpg` |

**Flow:**
1. Report → **Upload image from gallery**
2. Select `demo-photo.jpg` (minimal valid JPEG)
3. Continue through Details → Location → Review

**Talking points:**
- Same validation pipeline as live capture
- Size/type limits enforced (`VITE_MAX_IMAGE_MB`, etc.)
- Oversized file → inline `media-error-*` message

---

## Media states to demo (checklist)

| State | How to trigger | UI signal |
|-------|----------------|-----------|
| Take photo | Mode A, camera allow | `report-camera-capture` |
| Upload image | Mode B or gallery | `report-gallery-image-input` |
| Upload video | Gallery video input | `report-gallery-video-input` |
| Camera denied | Deny permission | `permission-denied-camera` + `capture-fallback-gallery` |
| Live unavailable | Desktop + no camera | `capture-fallback-gallery` in sheet |
| Text-only | `text-only-fallback` | `text-only-evidence-notice` |
| Oversized | File > 8 MB in test | `media-error-oversized_image` |
| Low quality | Small image in unit tests | `low-quality-warning` on review |
| Location denied | Deny geolocation | `permission-denied-location` + manual pin |

---

## Feed vs. upload media

- **Report flow** uses real `File` blobs (IndexedDB draft store).
- **Home/Nearby cards** use `public/mock-media/*.svg` placeholders for fast load — clarify to judges: "Submitted evidence uses the same validation path; feed thumbnails are demo assets."

---

## Quick env snippet

```env
# Predictable laptop demo
VITE_FORCE_GALLERY_ONLY=true

# Live phone demo
VITE_FORCE_GALLERY_ONLY=false

VITE_MAX_IMAGE_MB=8
VITE_MAX_VIDEO_MB=25
VITE_MAX_VIDEO_SEC=30
```

---

## E2E & integration coverage

- `I03`–`I05`, `I16b`–`I16c` — integration media fallbacks
- `E02` — Playwright upload with `demo-photo.jpg`
- `media-demo-checklist.md` — step-by-step QA list from Phase 6
