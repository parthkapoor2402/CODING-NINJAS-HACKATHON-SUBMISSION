import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import type { ResolutionProof } from '@/types';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

interface AdminResolutionProofPanelProps {
  proof: ResolutionProof | null;
  onApprove?: (proofId: string) => void;
  onReject?: (proofId: string) => void;
  busy?: boolean;
}

export function AdminResolutionProofPanel({
  proof,
  onApprove,
  onReject,
  busy,
}: AdminResolutionProofPanelProps) {
  if (!proof) {
    return (
      <div
        className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground"
        data-testid="admin-resolution-proof"
      >
        No resolution proof on file. Crew uploads appear here for admin review before citizens see
        verified closure.
      </div>
    );
  }

  const statusVariant =
    proof.status === 'approved' ? 'verified' : proof.status === 'rejected' ? 'pending' : 'default';

  return (
    <section
      className="rounded-lg border border-civic-teal-200 bg-civic-teal-50/40 p-4"
      data-testid="admin-resolution-proof"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-civic-teal-700" />
          <p className="font-semibold text-civic-teal-900">Resolution proof</p>
        </div>
        <Chip variant={statusVariant}>{proof.status.replace('_', ' ')}</Chip>
      </div>
      {proof.notes ? (
        <p className="mt-2 text-sm text-civic-teal-900/90">{proof.notes}</p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Submitted {new Date(proof.submittedAt).toLocaleString()}
        {proof.reviewedAt ? ` · Reviewed ${new Date(proof.reviewedAt).toLocaleString()}` : ''}
      </p>
      {proof.status === 'pending_review' && onApprove && onReject ? (
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => onApprove(proof.id)} disabled={busy}>
            <CheckCircle className="h-4 w-4" />
            Approve proof
          </Button>
          <Button size="sm" variant="outline" onClick={() => onReject(proof.id)} disabled={busy}>
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      ) : null}
    </section>
  );
}
