import { delay } from '@/utils/format';

const redeemedByUser = new Map<string, Set<string>>();

export function resetMockRedemptions(): void {
  redeemedByUser.clear();
}

export async function redeemCatalogItem(
  userId: string,
  catalogItemId: string,
): Promise<{ ok: boolean; error?: string }> {
  await delay(100);
  const set = redeemedByUser.get(userId) ?? new Set<string>();
  if (set.has(catalogItemId)) {
    return { ok: false, error: 'already_redeemed' };
  }
  set.add(catalogItemId);
  redeemedByUser.set(userId, set);
  return { ok: true };
}

export function hasRedeemed(userId: string, catalogItemId: string): boolean {
  return redeemedByUser.get(userId)?.has(catalogItemId) ?? false;
}
