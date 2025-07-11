import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status?: boolean;
}

export interface ChangePasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  getById: (id: string) => api.get<UserDto>(`/api/users/${id}`),
    ),
  create: (data: Omit<UserDto, 'id'> & { password: string }) =>
    api.post<UserDto>('/api/users', data),
  update: (data: UserDto) => api.put<UserDto>('/api/users', data),
  delete: (id: string) => api.delete<unknown>(`/api/users/${id}`),
  changePassword: (data: ChangePasswordDto) =>
    api.put<unknown>('/api/users/change-password', data),
};

