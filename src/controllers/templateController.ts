import {
  templateService,
  PageRequest,
  PaginatedResponse,
  ReportTemplateDto,
  ReportTemplateCreateDto,
  ReportTemplateUpdateDto,
  DynamicQuery,
} from '../services/templateService';

export const templateController = {
  async list(
    page: PageRequest = { index: 0, size: 50 },
    userId: string,
    query?: DynamicQuery
  ): Promise<PaginatedResponse<ReportTemplateDto>> {
    return await templateService.list(page, userId, query);
  },

  async get(id: number, userId: string): Promise<ReportTemplateDto> {
    return await templateService.getById(id, userId);
  },

  async create(data: ReportTemplateCreateDto): Promise<ReportTemplateDto> {
    return await templateService.create(data);
  },

  async update(data: ReportTemplateUpdateDto): Promise<ReportTemplateDto> {
    return await templateService.update(data);
  },

  async delete(id: number): Promise<void> {
    await templateService.delete(id);
  },
};

