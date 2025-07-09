import { api } from './api';

export interface ReportTemplateDto {
  id: number;
  name: string;
  opcEndpoint: string;
  pullInterval: number;
  isActive?: boolean;
}

export interface PageRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  count: number;
}

export const templateService = {
  getById: (id: number) => api.get<ReportTemplateDto>(`/api/reporttemplates/${id}`),
  create: (data: Omit<ReportTemplateDto, 'id'>) =>
    api.post<ReportTemplateDto>('/api/reporttemplates', data),
  update: (data: ReportTemplateDto) =>
    api.put<ReportTemplateDto>('/api/reporttemplates', data),
  delete: (id: number) => api.delete<unknown>(`/api/reporttemplates/${id}`),
  list: (page: PageRequest) =>
    api.post<PaginatedResponse<ReportTemplateDto>>('/api/reporttemplates/list?pageIndex=' + page.pageNumber + '&pageSize=' + page.pageSize, {}),
};
