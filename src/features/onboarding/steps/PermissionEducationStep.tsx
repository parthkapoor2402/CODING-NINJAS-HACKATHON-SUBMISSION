import type { PermissionType } from '@/types/onboarding';
import { PERMISSION_EDUCATION } from '@/features/onboarding/onboarding-config';
import { MapPin, Camera, Bell, ImageIcon } from 'lucide-react';

const ICONS = {
  location: MapPin,
  camera: Camera,
  notifications: Bell,
} as const;

interface PermissionEducationStepProps {
  type: PermissionType;
  onAcknowledge: () => void;
  acknowledged?: boolean;
}

export function PermissionEducationStep({
  type,
  onAcknowledge,
  acknowledged = false,
}: PermissionEducationStepProps) {
  const content = PERMISSION_EDUCATION[type];
  const Icon = ICONS[type];

  return (
    <div className="space-y-6" data-testid={`permission-${type}`}>
      <div className="relative overflow-hidden rounded-2xl border border-civic-blue-100 bg-white p-6 shadow-card">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-civic-teal-500/10" />
        <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-civic-blue-600/10" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-civic-blue-600 to-civic-teal-500 text-white shadow-elevated">
          <Icon className="h-10 w-10" strokeWidth={1.75} aria-hidden />
        </div>
        {type === 'camera' ? (
          <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-civic-blue-50 px-3 py-1 text-xs font-medium text-civic-blue-700">
            <ImageIcon className="h-3.5 w-3.5" />
            Camera &amp; gallery photos
          </div>
        ) : null}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">{content.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{content.body}</p>
        <p className="mt-2 text-xs text-muted-foreground/80">{content.hint}</p>
      </div>

      <button
        type="button"
        data-testid={`permission-ack-${type}`}
        className={
          acknowledged
            ? 'text-sm font-semibold text-civic-teal-600'
            : 'rounded-xl bg-civic-blue-50 px-4 py-3 text-sm font-semibold text-civic-blue-700 transition-colors hover:bg-civic-blue-100'
        }
        onClick={onAcknowledge}
        disabled={acknowledged}
      >
        {acknowledged ? '✓ Understood' : content.button}
      </button>
    </div>
  );
}
