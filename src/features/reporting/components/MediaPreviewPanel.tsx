import { Film, ImageIcon } from 'lucide-react';
import type { DraftMediaAttachment } from '@/types/reporting';
import { getMediaPreviewUrl } from '@/store/reportMediaFiles';

interface MediaPreviewPanelProps {
  attachments: DraftMediaAttachment[];
}

export function MediaPreviewPanel({ attachments }: MediaPreviewPanelProps) {
  if (attachments.length === 0) return null;

  const primary = attachments[attachments.length - 1];
  const previewUrl = primary.previewUrl ?? getMediaPreviewUrl(primary.id);

  return (
    <div className="space-y-3" data-testid="media-preview">
      <div className="overflow-hidden rounded-xl border bg-black/5">
        {primary.type === 'photo' && previewUrl ? (
          <img
            src={previewUrl}
            alt={primary.fileName}
            className="max-h-56 w-full object-cover"
          />
        ) : primary.type === 'video' && previewUrl ? (
          <video
            src={previewUrl}
            controls
            playsInline
            className="max-h-56 w-full bg-black object-contain"
          />
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            {primary.type === 'photo' ? (
              <ImageIcon className="h-10 w-10" />
            ) : (
              <Film className="h-10 w-10" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
        </span>
        <span className="text-xs capitalize text-muted-foreground">{primary.type}</span>
      </div>

      {attachments.length > 1 ? (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {attachments.map((a) => (
            <li key={a.id}>
              {a.fileName}
              {a.lowQualityWarning ? ' · low quality' : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          {primary.fileName}
          {primary.lowQualityWarning ? ' · low quality' : ''}
          {primary.durationSec ? ` · ${Math.round(primary.durationSec)}s` : ''}
        </p>
      )}
    </div>
  );
}
