import type { User } from '@/@types/user';
import { create } from 'zustand';

type AuthStoreState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (userData) => {
    set({
      user: userData,
      isAuthenticated: !!userData,
    });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
