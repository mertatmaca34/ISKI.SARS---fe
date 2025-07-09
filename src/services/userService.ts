import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status?: boolean;
}

export const userService = {
  getById: (id: number) => api.get<UserDto>(`/api/users/${id}`),
  list: (page: PageRequest) =>
    api.get<PaginatedResponse<UserDto>>(`/api/users?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}`),
  create: (data: Omit<UserDto, 'id'> & { password: string }) =>
    api.post<UserDto>('/api/users', data),
  update: (data: UserDto) => api.put<UserDto>('/api/users', data),
  delete: (id: number) => api.delete<unknown>(`/api/users/${id}`),
};

