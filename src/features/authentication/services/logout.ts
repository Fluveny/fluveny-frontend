import { api } from '@/app/libs/api';

export const logout = async () => {
  await api.post('/auth/logout');
};
