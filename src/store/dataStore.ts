import { ReportTemplate, ReportTemplateTag, InstantValue, SystemMetric, LogEntry, DashboardStats } from '../types';

class DataStore {
  private templates: ReportTemplate[] = [];
  private tags: ReportTemplateTag[] = [];
  private instantValues: InstantValue[] = [];
  private systemMetrics: SystemMetric[] = [];
  private logs: LogEntry[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock templates
    this.templates = Array.from({ length: 10 }).map((_, i) => ({
      id: String(i + 1),
      name: `Şablon ${i + 1}`,
      description: `Şablon ${i + 1} açıklaması`,
      opcEndpoint: `opc.tcp://192.168.1.${100 + i}:4840`,
      collectionInterval: 5 + i,
      createdBy: 'admin',
      createdAt: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
      isActive: i % 2 === 0,
      tags: []
    }));

    // Mock tags (one for each template)
    this.tags = Array.from({ length: 10 }).map((_, i) => ({
      id: String(i + 1),
      templateId: String((i % 10) + 1),
      name: `Tag_${i + 1}`,
      nodeId: `ns=2;s=Template${(i % 10) + 1}.Tag${i + 1}`,
      dataType: 'number',
      description: `Tag ${i + 1} açıklaması`,
      unit: 'unit',
      isActive: true
    }));

    // Mock instant values
    this.instantValues = Array.from({ length: 10 }).map((_, i) => ({
      id: String(i + 1),
      tagId: String((i % 10) + 1),
      value: Math.random() * 100,
      quality: 'good',
      timestamp: new Date(Date.now() - i * 60000).toISOString()
    }));

    // Mock system metrics
    this.systemMetrics = [
      {
        id: '1',
        name: 'OPC Server Status',
        value: 1,
        unit: 'status',
        status: 'healthy',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Database Connection',
        value: 1,
        unit: 'status',
        status: 'healthy',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'API Response Time',
        value: 45,
        unit: 'ms',
        status: 'healthy',
        lastUpdated: new Date().toISOString()
      }
    ];

    // Mock logs
    this.logs = [
      {
        id: '1',
        userId: '1',
        username: 'admin',
        action: 'LOGIN',
        description: 'Kullanıcı sisteme giriş yaptı',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: '2',
        userId: '1',
        username: 'admin',
        action: 'CREATE_TEMPLATE',
        description: 'Ana Pompa İstasyonu şablonu oluşturuldu',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];
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