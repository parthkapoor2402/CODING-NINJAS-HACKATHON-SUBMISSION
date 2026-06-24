# Permission & Fallback Flows — Reporting

## Camera / photo

```
Take photo now
    ↓
getUserMedia / ImageCapture adapter
    ↓ permission_denied → permission-denied-camera + gallery CTA
    ↓ unavailable → capture-fallback-gallery (upload only)
    ↓ success → media preview
```

**Gallery fallback:** `report-gallery-image-input` — always available in evidence sheet.

## Video

```
Record short video (if mediaRecorder + getUserMedia)
    ↓ else → Upload short video from device
```

Duration validated before attach; oversize/too-long show `media-error-*`.

## Location

```
Auto-capture on location step mount
    ↓ granted → editable pin (location-pin-adjust)
    ↓ denied → permission-denied-location + DEFAULT_PIN manual adjust
```

Map preview: `MapPreviewCard` with coordinates.

## AI

See `ai-reporting-fallbacks.md` — manual category/severity always available.

## Text-only (last resort)

`text-only-fallback` in evidence sheet — de-emphasized link. Enables submit without media; suspicious assessment applies.

## Evidence UX

1. Home / FAB → report flow
2. Bottom sheet (`report-evidence-sheet`) with prioritized media actions
3. Preview screen (`media-preview`) with real image/video element
4. Continue → details → location → review → success
