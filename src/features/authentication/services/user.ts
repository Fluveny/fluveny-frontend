import type { User } from '@/@types/user';
import { api } from '@/app/libs/api';

interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  background?: string;
}

export const updateProfile = async (data: UpdateProfileRequest) => {
  const response = await api.put<{ data: User }>('/users/profile', data);
  return response.data.data;
};

export const updateSettings = async (data: { soundEnabled: boolean }) => {
  const response = await api.put<{ data: User }>('/users/settings', data);
  return response.data.data;
};

export const resetPassword = async (data: { newPassword: string }) => {
  const response = await api.put<{ message: string }>('/users/password', data);
  return response.data;
};
