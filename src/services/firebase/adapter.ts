import type { BackendAdapter } from '@/services/types/backend';

const notImplemented = () => {
  throw new Error('Firebase adapter not implemented. Use VITE_BACKEND_PROVIDER=mock.');
};

/** Firebase adapter stub — implement in Phase 2 */
export const firebaseBackendAdapter: BackendAdapter = {
  users: {
    list: notImplemented,
    getById: notImplemented,
  },
  rewards: {
    listByUser: notImplemented,
    listBadges: notImplemented,
    listCatalog: notImplemented,
    listLeaderboard: notImplemented,
  },
  admin: {
    getQueue: notImplemented,
    getDashboardSnapshot: notImplemented,
    getSuspiciousCases: notImplemented,
    getFieldWorkers: notImplemented,
    assignWorker: notImplemented,
    reviewSuspiciousCase: notImplemented,
    dismissSuspiciousCase: notImplemented,
    resolveSuspiciousCase: notImplemented,
    mergeDuplicateReport: notImplemented,
    overrideReportStatus: notImplemented,
    recordModerationNote: notImplemented,
    getResponseTimeMetrics: notImplemented,
    getCategoryTrends: notImplemented,
    getRewardAbuseFlags: notImplemented,
    getPredictiveInsights: notImplemented,
    getHotspotInsights: notImplemented,
    getOpenIssuePinCount: notImplemented,
    getDuplicateRedirectRate: notImplemented,
    getResolutionProof: notImplemented,
    reviewResolutionProof: notImplemented,
    getFieldWorkerUpdates: notImplemented,
  },
};
