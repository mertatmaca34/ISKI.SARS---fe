import { api } from './api';
import { SystemSettings } from '../types';

export const systemSettingsService = {
  get: () => api.get<SystemSettings>('/api/SystemSettings'),
  save: (settings: SystemSettings) => api.put<unknown>('/api/SystemSettings', settings),
};
