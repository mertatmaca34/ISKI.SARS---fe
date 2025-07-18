import { ReportTemplate, ReportTemplateTag, InstantValue, SystemMetric, LogEntry, DashboardStats } from '../types';

class DataStore {
  private templates: ReportTemplate[] = [];
  private tags: ReportTemplateTag[] = [];
  private instantValues: InstantValue[] = [];
  private systemMetrics: SystemMetric[] = [];
  private logs: LogEntry[] = [];

  constructor() {
    // start with empty collections
  }

  // Templates
  getTemplates(): ReportTemplate[] {
    return this.templates;
  }

  getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  createTemplate(template: Omit<ReportTemplate, 'id' | 'createdAt'>): ReportTemplate {
    const newTemplate: ReportTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<ReportTemplate>): boolean {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      return true;
    }
    return false;
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  // Tags
  getTagsByTemplateId(templateId: string): ReportTemplateTag[] {
    return this.tags.filter(tag => tag.templateId === templateId);
  }

  getTags(): ReportTemplateTag[] {
    return this.tags;
  }

  createTag(tag: Omit<ReportTemplateTag, 'id'>): ReportTemplateTag {
    const newTag: ReportTemplateTag = {
      ...tag,
      id: Date.now().toString()
    };
    this.tags.push(newTag);
    return newTag;
  }

  // System Metrics
  getSystemMetrics(): SystemMetric[] {
    return this.systemMetrics;
  }

  // Dashboard Stats
  getDashboardStats(): DashboardStats {
    return {
      totalTemplates: this.templates.length,
      activeTags: this.tags.filter(t => t.isActive).length,
      dataPoints24h: 15420,
      systemHealth: 'healthy',
      activeUsers: 3,
      alerts24h: 2,
      uptime: '99.8%'
    };
  }

  // Logs
  getLogs(): LogEntry[] {
    return this.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addLog(log: Omit<LogEntry, 'id' | 'timestamp'>): LogEntry {
    const newLog: LogEntry = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.logs.push(newLog);
    return newLog;
  }
}

export const dataStore = new DataStore();