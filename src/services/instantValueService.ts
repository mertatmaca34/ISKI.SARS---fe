import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface InstantValueDto {
  timestamp: string;
  reportTemplateTagId: number;
  value: number | string;
  status: string;
}

export const instantValueService = {
  create: (data: InstantValueDto) =>
    api.post<InstantValueDto>('/api/instantvalues', data),
  getByTimestamp: (timestamp: string) =>
    api.get<InstantValueDto>(`/api/instantvalues/${timestamp}`),
  list: (page: PageRequest, query?: unknown) =>
    api.post<PaginatedResponse<InstantValueDto>>(
      `/api/instantvalues/list?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}`,
      query ?? {}
    ),
};
