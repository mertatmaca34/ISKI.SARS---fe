import { AccessToken } from './authService';
import { DashboardStats, SystemMetric } from '../types';

type MockHandler = ((body?: string) => unknown) | unknown;

const mockToken: AccessToken = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifQ.mock',
  refreshToken: 'mock-refresh-token',
  expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
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
};
