import { create } from 'zustand';
import { UserSummary } from '../types';

interface AuthState {
  user: UserSummary | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserSummary, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserSummary) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('bookify_user') || 'null'),
  accessToken: localStorage.getItem('bookify_access_token'),
  refreshToken: localStorage.getItem('bookify_refresh_token'),
  isAuthenticated: !!localStorage.getItem('bookify_access_token'),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('bookify_user', JSON.stringify(user));
    localStorage.setItem('bookify_access_token', accessToken);
    localStorage.setItem('bookify_refresh_token', refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('bookify_access_token', accessToken);
    localStorage.setItem('bookify_refresh_token', refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => {
    localStorage.setItem('bookify_user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('bookify_user');
    localStorage.removeItem('bookify_access_token');
    localStorage.removeItem('bookify_refresh_token');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
