import type { User } from '@/@types/user';
import { api } from '@/app/libs/api';

interface GetUserInformationResponse {
  data: User;
  message: string;
}

export const getUserInformation =
  async (): Promise<GetUserInformationResponse> => {
    const response = await api.get('auth/me');
    return response.data;
  };
