import { create } from 'zustand';
import {
  countRecentNudges,
  snoozeDurationMs,
  type NudgeHistoryEntry,
} from '@/domain/verification-nudges';

const STORAGE_KEY = 'civic-verify-nudges';

interface PersistedNudges {
  history: NudgeHistoryEntry[];
  snoozedUntil: Record<string, string>;
}

function readStorage(): PersistedNudges {
  if (typeof sessionStorage === 'undefined') {
    return { history: [], snoozedUntil: {} };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: [], snoozedUntil: {} };
    return JSON.parse(raw) as PersistedNudges;
  } catch {
    return { history: [], snoozedUntil: {} };
  }
}

function writeStorage(data: PersistedNudges): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const initial = readStorage();

interface VerificationNudgeState {
  history: NudgeHistoryEntry[];
  snoozedUntil: Record<string, string>;
  recordNudgeShown: (reportId: string) => void;
  snoozeReport: (reportId: string) => void;
  dismissNudge: (reportId: string) => void;
  getRecentNudgeCount24h: () => number;
  reset: () => void;
}

export const useVerificationNudgeStore = create<VerificationNudgeState>((set, get) => ({
  history: initial.history,
  snoozedUntil: initial.snoozedUntil,

  recordNudgeShown(reportId: string) {
    const entry: NudgeHistoryEntry = {
      reportId,
      shownAt: new Date().toISOString(),
      action: 'shown',
    };
    set((state) => {
      const history = [...state.history, entry].slice(-50);
      const next = { history, snoozedUntil: state.snoozedUntil };
      writeStorage(next);
      return next;
    });
  },

  snoozeReport(reportId: string) {
    const until = new Date(Date.now() + snoozeDurationMs()).toISOString();
    set((state) => {
      const history = [
        ...state.history,
        { reportId, shownAt: new Date().toISOString(), action: 'snoozed' as const },
      ].slice(-50);
      const snoozedUntil = { ...state.snoozedUntil, [reportId]: until };
      const next = { history, snoozedUntil };
      writeStorage(next);
      return next;
    });
  },

  dismissNudge(reportId: string) {
    set((state) => {
      const history = [
        ...state.history,
        { reportId, shownAt: new Date().toISOString(), action: 'dismissed' as const },
      ].slice(-50);
      const next = { history, snoozedUntil: state.snoozedUntil };
      writeStorage(next);
      return next;
    });
  },

  getRecentNudgeCount24h() {
    return countRecentNudges(get().history);
  },

  reset() {
    const empty = { history: [], snoozedUntil: {} };
    writeStorage(empty);
    set(empty);
  },
}));

export function resetVerificationNudgeStore(): void {
  useVerificationNudgeStore.getState().reset();
}
