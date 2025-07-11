import { api } from './api';
import { PageRequest, PaginatedResponse, DynamicQuery } from './templateService';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status?: boolean;
}

export interface ChangePasswordDto {
  userId: number;
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  getById: (id: number) => api.get<UserDto>(`/api/users/${id}`),
  list: (page: PageRequest, query?: DynamicQuery) =>
    api.post<PaginatedResponse<UserDto>>(
      `/api/users/list?pageNumber=${page.index}&pageSize=${page.size}`,
      query ?? {}
    ),
  create: (data: Omit<UserDto, 'id'> & { password: string }) =>
    api.post<UserDto>('/api/users', data),
  update: (data: UserDto) => api.put<UserDto>('/api/users', data),
  delete: (id: number) => api.delete<unknown>(`/api/users/${id}`),
  changePassword: (data: ChangePasswordDto) =>
    api.put<unknown>('/api/users/change-password', data),
};

