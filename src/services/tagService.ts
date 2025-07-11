import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';

export interface ReportTemplateTagDto {
  id: number;
  reportTemplateId: number;
  tagName: string;
  tagNodeId: string;
}

export const tagService = {
  getById: (id: number) => api.get<ReportTemplateTagDto>(`/api/reporttemplatetags/${id}`),
  create: (data: Omit<ReportTemplateTagDto, 'id'>) =>
    api.post<ReportTemplateTagDto>('/api/reporttemplatetags', data),
  update: (data: ReportTemplateTagDto) =>
    api.put<ReportTemplateTagDto>('/api/reporttemplatetags', data),
  delete: (id: number) => api.delete<unknown>(`/api/reporttemplatetags/${id}`),
  list: (page: PageRequest) =>
    api.post<PaginatedResponse<ReportTemplateTagDto>>(
      `/api/reporttemplatetags/list?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}`,
      {}
    ),
};
