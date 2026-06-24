# Media Capture Strategy — CivicResolve

> Real device capture is first-class. AI uses media metadata when available—but reporting never depends on AI.

*Technical patterns aligned with MDN `getUserMedia`, web.dev media recording guidance, and PWA camera best practices.*

---

## 1. Design Goals

1. **Capture in context** — Rear camera default for outdoor issues (`facingMode: environment`).
2. **Never block reporting** — Every capture path has gallery/upload fallback.
3. **Demo reliable** — Strict size/duration limits; client compression; clear errors.
4. **Privacy-conscious** — EXIF stripped by default; GPS from device with consent.
5. **Trust-enabling** — Media feeds duplicate detection (hash + geo) without exposing raw EXIF to public.

---

## 2. Capture Capability Matrix

| Capability | Primary API | Fallback 1 | Fallback 2 |
|------------|-------------|------------|------------|
| Photo (live) | `ImageCapture.takePhoto()` | `getUserMedia` + canvas `toBlob` | `<input type="file" accept="image/*" capture="environment">` |
| Photo (gallery) | `<input accept="image/*">` | Drag-drop (desktop admin) | — |
| Video (live) | `MediaRecorder` + `getUserMedia` | `<input accept="video/*" capture>` | Gallery video upload |
| Video (gallery) | `<input accept="video/*">` | — | — |
| Location | `navigator.geolocation` | Manual map pin | Address search (adapter) |

### Browser support strategy

```
detectCapabilities() → {
  imageCapture: boolean,
  getUserMedia: boolean,
  mediaRecorder: boolean,
  fileInputCapture: boolean,
  geolocation: boolean
}
```

UI shows only supported actions; unsupported live capture → gallery CTA prominent.

---

## 3. Real Photo Capture Flow

### UX steps
1. User taps **“Take photo”** on report media step.
2. **Primer already shown** in onboarding; inline reminder: “Camera will activate.”
3. Full-screen camera viewfinder (custom UI) OR native picker via hidden input.
4. Shutter → preview with **Retake** / **Use photo**.
5. Optional crop (1:1 or 16:9) — MVP: skip crop, accept full frame.
6. Client validate → compress → attach to `reportDraftStore`.

### Technical flow (preferred)

```typescript
// Pseudocode — implementation phase
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
  audio: false,
});
const track = stream.getVideoTracks()[0];
const imageCapture = new ImageCapture(track);
const blob = await imageCapture.takePhoto();
track.stop(); // battery + privacy — always stop tracks when done
```

### Fallback: canvas grab
- `video` element bound to stream → `canvas.toBlob('image/jpeg', 0.85)` (never `toDataURL`—memory).

### Fallback: native input
```html
<input type="file" accept="image/*" capture="environment" class="sr-only" />
```
Custom styled button triggers `input.click()`.

---

## 4. Real Short Video Flow

### Limits (demo reliability)

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Max duration | **30 seconds** | Storage + upload time |
| Max file size (post-compress) | **25 MB** | Mobile uplink |
| Min duration | 1 second | Meaningful evidence |
| Formats accepted | `video/mp4`, `video/webm`, `video/quicktime` | iOS + Android browsers |
| Resolution target | 720p max | Compress if higher |

### UX steps
1. Tap **“Record video”** → request camera (+ mic optional off for civic issues).
2. Viewfinder with **record timer** (countdown at 25s warning).
3. Stop → preview with play, **Retake** / **Use clip**.
4. Validate duration + size → attach.

### Technical flow

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'environment' },
  audio: false, // default off — garbage issue doesn't need audio
});
const recorder = new MediaRecorder(stream, { mimeType: preferredMimeType });
// chunks → Blob on stop → validate → compress/transcode if needed (Phase 2)
// MVP: reject over-limit with clear message
```

### Fallback
- `<input type="file" accept="video/*" capture>` opens native camera app on many mobiles.
- Gallery pick for pre-recorded clip.

---

## 5. Gallery Upload Flow

1. Tap **“Choose from gallery”**.
2. File picker (no `capture` attribute).
3. Validate MIME, size, dimensions.
4. Generate thumbnail (canvas for image; `<video>` poster frame for video).
5. Store in draft; show in carousel with delete.

**Multi-select:** Up to **3 photos** OR **1 video + 1 photo** per report (MVP).

---

## 6. Permission Handling

### Permission primer (before OS prompt)
- **Location:** “Pin issues on the map so crews find them.”
- **Camera:** “A photo helps verify and fix faster.”
- **Library:** “You can also upload an existing photo.”

### Request timing
- **Just-in-time:** Only when user taps Take photo / Record / Use my location.
- Never on cold app start (web.dev best practice).

### Permission-denied UX

| Permission | Denied UI |
|------------|-----------|
| Camera | Inline card: “Camera blocked” + steps to enable in browser settings + **Upload from gallery** primary CTA |
| Location | Map defaults to city center; **Place pin manually** + search; banner explains |
| Library | Rare; show file drag on desktop admin only |

### Permission query (where supported)

```typescript
const status = await navigator.permissions.query({ name: 'camera' });
// granted | prompt | denied — adjust UI before requesting
```

**Note:** Safari limitations on Permissions API—treat `prompt` as unknown, still show primer.

---

## 7. Unsupported Device / Browser UX

| Condition | Behavior |
|-----------|----------|
| No `mediaDevices` | Hide live capture; gallery + manual upload only |
| HTTP (non-secure) | Banner: “Camera requires secure connection”; gallery may still work for files |
| Desktop citizen demo | Webcam capture + file upload both shown |
| `MediaRecorder` unsupported | Video → file upload only |
| iOS older WebKit | Prefer `<input capture>` for reliability |

**Copy:** “Your browser doesn’t support in-app camera. You can still upload a photo.”

---

## 8. Media Validation Rules

### Images

| Rule | Limit | Error message |
|------|-------|---------------|
| Max file size (pre-compress) | 12 MB | “Photo too large. Try another or take a new one.” |
| Max file size (post-compress) | 2 MB target | Auto-compress; fail if still > 8 MB |
| Min dimensions | 400×300 | “Photo too small to verify” |
| Max dimensions | 4096×4096 | Downscale |
| MIME | `image/jpeg`, `image/png`, `image/webp`, `image/heic`* | “Unsupported format” |

*HEIC: convert to JPEG client-side where possible (Phase 2); MVP: prompt retake on unsupported decode.

### Videos

| Rule | Limit |
|------|-------|
| Max size | 25 MB |
| Max duration | 30 sec |
| Min duration | 1 sec |

### Client pipeline

```
File/Blob
  → validate MIME + size
  → compress (image: browser-image-compression or canvas quality loop)
  → generate thumbnail + perceptual hash (duplicate detection)
  → strip EXIF (except user opts in to photo location)
  → upload via MediaStorage adapter
```

---

## 9. Compression & Size Assumptions

| Asset | Target | Method |
|-------|--------|--------|
| Photo upload | 1200–1600px long edge, JPEG 0.82 | Canvas resize / library |
| Thumbnail | 320px, JPEG 0.7 | Async before upload |
| Video | No transcode MVP; reject if over limit | Phase 2: ffmpeg.wasm or server |
| Perceptual hash | 64-bit pHash on thumbnail | Duplicate pipeline |

**Storage MVP:** IndexedDB blobs + object URLs; metadata in report entity.

---

## 10. Geolocation + Media Correlation

| Source | Use |
|--------|-----|
| Device GPS at submit | Primary pin (with accuracy radius) |
| EXIF GPS | Cross-check only; if mismatch > 200m → flag `WRONG_LOCATION` risk |
| Manual pin | User override always allowed |

**Default:** Strip EXIF on export to storage; keep `gpsFromExif` in admin-only metadata if extracted pre-strip.

---

## 11. AI + Media (Non-Mandatory)

### What AI receives
- Thumbnail (not full res) as base64 or URL
- User description text
- Category list
- Optional: duration, dimensions, capture source
- **Not** raw EXIF in citizen-visible flows

### AI outputs (stored in `report.aiMetadata`)
- `suggestedCategory`, `confidence`
- `severityHint`
- `duplicateRiskHints[]`
- `generatedSummary`

### Fallback rules

| Condition | Behavior |
|-----------|----------|
| AI timeout (>3s) | Skip; user picks category manually |
| AI error | Toast “Suggestions unavailable”—no block |
| User declines AI | Setting `aiAssistEnabled: false` — manual only |
| No media attached | AI uses text-only; lower confidence shown |
| Low confidence < 0.6 | UI shows “Please confirm category” |

**Reporting never requires AI.** Submit button enabled with manual category + location + ≥0 media (MVP: ≥1 photo **or** video recommended but allow text-only with `pending_verification` hold).

---

## 12. Duplicate & Fake Detection Using Media + Text + Location

### Combined scoring (see trust-and-safety.md)

```
duplicateRisk =
  geoProximityScore (0-40)
+ textSimilarityScore (0-25)
+ perceptualHashScore (0-25)
+ temporalScore (0-10)

fakeRisk =
  velocityScore
+ gpsExifMismatchScore
+ stockImageScore (Phase 2)
+ noMediaScore
+ spamTextScore
```

### UX integration
- **Before submit:** Show duplicate sheet if `duplicateRisk >= 40`.
- **After submit:** Admin sees both scores on detail panel.
- **Corroboration:** New media from verifier updates hash cluster.

---

## 13. Component Architecture (Implementation Reference)

```
src/components/media/
├── MediaCaptureSheet.tsx       # orchestrator
├── CameraViewfinder.tsx        # getUserMedia preview
├── PhotoPreview.tsx
├── VideoRecorder.tsx
├── GalleryPicker.tsx           # hidden inputs + custom buttons
├── MediaCarousel.tsx
├── PermissionDeniedCard.tsx
├── UnsupportedBrowserCard.tsx
└── hooks/
    ├── useMediaCapabilities.ts
    ├── useCameraStream.ts
    ├── useGeolocation.ts
    ├── useMediaValidation.ts
    └── useImageCompression.ts
```

### Feature flag
- `VITE_FORCE_GALLERY_ONLY=true` — demo mode if judge device blocks camera.

---

## 14. Security & Privacy

- Stop all `MediaStream` tracks on unmount / background tab (visibility listener).
- No camera preview without visible indicator (“Camera active” dot).
- Secure context required for live capture (HTTPS / localhost).
- Media URLs signed and time-limited on production backend.
- Youth mode: disable public EXIF location extraction entirely.

---

## 15. Testing Strategy (Media-Specific)

| Test | Tool | Scenario |
|------|------|----------|
| Validation unit | Vitest | Oversized file, wrong MIME, duration |
| Compression unit | Vitest | 4000px → <2MB |
| Component | RTL | Permission denied card renders gallery CTA |
| Playwright | `grantPermissions` / `deny` | Camera denied → gallery path works |
| Playwright | File upload fixture | Submit report with image |
| Manual | Real iOS Safari + Android Chrome | `<input capture>` path |

Mock `navigator.mediaDevices` in unit tests; E2E uses real file chooser where possible.

---

## 16. MVP Checklist

- [ ] Photo: camera + gallery + validation + compress
- [ ] Video: record OR upload + duration/size enforce
- [ ] Location: GPS + manual pin + denied fallback
- [ ] Permission primers + denied UX
- [ ] Unsupported browser detection
- [ ] AI optional with timeout fallback
- [ ] Thumbnail + hash for duplicate check
- [ ] EXIF strip before storage

---

## Related Documents

- [architecture.md](./architecture.md)
- [trust-and-safety.md](./trust-and-safety.md)
- [product-requirements.md](./product-requirements.md)
- [design-direction.md](./design-direction.md)
