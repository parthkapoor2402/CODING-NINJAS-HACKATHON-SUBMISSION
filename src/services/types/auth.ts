import type { Session, User, UserRole } from '@/types';

export interface SignInCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface AuthBackend {
  signIn(credentials: SignInCredentials): Promise<Session>;
  signInAsGuest(): Promise<Session>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<Session | null>;
}
