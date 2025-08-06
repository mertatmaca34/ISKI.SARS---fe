import { authStore } from '../store/authStore';

const API_URL = (import.meta.env.VITE_API_URL || 'https://10.0.254.199:444/')
  .replace(/\/+$/, '');

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = authStore.getAccessToken() || sessionStorage.getItem('Token');

  // Abort request if it takes longer than 10 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(API_URL + url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const text = await response.text();

    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorData = JSON.parse(text);
        if (typeof errorData.message === 'string') {
          message = errorData.message;
        } else {
          message = text || message;
        }
      } catch {
        if (text) {
          message = text;
        }
      }
      throw new Error(message);
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      // If response body is empty or not JSON
      return undefined as T;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
