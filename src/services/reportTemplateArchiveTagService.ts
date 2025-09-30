import { api } from './api';

export interface ReportTemplateArchiveTagCreateDto {
  reportTemplateId: number;
  archiveTagId: number;
}

export const reportTemplateArchiveTagService = {
  create: (data: ReportTemplateArchiveTagCreateDto) =>
    api.post('/api/ReportTemplateArchiveTags', data),
};
