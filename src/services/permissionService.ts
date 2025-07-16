import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface PermissionUserDto {
  id: string;
  roleName: string;
  status: boolean;
}

export const permissionService = {
  listUsers: (page?: PageRequest) =>
    api.get<PaginatedResponse<PermissionUserDto>>(
      page
        ? `/api/Users?pageNumber=${page.index + 1}&pageSize=${page.size}`
        : '/api/Users'
    ),
};
