import { useEffect, useState } from 'react';
import type { Report, ResolutionProof } from '@/types';
import { seedMedia } from '@/services/mock/seed';
import { services } from '@/services/registry';
import { Camera, ImageIcon } from 'lucide-react';

interface ResolutionProofPlaceholderProps {
  report?: Pick<Report, 'id' | 'status' | 'resolvedAt'>;
}

export function ResolutionProofPlaceholder({ report }: ResolutionProofPlaceholderProps) {
  const [proof, setProof] = useState<ResolutionProof | null>(null);

  useEffect(() => {
    if (!report?.id) return;
    services.backend.admin.getResolutionProof(report.id).then(setProof);
  }, [report?.id]);

  const proofMedia = report
    ? seedMedia.filter((m) => m.reportId === report.id).slice(0, 1)
    : [];

  const showProof = proof?.status === 'approved' || (!proof && report?.resolvedAt);

  return (
    <section
      className="rounded-xl border border-dashed border-civic-teal-200 bg-civic-teal-50/40 p-4"
      data-testid="resolution-proof"
      aria-label="Resolution proof"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-civic-teal-100 text-civic-teal-700">
          <Camera className="h-4 w-4" aria-hidden />
        </span>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-civic-teal-900">Resolution proof</p>
          <p className="text-xs leading-relaxed text-civic-teal-800/85">
            {report?.resolvedAt
              ? `Marked fixed ${new Date(report.resolvedAt).toLocaleDateString()}. `
              : ''}
            Before/after photos from the field crew appear here when admin approves crew evidence.
          </p>
          {proof?.status === 'pending_review' ? (
            <div className="rounded-lg border border-civic-amber-200 bg-civic-amber-50/60 px-3 py-2 text-xs text-civic-amber-900">
              Crew submitted proof — awaiting admin review
            </div>
          ) : showProof && proofMedia.length > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-civic-teal-200 bg-white/70 p-2 text-xs text-civic-teal-900">
              <ImageIcon className="h-4 w-4" aria-hidden />
              {proof?.notes ?? 'Crew photo on file — verified by ward ops.'}
            </div>
          ) : (
            <div className="rounded-lg border border-civic-teal-100 bg-white/50 px-3 py-2 text-xs text-muted-foreground">
              Awaiting crew upload
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
