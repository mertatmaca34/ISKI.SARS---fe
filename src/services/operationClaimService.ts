import { api } from './api';
import { PageRequest, PaginatedResponse, DynamicQuery } from './templateService';

export interface OperationClaimDto {
  id: number;
  name: string;
}

export const operationClaimService = {
  getById: (id: number) =>
    api.get<OperationClaimDto>(`/api/operationclaims/${id}`),
  list: (page: PageRequest, query?: DynamicQuery) =>
    api.post<PaginatedResponse<OperationClaimDto>>(
      `/api/operationclaims/list?pageNumber=${page.index}&pageSize=${page.size}`,
      query ?? {}
    ),
  create: (data: Omit<OperationClaimDto, 'id'>) =>
    api.post<OperationClaimDto>('/api/operationclaims', data),
  update: (data: OperationClaimDto) =>
    api.put<OperationClaimDto>('/api/operationclaims', data),
  delete: (id: number) => api.delete<unknown>(`/api/operationclaims/${id}`),
};
