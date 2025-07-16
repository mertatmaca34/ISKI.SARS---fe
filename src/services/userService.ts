import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status?: boolean;
  operationClaimId?: number;
  operationClaimName?: string;
}

export interface ChangePasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  getById: (id: string) => api.get<UserDto>(`/api/users/${id}`),
  list: (page?: PageRequest) =>
    api.get<PaginatedResponse<UserDto>>(
      page
        ? `/api/users?pageNumber=${page.index + 1}&pageSize=${page.size}`
        : '/api/users'
    ),
  create: (
    data: Omit<UserDto, 'id' | 'operationClaimName'> & { password: string }
  ) => api.post<UserDto>('/api/users', data),
  update: (data: UserDto) => api.put<UserDto>('/api/users', data),
  delete: (id: string) => api.delete<unknown>(`/api/users/${id}`),
  changePassword: (data: ChangePasswordDto) =>
    api.put<unknown>('/api/users/change-password', data),
};
