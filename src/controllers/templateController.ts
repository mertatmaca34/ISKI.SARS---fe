import { templateService, PageRequest, PaginatedResponse, ReportTemplateDto } from '../services/templateService';

export const templateController = {
  async list(page: PageRequest = { index: 0, size: 50 }): Promise<PaginatedResponse<ReportTemplateDto>> {
    return await templateService.list(page);
  },

  async delete(id: number): Promise<void> {
    await templateService.deleteReportTemplateAsync(id);
  },
};
