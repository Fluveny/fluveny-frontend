import { api } from '@/app/libs/api';

export const publishModule = async (moduleId: string): Promise<void> => {
  await api.patch(`/modules/${moduleId}/publish`);
};
