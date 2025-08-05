import { AccessToken } from './authService';
import { ArchiveTagDto } from './archiveTagService';
import { PaginatedResponse } from './templateService';
import { TrendResponse } from './trendService';
import { DashboardStats, SystemMetric } from '../types';

type MockHandler = ((body?: string) => unknown) | unknown;

const mockToken: AccessToken = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifQ.mock',
  refreshToken: 'mock-refresh-token',
  expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
};

const mockArchiveTags: ArchiveTagDto[] = [
  {
    id: 1,
    tagName: 'Temperature Sensor',
    tagNodeId: 'node1',
    pullInterval: 10,
    description: 'Mock temperature data',
  },
  {
    id: 2,
    tagName: 'Pressure Sensor',
    tagNodeId: 'node2',
    pullInterval: 15,
    description: 'Mock pressure data',
  },
];

const generateTrend = (): TrendResponse => {
  const now = Date.now();
  const points = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(now - (23 - i) * 60 * 60 * 1000).toISOString(),
    value: Math.round(50 + 20 * Math.sin(i / 3)),
  }));
  return { points };
};

export const mockResponses: Record<string, MockHandler> = {
  '/api/auth/login': (body?: string): AccessToken => {
    try {
      const { email, password } = body ? JSON.parse(body) : {};
      if (email === 'admin@gmail.com' && password === '1Q2w3e') {
        return mockToken;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error('Invalid credentials');
  },
  '/api/dashboard': {
    totalTemplates: 2,
    activeTags: 10,
    dataPoints24h: 1234,
    systemHealth: 'healthy',
    activeUsers: 1,
    alerts24h: 0,
    uptime: '48h',
  } as DashboardStats,
  '/api/dashboard/metrics': [
    {
      id: '1',
      name: 'CPU Usage',
      value: 55,
      unit: '%',
      status: 'healthy',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Memory Usage',
      value: 70,
      unit: '%',
      status: 'warning',
      lastUpdated: new Date().toISOString(),
    },
  ] as SystemMetric[],
  '/api/archivetags/list': {
    items: mockArchiveTags,
    index: 0,
    size: mockArchiveTags.length,
    count: mockArchiveTags.length,
    pages: 1,
    hasPrevious: false,
    hasNext: false,
  } as PaginatedResponse<ArchiveTagDto>,
  '/api/archivetags/1': mockArchiveTags[0],
  '/api/archivetags/2': mockArchiveTags[1],
  '/api/archivetags/1/trend': () => generateTrend(),
  '/api/archivetags/2/trend': () => generateTrend(),
};
