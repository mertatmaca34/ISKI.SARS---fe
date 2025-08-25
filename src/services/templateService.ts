import { api } from './api';

export interface ReportTemplateDto {
  id: number;
  name: string;
  createdByUserId: string;
  isShared: boolean;
  sharedUserIds: string[];
}

export interface ReportTemplateCreateDto {
  name: string;
  createdByUserId: string;
  sharedUserIds: string[];
}

export interface ReportTemplateUpdateDto {
  id: number;
  name: string;
  sharedUserIds: string[];
}

export interface PageRequest {
  index: number;
  size: number;
}

export interface DynamicQuery {
  filters?: Array<{ field: string; operator: string; value: string }>;
  sorts?: Array<{ field: string; direction: string }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const templateService = {
  getById: (id: number, userId: string) =>
    api.get<ReportTemplateDto>(`/api/ReportTemplates/${id}?userId=${userId}`),
  create: (data: ReportTemplateCreateDto) =>
    api.post<ReportTemplateDto>('/api/ReportTemplates', data),
  update: (data: ReportTemplateUpdateDto) =>
    api.put<ReportTemplateDto>('/api/ReportTemplates', data),
  delete: (id: number) => api.delete<unknown>(`/api/ReportTemplates/${id}`),
  list: (page: PageRequest, userId: string, query?: DynamicQuery) =>
    api.post<PaginatedResponse<ReportTemplateDto>>(
      `/api/ReportTemplates/list?PageNumber=${page.index + 1}&PageSize=${page.size}&userId=${userId}`,
      query ?? { filters: [], sorts: [] }
    ),
};
