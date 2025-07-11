import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface OperationClaimDto {
  id: number;
  name: string;
}

export const operationClaimService = {
  getById: (id: number) =>
    api.get<OperationClaimDto>(`/api/operationclaims/${id}`),
  list: (page: PageRequest) =>
    api.get<PaginatedResponse<OperationClaimDto>>(
      `/api/operationclaims?PageNumber=${page.index + 1}&PageSize=${page.size}`
    ),
  create: (data: Omit<OperationClaimDto, 'id'>) =>
    api.post<OperationClaimDto>('/api/operationclaims', data),
  update: (data: OperationClaimDto) =>
    api.put<OperationClaimDto>('/api/operationclaims', data),
  delete: (id: number) => api.delete<unknown>(`/api/operationclaims/${id}`),
};
