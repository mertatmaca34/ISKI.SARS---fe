import { templateService } from '../services';

export interface ReportTemplateViewModel {
  id: number;
  name: string;
  opcEndpoint: string;
  pullInterval: number;
  isActive: boolean;
}

export const templateController = {
  async Edit(id: number): Promise<ReportTemplateViewModel> {
    return await templateService.getById(id);
  },

  async EditPost(model: ReportTemplateViewModel): Promise<void> {
    const payload: ReportTemplateViewModel = {
      id: model.id,
      name: model.name,
      opcEndpoint: model.opcEndpoint,
      pullInterval: model.pullInterval,
      isActive: model.isActive,
    };
    await templateService.UpdateReportTemplateAsync(payload);
  },
};
