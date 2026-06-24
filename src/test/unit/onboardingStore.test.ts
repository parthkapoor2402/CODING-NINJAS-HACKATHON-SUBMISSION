import { beforeEach, describe, expect, it } from 'vitest';
import { clearOnboardingState } from '@/lib/onboarding-persistence';
import { DEFAULT_ONBOARDING_STATE } from '@/types/onboarding';
import { useOnboardingStore } from '@/store/onboardingStore';
describe('onboardingStore', () => {
  beforeEach(() => {
    clearOnboardingState();
    useOnboardingStore.getState().resetOnboarding();
    useOnboardingStore.getState().hydrate();
  });

  it('U1: default state is incomplete', () => {
    const state = useOnboardingStore.getState();
    expect(state.onboardingComplete).toBe(false);
    expect(state.persona).toBeNull();
  });

  it('U2: setPersona stores persona', () => {
    useOnboardingStore.getState().setPersona('resident');
    expect(useOnboardingStore.getState().persona).toBe('resident');
  });

  it('U3: acknowledgePermission updates permissions', () => {
    useOnboardingStore.getState().acknowledgePermission('location');
    expect(useOnboardingStore.getState().permissions.location).toBe(true);
    expect(useOnboardingStore.getState().permissions.camera).toBe(false);
  });

  it('U4: completeOnboarding marks complete', () => {
    useOnboardingStore.getState().completeOnboarding();
    expect(useOnboardingStore.getState().onboardingComplete).toBe(true);
  });

  it('U5: persist and hydrate restores state', () => {
    useOnboardingStore.getState().setPersona('student');
    useOnboardingStore.getState().completeOnboarding();
    useOnboardingStore.setState({ ...DEFAULT_ONBOARDING_STATE, hydrated: true });
    useOnboardingStore.getState().hydrate();
    expect(useOnboardingStore.getState().persona).toBe('student');
    expect(useOnboardingStore.getState().onboardingComplete).toBe(true);
  });

  it('U6: resetOnboarding clears completion', () => {
    useOnboardingStore.getState().completeOnboarding();
    useOnboardingStore.getState().resetOnboarding();
    expect(useOnboardingStore.getState().onboardingComplete).toBe(false);
  });

  it('U7: setAuthPath stores auth branch', () => {
    useOnboardingStore.getState().setAuthPath('guest');
    expect(useOnboardingStore.getState().authPath).toBe('guest');
  });
});
