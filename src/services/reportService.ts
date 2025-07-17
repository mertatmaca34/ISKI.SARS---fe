import { authStore } from '../store/authStore';

const API_URL = (import.meta.env.VITE_API_URL || 'https://10.0.254.199:444/')
  .replace(/\/+$/, '');

export const reportService = {
  async generate(
    templateId: number,
    start: string,
    end: string,
    format: 'pdf' | 'excel'
  ): Promise<Blob> {
    const token = authStore.getAccessToken() || sessionStorage.getItem('Token');
    const response = await fetch(`${API_URL}/api/ReportTemplates/${templateId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ start, end, format }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText);
    }
    return await response.blob();
  },
};
