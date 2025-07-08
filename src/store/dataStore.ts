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
    this.templates = [
      {
        id: '1',
        name: 'Ana Pompa İstasyonu',
        description: 'Ana pompa istasyonu veri toplama şablonu',
        opcEndpoint: 'opc.tcp://192.168.1.100:4840',
        collectionInterval: 5,
        createdBy: 'admin',
        createdAt: '2024-01-01T10:00:00Z',
        isActive: true,
        tags: []
      },
      {
        id: '2',
        name: 'Arıtma Tesisi',
        description: 'Arıtma tesisi sensör verileri',
        opcEndpoint: 'opc.tcp://192.168.1.101:4840',
        collectionInterval: 10,
        createdBy: 'admin',
        createdAt: '2024-01-02T14:30:00Z',
        isActive: true,
        tags: []
      }
    ];

    // Mock tags
    this.tags = [
      {
        id: '1',
        templateId: '1',
        name: 'Pompa_1_Akım',
        nodeId: 'ns=2;s=Pump1.Current',
        dataType: 'number',
        description: 'Pompa 1 akım değeri',
        unit: 'A',
        isActive: true
      },
      {
        id: '2',
        templateId: '1',
        name: 'Pompa_1_Basınç',
        nodeId: 'ns=2;s=Pump1.Pressure',
        dataType: 'number',
        description: 'Pompa 1 basınç değeri',
        unit: 'bar',
        isActive: true
      },
      {
        id: '3',
        templateId: '2',
        name: 'pH_Değeri',
        nodeId: 'ns=2;s=Treatment.pH',
        dataType: 'number',
        description: 'Arıtma tesisi pH değeri',
        unit: 'pH',
        isActive: true
      }
    ];

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