import type { ResolutionProof } from '@/types';
import { buildSeedResolutionProofs } from '@/services/mock/seed/resolutionProofs';
import { delay } from '@/utils/format';

let proofs: ResolutionProof[] = buildSeedResolutionProofs();

export function resetMockResolutionProofs(): void {
  proofs = buildSeedResolutionProofs();
}

export async function getResolutionProofForReport(reportId: string): Promise<ResolutionProof | null> {
  await delay(60);
  return proofs.find((p) => p.reportId === reportId) ?? null;
}

export async function reviewResolutionProof(
  proofId: string,
  action: 'approve' | 'reject',
  adminId: string,
): Promise<ResolutionProof> {
  await delay(100);
  const proof = proofs.find((p) => p.id === proofId);
  if (!proof) throw new Error(`Proof ${proofId} not found`);
  proof.status = action === 'approve' ? 'approved' : 'rejected';
  proof.reviewedAt = new Date().toISOString();
  proof.reviewedByAdminId = adminId;
  return { ...proof };
}

export function getMockResolutionProofsSnapshot(): ResolutionProof[] {
  return proofs;
}
