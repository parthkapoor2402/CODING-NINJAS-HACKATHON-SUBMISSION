# Media Validation Rules

Implemented in `src/lib/media-validation.ts` and `src/lib/constants.ts` (`MEDIA_LIMITS`).

## Accepted types

| Kind | MIME types |
|------|------------|
| Image | `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `image/heif` |
| Video | `video/mp4`, `video/webm`, `video/quicktime` |

## Limits (env-configurable)

| Rule | Default |
|------|---------|
| Max image size | 8 MB |
| Max video size | 25 MB |
| Max video duration | 30 seconds |
| Low-quality image | &lt; 10 KB (warning, not block) |

## Error codes → UI

| Code | `data-testid` | Message |
|------|---------------|---------|
| `unsupported_type` | `media-error-unsupported_type` | File type guidance |
| `oversized_image` | `media-error-oversized_image` | 8 MB limit |
| `oversized_video` | `media-error-oversized_video` | 25 MB limit |
| `video_too_long` | `media-error-video_too_long` | 30s limit |

## Video duration

Read via `src/lib/video-metadata.ts` (`readVideoDuration`) after file selection.

## Storage

- File blobs: in-memory `reportMediaFiles` map (not localStorage)
- Preview URLs: `URL.createObjectURL` with revoke on clear
- Submit uploads real blob via `services.media`
