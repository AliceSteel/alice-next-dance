import type { User } from './User';

export type AuthState = {
  user: User | null;
  token: string | null;
  status: 'idle' | 'authenticating' | 'authenticated' | 'error';
};