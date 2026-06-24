import { create } from 'zustand';
import { loadOnboardingState, saveOnboardingState } from '@/lib/onboarding-persistence';
import type { AuthPath, OnboardingPersistedState, PermissionType, Persona } from '@/types/onboarding';
import { DEFAULT_ONBOARDING_STATE } from '@/types/onboarding';

const initialOnboarding = loadOnboardingState();

interface OnboardingStore extends OnboardingPersistedState {
  hydrated: boolean;
  hydrate: () => void;
  persist: () => void;
  setPersona: (persona: Persona) => void;
  acknowledgePermission: (permission: PermissionType) => void;
  setAuthPath: (path: AuthPath) => void;
  completeOnboarding: () => void;
  dismissFirstSessionEducation: () => void;
  resetOnboarding: () => void;
}

function syncToStorage(state: OnboardingPersistedState) {
  saveOnboardingState(state);
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...initialOnboarding,
  hydrated: true,

  hydrate() {
    const loaded = loadOnboardingState();
    set({ ...loaded, hydrated: true });
  },

  persist() {
    const { persona, permissions, onboardingComplete, authPath, firstSessionEducationSeen } = get();
    syncToStorage({
      persona,
      permissions,
      onboardingComplete,
      authPath,
      firstSessionEducationSeen,
    });
  },

  setPersona(persona) {
    set({ persona });
    get().persist();
  },

  acknowledgePermission(permission) {
    set((s) => ({
      permissions: { ...s.permissions, [permission]: true },
    }));
    get().persist();
  },

  setAuthPath(authPath) {
    set({ authPath });
    get().persist();
  },

  completeOnboarding() {
    set({ onboardingComplete: true });
    get().persist();
  },

  dismissFirstSessionEducation() {
    set({ firstSessionEducationSeen: true });
    get().persist();
  },

  resetOnboarding() {
    set({ ...DEFAULT_ONBOARDING_STATE });
    syncToStorage({ ...DEFAULT_ONBOARDING_STATE });
  },
}));

export function selectOnboardingComplete(state: OnboardingStore): boolean {
  return state.onboardingComplete;
}

export function selectShowFirstSessionEducation(state: OnboardingStore): boolean {
  return state.onboardingComplete && !state.firstSessionEducationSeen;
}
