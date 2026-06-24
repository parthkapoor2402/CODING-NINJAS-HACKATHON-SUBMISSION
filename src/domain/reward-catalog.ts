export interface RewardCatalogItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  minTrustScore: number;
}

export interface CatalogLockState {
  item: RewardCatalogItem;
  locked: boolean;
  reason?: string;
}

export function evaluateCatalogItem(
  item: RewardCatalogItem,
  redeemablePoints: number,
  trustScore: number,
  rewardsFrozen: boolean,
): CatalogLockState {
  if (rewardsFrozen) {
    return { item, locked: true, reason: 'rewards_frozen' };
  }
  if (trustScore < item.minTrustScore) {
    return { item, locked: true, reason: 'trust_too_low' };
  }
  if (redeemablePoints < item.pointsCost) {
    return { item, locked: true, reason: 'insufficient_points' };
  }
  return { item, locked: false };
}

export function evaluateCatalog(
  items: RewardCatalogItem[],
  redeemablePoints: number,
  trustScore: number,
  rewardsFrozen: boolean,
): CatalogLockState[] {
  return items.map((item) =>
    evaluateCatalogItem(item, redeemablePoints, trustScore, rewardsFrozen),
  );
}
