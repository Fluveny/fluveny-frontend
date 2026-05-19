import type { User } from '@/@types/user';
import { create } from 'zustand';
import { logout as logoutService } from '../services/logout';

type UpdateProfileRequest = {
  name?: string;
  avatar?: string;
  background?: string;
};

type AuthStoreState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updateSettings: (data: { soundEnabled: boolean }) => Promise<void>;
  resetPassword: (data: { newPassword: string }) => Promise<void>;
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
  logout: async () => {
    await logoutService();
    set({ user: null, isAuthenticated: false });
  },
  updateProfile: async (data) => {
    const { updateProfile: updateProfileService } =
      await import('../services/user');
    const updatedUser = await updateProfileService(data);
    set((state) => ({
      user: state.user
        ? { ...state.user, ...updatedUser, requiresProfileSetup: false }
        : null,
    }));
  },
  updateSettings: async (data) => {
    const { updateSettings: updateSettingsService } =
      await import('../services/user');
    const updatedUser = await updateSettingsService(data);
    set((state) => ({
      user: state.user 
      ? { ...state.user, ...updatedUser, requiresProfileSetup: false }
      : null,
    }));
  },
  resetPassword: async (data) => {
    const { resetPassword: resetPasswordService } =
      await import('../services/user');
    await resetPasswordService(data);
    set((state) => ({
      user: state.user ? { ...state.user, requiresPasswordReset: false } : null,
    }));
  },
}));
