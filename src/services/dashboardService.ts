import { api } from './api';

export interface DashboardStats {
  totalTemplates: number;
  activeTags: number;
  dataPoints24h: number;
  systemHealth: string;
  activeUsers: number;
  alerts24h: number;
  uptime: string;
}

export interface SystemMetric {
  id: number;
  name: string;
  value: number;
  unit: string;
  status: string;
  lastUpdated: string;
}

export const dashboardService = {
  stats: () => api.get<DashboardStats>('/api/dashboard'),
  metrics: () => api.get<SystemMetric[]>('/api/dashboard/metrics'),
};


