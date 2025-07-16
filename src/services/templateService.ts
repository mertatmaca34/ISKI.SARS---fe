import { api } from './api';

export interface ReportTemplateDto {
  id: number;
  name: string;
  opcEndpoint: string;
  pullInterval: number;
  isActive?: boolean;
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
  getById: (id: number) => api.get<ReportTemplateDto>(`/api/reporttemplates/${id}`),
  create: (data: Omit<ReportTemplateDto, 'id'>) =>
    api.post<ReportTemplateDto>('/api/reporttemplates', data),
  update: (data: ReportTemplateDto) =>
    api.put<ReportTemplateDto>('/api/reporttemplates', data),
  delete: (id: number) => api.delete<unknown>(`/api/reporttemplates/${id}`),
  deleteReportTemplateAsync: (id: number) =>
    api.delete<unknown>(`/api/ReportTemplates/${id}`),
  list: (_page: PageRequest, query?: DynamicQuery) =>
    api.post<PaginatedResponse<ReportTemplateDto>>(
      '/api/ReportTemplates/list',
      query ?? { filters: [], sorts: [] }
    ),
};
