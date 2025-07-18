import { api } from './api';
import { PageRequest, PaginatedResponse } from './templateService';
import { LogDto, CreateLogDto } from '../types';

export const logService = {
  getById: (id: number) => api.get<LogDto>(`/api/Logs/${id}`),
  create: (data: CreateLogDto) => api.post<LogDto>('/api/Logs', data),
  list: (page: PageRequest) =>
    api.get<PaginatedResponse<LogDto>>(
      `/api/Logs?PageNumber=${page.index + 1}&PageSize=${page.size}`
    ),
};
