import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MEDIA_LIMITS } from '@/lib/constants';
import { canUseLiveCapture, getMediaCaptureAdapter } from '@/lib/media-capture';
import { validateMediaFile, validateVideoDuration } from '@/lib/media-validation';
import { readVideoDuration } from '@/lib/video-metadata';
import { EvidenceActionSheet } from '@/features/reporting/components/EvidenceActionSheet';
import { MediaPreviewPanel } from '@/features/reporting/components/MediaPreviewPanel';
import { createMediaAttachmentFromFile } from '@/features/reporting/report-media';
import { useReportDraftStore } from '@/store/reportDraftStore';
import type { MediaValidationError } from '@/lib/media-validation';

export function EvidenceStep() {
  const attachments = useReportDraftStore((s) => s.draft.mediaAttachments);
  const textOnlyFallback = useReportDraftStore((s) => s.draft.textOnlyFallback);
  const addMedia = useReportDraftStore((s) => s.addMediaAttachment);
  const updateDraft = useReportDraftStore((s) => s.updateDraft);
  const setStep = useReportDraftStore((s) => s.setStep);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [sheetOpen, setSheetOpen] = useState(attachments.length === 0 && !textOnlyFallback);
  const [mediaError, setMediaError] = useState<MediaValidationError | null>(null);
  const [cameraDenied, setCameraDenied] = useState(false);
  const liveCaptureAvailable = canUseLiveCapture();

  const attachFile = async (file: File, source: 'camera' | 'gallery') => {
    setMediaError(null);
    updateDraft({ textOnlyFallback: false });
    const validation = validateMediaFile(file);
    if (!validation.ok) {
      setMediaError(validation.error);
      return;
    }

    let durationSec: number | undefined;
    if (validation.type === 'video') {
      durationSec = await readVideoDuration(file);
      const durationCheck = validateVideoDuration(durationSec);
      if (!durationCheck.ok) {
        setMediaError(durationCheck.error);
        return;
      }
    }

    addMedia(
      createMediaAttachmentFromFile(file, source, {
        durationSec,
        lowQualityWarning: validation.warning === 'low_quality',
      }),
    );
    setSheetOpen(false);
  };

  const handleGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await attachFile(file, 'gallery');
    e.target.value = '';
  };

  const handleGalleryVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await attachFile(file, 'gallery');
    e.target.value = '';
  };

  const handleCameraCapture = async () => {
    setMediaError(null);
    setCameraDenied(false);
    const result = await getMediaCaptureAdapter().capturePhoto();
    if (!result.ok) {
      if (result.error === 'permission_denied') {
        setCameraDenied(true);
        updateDraft({ cameraPermissionDenied: true });
      }
      return;
    }
    await attachFile(result.file, 'camera');
  };

  const handleVideoCapture = async () => {
    setMediaError(null);
    setCameraDenied(false);
    const result = await getMediaCaptureAdapter().captureVideo(MEDIA_LIMITS.maxVideoSec);
    if (!result.ok) {
      if (result.error === 'permission_denied') {
        setCameraDenied(true);
        updateDraft({ cameraPermissionDenied: true });
      }
      return;
    }
    if (result.durationSec) {
      const durationCheck = validateVideoDuration(result.durationSec);
      if (!durationCheck.ok) {
        setMediaError(durationCheck.error);
        return;
      }
    }
    await attachFile(result.file, 'camera');
  };

  const handleTextOnly = () => {
    updateDraft({ textOnlyFallback: true });
    setSheetOpen(false);
  };

  const canContinue = attachments.length > 0 || textOnlyFallback;

  return (
    <div className="space-y-4" data-testid="report-evidence-step">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        data-testid="report-gallery-image-input"
        onChange={handleGalleryImage}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        data-testid="report-gallery-video-input"
        onChange={handleGalleryVideo}
      />

      {/* Evidence action sheet */}
      <EvidenceActionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        liveCaptureAvailable={liveCaptureAvailable}
        onCamera={handleCameraCapture}
        onVideoCapture={handleVideoCapture}
        onGalleryImage={() => imageInputRef.current?.click()}
        onGalleryVideo={() => videoInputRef.current?.click()}
        onTextOnly={handleTextOnly}
      />

      {!sheetOpen && attachments.length === 0 && !textOnlyFallback ? (
        <Button variant="civic" className="w-full" size="lg" onClick={() => setSheetOpen(true)}>
          <Plus className="h-5 w-5" />
          Add photo or video
        </Button>
      ) : null}

      {attachments.length > 0 ? <MediaPreviewPanel attachments={attachments} /> : null}

      {textOnlyFallback && attachments.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-4 text-sm text-muted-foreground"
          data-testid="text-only-evidence-notice"
        >
          Continuing without media — add a clear description on the next step.
        </div>
      ) : null}

      {attachments.length > 0 ? (
        <Button variant="outline" className="w-full" onClick={() => setSheetOpen(true)}>
          Add more evidence
        </Button>
      ) : null}

      {cameraDenied ? (
        <div className="space-y-3">
          <div
            className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 p-3 text-sm"
            data-testid="permission-denied-camera"
            role="alert"
          >
            <p className="font-medium text-amber-900">Camera access denied</p>
            <p className="mt-1 text-xs text-amber-900/80">
              You can still report using gallery upload below.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            data-testid="capture-fallback-gallery"
            onClick={() => imageInputRef.current?.click()}
          >
            Upload from gallery instead
          </Button>
        </div>
      ) : null}

      {mediaError ? (
        <p className="text-sm text-destructive" data-testid={`media-error-${mediaError}`} role="alert">
          {mediaError === 'unsupported_type' && 'Unsupported file type. Use JPEG, PNG, WebP, MP4, or WebM.'}
          {mediaError === 'oversized_image' && 'Image is too large. Choose a file under 8 MB.'}
          {mediaError === 'oversized_video' && 'Video is too large. Choose a file under 25 MB.'}
          {mediaError === 'video_too_long' && 'Video is too long. Keep clips under 30 seconds.'}
        </p>
      ) : null}

      <Button variant="civic" className="w-full" disabled={!canContinue} onClick={() => setStep(1)}>
        Continue
      </Button>
    </div>
  );
}
