import { create } from 'zustand';
import { computeStreak, isStreakActive } from '@/domain/streaks';

const STORAGE_KEY = 'civic-resolve-verify-activity';

interface PersistedVerifyActivity {
  activityDates: string[];
  dismissedIds: string[];
}

function readStorage(): PersistedVerifyActivity {
  if (typeof sessionStorage === 'undefined') {
    return { activityDates: [], dismissedIds: [] };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { activityDates: [], dismissedIds: [] };
    return JSON.parse(raw) as PersistedVerifyActivity;
  } catch {
    return { activityDates: [], dismissedIds: [] };
  }
}

function writeStorage(data: PersistedVerifyActivity): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const initial = readStorage();

interface VerifyActivityState {
  activityDates: string[];
  dismissedIds: string[];
  recordUsefulVerification: (at?: string) => void;
  dismissOpportunity: (reportId: string) => void;
  isDismissed: (reportId: string) => boolean;
  getVerificationStreak: () => number;
  isStreakActiveToday: () => boolean;
  reset: () => void;
}

export const useVerifyActivityStore = create<VerifyActivityState>((set, get) => ({
  activityDates: initial.activityDates,
  dismissedIds: initial.dismissedIds,

  recordUsefulVerification(at = new Date().toISOString()) {
    set((state) => {
      const activityDates = [...state.activityDates, at];
      const next = { activityDates, dismissedIds: state.dismissedIds };
      writeStorage(next);
      return next;
    });
  },

  dismissOpportunity(reportId: string) {
    set((state) => {
      if (state.dismissedIds.includes(reportId)) return state;
      const dismissedIds = [...state.dismissedIds, reportId];
      const next = { activityDates: state.activityDates, dismissedIds };
      writeStorage(next);
      return next;
    });
  },

  isDismissed(reportId: string) {
    return get().dismissedIds.includes(reportId);
  },

  getVerificationStreak() {
    return computeStreak(get().activityDates);
  },

  isStreakActiveToday() {
    return isStreakActive(get().activityDates, new Date().toISOString());
  },

  reset() {
    const empty = { activityDates: [], dismissedIds: [] };
    writeStorage(empty);
    set(empty);
  },
}));

export function resetVerifyActivityStore(): void {
  useVerifyActivityStore.getState().reset();
}
