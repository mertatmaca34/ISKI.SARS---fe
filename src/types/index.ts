export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'pending';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  tags: ReportTemplateTag[];
}

export interface ReportTemplateTag {
  id: string;
  templateId: string;
  name: string;
  nodeId: string;
  dataType: 'boolean' | 'number' | 'string';
  description?: string;
  unit?: string;
  isActive: boolean;
}

export interface InstantValue {
  id: string;
  tagId: string;
  value: string | number | boolean;
  quality: 'good' | 'bad' | 'uncertain';
  timestamp: string;
}

export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
}

export interface LogDto {
  id: number;
  level: LogLevel;
  message: string;
  detail: string;
  createdAt: string;
}

export interface CreateLogDto {
  level: LogLevel;
  message: string;
  detail: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface DashboardStats {
  totalTemplates: number;
  activeTags: number;
  dataPoints24h: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  activeUsers: number;
  alerts24h: number;
  uptime: string;
}

export interface SystemSettings {
  opcServerUrl: string;
  databaseConnection: string;
  retentionDays: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  alertThreshold: number;
  sessionTimeout: number;
  logLevel: number;
  backupEnabled: boolean;
  backupIntervalHours: number;
}