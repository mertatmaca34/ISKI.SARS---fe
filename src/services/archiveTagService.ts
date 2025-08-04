import { api } from './api';
import { PageRequest, PaginatedResponse, DynamicQuery } from './templateService';

export interface ArchiveTagDto {
  id: number;
  tagName: string;
  tagNodeId: string;
  pullInterval: number;
  description?: string;
}

export const archiveTagService = {
  getById: (id: number) => api.get<ArchiveTagDto>(`/api/archivetags/${id}`),
  create: (data: Omit<ArchiveTagDto, 'id'>) =>
    api.post<ArchiveTagDto>('/api/archivetags', data),
  update: (data: ArchiveTagDto) =>
    api.put<ArchiveTagDto>('/api/archivetags', data),
  delete: (id: number) => api.delete<unknown>(`/api/archivetags/${id}`),
  list: (page: PageRequest, query?: DynamicQuery) =>
    api.post<PaginatedResponse<ArchiveTagDto>>(
      `/api/archivetags/list?pageNumber=${page.index + 1}&pageSize=${page.size}`,
      query ?? {}
    ),
};
