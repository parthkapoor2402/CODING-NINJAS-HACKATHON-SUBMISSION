import { Camera, FileText, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface EvidenceActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liveCaptureAvailable: boolean;
  onCamera: () => void;
  onVideoCapture: () => void;
  onGalleryImage: () => void;
  onGalleryVideo: () => void;
  onTextOnly?: () => void;
}

export function EvidenceActionSheet({
  open,
  onOpenChange,
  liveCaptureAvailable,
  onCamera,
  onVideoCapture,
  onGalleryImage,
  onGalleryVideo,
  onTextOnly,
}: EvidenceActionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-4" data-testid="report-evidence-sheet">
        <SheetHeader>
          <SheetTitle>Add evidence</SheetTitle>
          <SheetDescription>
            Photo or short video helps neighbors verify faster. Media-rich reports reach crews sooner.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-2">
          {liveCaptureAvailable ? (
            <>
              <Button
                type="button"
                variant="civic"
                size="lg"
                className="w-full justify-start"
                data-testid="report-camera-capture"
                onClick={() => {
                  onCamera();
                  onOpenChange(false);
                }}
              >
                <Camera className="h-5 w-5" />
                Take photo now
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full justify-start"
                data-testid="report-video-capture"
                onClick={() => {
                  onVideoCapture();
                  onOpenChange(false);
                }}
              >
                <Video className="h-5 w-5" />
                Record short video
              </Button>
            </>
          ) : (
            <div
              className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 p-4 text-sm"
              data-testid="capture-fallback-gallery"
            >
              <p className="font-medium text-amber-900">Live capture unavailable</p>
              <p className="mt-1 text-xs text-amber-900/80">
                Upload a photo or video from your device instead.
              </p>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full justify-start"
            onClick={() => {
              onGalleryImage();
              onOpenChange(false);
            }}
          >
            <Image className="h-5 w-5" />
            Upload image from gallery
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full justify-start"
            onClick={() => {
              onGalleryVideo();
              onOpenChange(false);
            }}
          >
            <Video className="h-5 w-5" />
            Upload short video
          </Button>

          {onTextOnly ? (
            <button
              type="button"
              data-testid="text-only-fallback"
              className="mt-2 w-full py-2 text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => {
                onTextOnly();
                onOpenChange(false);
              }}
            >
              <FileText className="mr-1 inline h-3.5 w-3.5" />
              Continue with description only (lower verification priority)
            </button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
