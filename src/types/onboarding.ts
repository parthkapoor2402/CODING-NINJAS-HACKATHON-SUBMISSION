export type Persona = 'commuter' | 'resident' | 'student' | 'family';

export type AuthPath = 'guest' | 'sign-in';

export type PermissionType = 'location' | 'camera' | 'notifications';

export interface PermissionAcknowledgements {
  location: boolean;
  camera: boolean;
  notifications: boolean;
}

export interface OnboardingPersistedState {
  persona: Persona | null;
  permissions: PermissionAcknowledgements;
  onboardingComplete: boolean;
  authPath: AuthPath | null;
  firstSessionEducationSeen: boolean;
}

export const ONBOARDING_STORAGE_KEY = 'civic-onboarding-v1';

export const DEFAULT_ONBOARDING_STATE: OnboardingPersistedState = {
  persona: null,
  permissions: { location: false, camera: false, notifications: false },
  onboardingComplete: false,
  authPath: null,
  firstSessionEducationSeen: false,
};
