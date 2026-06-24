import { create } from 'zustand';
import { applyVerificationTrust } from '@/domain/trust-updates';
import type { Session, User } from '@/types';
import { services } from '@/services/registry';
import { getInitialMockSession } from '@/services/mock/mockAuth';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: getInitialMockSession(),
  isLoading: false,
  error: null,

  async signIn(email: string) {
    set({ isLoading: true, error: null });
    try {
      const session = await services.auth.signIn({ email });
      set({ session, isLoading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Sign in failed', isLoading: false });
    }
  },

  async signInAsGuest() {
    set({ isLoading: true, error: null });
    try {
      const session = await services.auth.signInAsGuest();
      set({ session, isLoading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Guest sign-in failed', isLoading: false });
    }
  },

  async signOut() {
    await services.auth.signOut();
    set({ session: null });
  },

  async hydrate() {
    const session = await services.auth.getSession();
    set({ session });
  },
}));

export function useCurrentUser(): User | null {
  return useAuthStore((s) => s.session?.user ?? null);
}

export function useIsAdmin(): boolean {
  const user = useCurrentUser();
  return user?.role === 'admin' || user?.role === 'moderator';
}

export function useIsGuest(): boolean {
  return useAuthStore((s) => s.session?.isGuest === true);
}

export function applyTrustUpdate(): void {
  const session = useAuthStore.getState().session;
  if (!session) return;
  useAuthStore.setState({
    session: {
      ...session,
      user: {
        ...session.user,
        trust: applyVerificationTrust(session.user.trust),
      },
    },
  });
}
