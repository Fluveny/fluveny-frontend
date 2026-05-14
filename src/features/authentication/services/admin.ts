import { api } from '@/app/libs/api';

export interface CreateCreatorRequest {
  username: string;
  email: string;
}

export interface CreateCreatorResponse {
  username: string;
  email: string;
  generatedPassword: string;
}

export interface Creator {
  id: string;
  username: string;
  email: string;
  name: string | null;
  requiresPasswordReset: boolean;
  lastLoginAt: string | null;
  isActive: boolean;
  modulesCount: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const createCreator = async (data: CreateCreatorRequest) => {
  const response = await api.post<{ data: CreateCreatorResponse }>(
    '/admin/creators',
    data,
  );
  return response.data.data;
};

export const getCreators = async (page: number = 0, size: number = 10) => {
  const response = await api.get<{ data: PaginatedResponse<Creator> }>(
    '/admin/creators',
    { params: { page, size } },
  );
  return response.data.data;
};

export const toggleCreatorStatus = async (id: string) => {
  const response = await api.patch<{ data: Creator }>(
    `/admin/creators/${id}/toggle-status`,
  );
  return response.data.data;
};
