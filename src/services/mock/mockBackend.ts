import type { BackendAdapter } from '@/services/types/backend';
import {
  getUserById,
  seedBadges,
  seedCatalog,
  seedRewards,
  seedUsers,
} from '@/services/mock/seed';
import { mockAdminService } from '@/services/mock/mockAdmin';
import { delay } from '@/utils/format';

export const mockBackendAdapter: BackendAdapter = {
  users: {
    async list() {
      await delay(100);
      return seedUsers;
    },
    async getById(id: string) {
      await delay(50);
      return getUserById(id) ?? null;
    },
  },
  rewards: {
    async listByUser(userId: string) {
      await delay(100);
      return seedRewards.filter((r) => r.userId === userId);
    },
    async listBadges() {
      await delay(50);
      return seedBadges;
    },
    async listCatalog() {
      await delay(50);
      return seedCatalog;
    },
    async listLeaderboard() {
      await delay(80);
      return seedUsers
        .filter((u) => u.role === 'citizen' || u.role === 'parent')
        .map((u) => ({
          userId: u.id,
          displayName: u.displayName,
          contributionScore: u.trust.contributionScore,
          trustScore: u.trust.trustScore,
        }))
        .sort((a, b) => b.contributionScore - a.contributionScore);
    },
  },
  admin: mockAdminService,
};
