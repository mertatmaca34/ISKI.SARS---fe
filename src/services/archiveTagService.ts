import { api } from './api';
import { PageRequest, PaginatedResponse, DynamicQuery } from './templateService';

export interface ArchiveTagDto {
  id: number;
  tagName: string;
  tagNodeId: string;
  description?: string;
  pullInterval: number;
  isActive: boolean;
}

export const archiveTagService = {
  getById: (id: number) => api.get<ArchiveTagDto>(`/api/ArchiveTags/${id}`),
  create: (data: Omit<ArchiveTagDto, 'id'>) =>
    api.post<ArchiveTagDto>('/api/ArchiveTags', data),
  update: (data: ArchiveTagDto) =>
    api.put<ArchiveTagDto>('/api/ArchiveTags', data),
  delete: (id: number) => api.delete<unknown>(`/api/ArchiveTags/${id}`),
  list: (page: PageRequest, query?: DynamicQuery) =>
    api.post<PaginatedResponse<ArchiveTagDto>>(
      `/api/ArchiveTags/list?PageNumber=${page.index + 1}&PageSize=${page.size}`,
      query ?? { filters: [], sorts: [] }
    ),
};
