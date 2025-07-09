import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface UserOperationClaimDto {
  id: number;
  userId: number;
  operationClaimId: number;
}

export const userOperationClaimService = {
  getById: (id: number) =>
    api.get<UserOperationClaimDto>(`/api/useroperationclaims/${id}`),
  list: (page: PageRequest) =>
    api.get<PaginatedResponse<UserOperationClaimDto>>(
      `/api/useroperationclaims?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}`
    ),
  create: (data: Omit<UserOperationClaimDto, 'id'>) =>
    api.post<UserOperationClaimDto>('/api/useroperationclaims', data),
  update: (data: UserOperationClaimDto) =>
    api.put<UserOperationClaimDto>('/api/useroperationclaims', data),
  delete: (id: number) => api.delete<unknown>(`/api/useroperationclaims/${id}`),
};
