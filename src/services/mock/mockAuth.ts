import type { AuthBackend, SignInCredentials } from '@/services/types/auth';
import type { Session, User } from '@/types';
import { getUserByEmail } from '@/services/mock/seed';
import { delay } from '@/utils/format';

const MOCK_SESSION_KEY = 'civic-resolve-mock-session';

function readStoredSession(): Session | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeStoredSession(session: Session | null): void {
  if (typeof sessionStorage === 'undefined') return;
  if (session) {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  }
}

const GUEST_USER: User = {
  id: 'user-guest',
  email: 'guest@local.dev',
  displayName: 'Guest',
  role: 'citizen',
  trust: {
    trustScore: 50,
    contributionScore: 0,
    verificationScore: 0,
    duplicateRisk: 0,
    abuseFlags: [],
  },
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
};

let currentSession: Session | null = readStoredSession();

export const mockAuthBackend: AuthBackend = {
  async signIn(credentials: SignInCredentials): Promise<Session> {
    await delay(300);
    const user = getUserByEmail(credentials.email);
    if (!user) {
      throw new Error(`No demo user for ${credentials.email}. See README demo accounts.`);
    }
    const session: Session = {
      user: credentials.role ? { ...user, role: credentials.role } : user,
      token: `mock-token-${user.id}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    currentSession = session;
    writeStoredSession(session);
    return session;
  },

  async signInAsGuest(): Promise<Session> {
    return createGuestSession();
  },

  async signOut(): Promise<void> {
    await delay(100);
    currentSession = null;
    writeStoredSession(null);
  },

  async getCurrentUser() {
    if (!currentSession) currentSession = readStoredSession();
    return currentSession?.user ?? null;
  },

  async getSession() {
    if (!currentSession) currentSession = readStoredSession();
    return currentSession;
  },
};

export async function createGuestSession(): Promise<Session> {
  await delay(100);
  const session: Session = {
    user: GUEST_USER,
    token: 'mock-token-guest',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    isGuest: true,
  };
  currentSession = session;
  writeStoredSession(session);
  return session;
}

/** Test helper — sync session read for store bootstrap */
export function getInitialMockSession(): Session | null {
  return readStoredSession();
}

/** Test helper */
export function resetMockAuthSession() {
  currentSession = null;
  writeStoredSession(null);
}
