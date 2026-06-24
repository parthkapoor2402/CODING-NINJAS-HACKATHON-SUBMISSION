import {
  DEFAULT_ONBOARDING_STATE,
  ONBOARDING_STORAGE_KEY,
  type OnboardingPersistedState,
} from '@/types/onboarding';

export function loadOnboardingState(
  storage: Storage = localStorage,
): OnboardingPersistedState {
  try {
    const raw = storage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ONBOARDING_STATE };
    const parsed = JSON.parse(raw) as Partial<OnboardingPersistedState>;
    return {
      ...DEFAULT_ONBOARDING_STATE,
      ...parsed,
      permissions: {
        ...DEFAULT_ONBOARDING_STATE.permissions,
        ...parsed.permissions,
      },
    };
  } catch {
    return { ...DEFAULT_ONBOARDING_STATE };
  }
}

export function saveOnboardingState(
  state: OnboardingPersistedState,
  storage: Storage = localStorage,
): void {
  storage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
}

export function clearOnboardingState(storage: Storage = localStorage): void {
  storage.removeItem(ONBOARDING_STORAGE_KEY);
}
