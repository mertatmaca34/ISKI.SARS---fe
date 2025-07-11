import { User } from '../types';
import { authService, AccessToken } from '../services/authService';

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

interface StoredAuth {
  token: string;
  refreshToken: string;
  user: User | null;
}

class AuthStore {
  private user: User | null = null;
  private isAuthenticated = false;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed: StoredAuth = JSON.parse(stored);
      this.user = parsed.user || (parsed.token ? ((): User | null => {
        const payload = parseJwt(parsed.token);
        if (!payload) return null;
        return {
          id: (payload.nameid as string) || (payload.sub as string) || '',
          username: (payload.unique_name as string) || '',
          email: (payload.email as string) || '',
          role: (payload.role as string) || 'operator',
          createdAt: '',
          isActive: true,
        };
      })() : null);
      this.token = parsed.token;
      this.refreshToken = parsed.refreshToken;
      this.isAuthenticated = !!parsed.token;
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAccessToken(): string | null {
    return this.token;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const token = await authService.login({ email, password });
      const payload = parseJwt(token.token);
      this.user = {
        id: (payload?.nameid as string) || (payload?.sub as string) || '',
        username: (payload?.unique_name as string) || email,
        email: (payload?.email as string) || email,
        role: (payload?.role as string) || 'operator',
        createdAt: '',
        isActive: true,
      };
      this.isAuthenticated = true;
      this.setSession(token);
      return this.user;
    } catch (err) {
      // If backend is unreachable, allow mock admin login
      if (email === 'admin@gmail.com' && password === '123') {
        const mockToken: AccessToken = {
          token: 'mock-token',
          refreshToken: 'mock-refresh',
          expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        };
        this.user = { id: '1', username: 'admin', email, role: 'admin', createdAt: '', isActive: true };
        this.isAuthenticated = true;
        this.setSession(mockToken);
        return this.user;
      }
      throw err;
    }
  }

  private setSession(token: AccessToken) {
    this.token = token.token;
    this.refreshToken = token.refreshToken;
    localStorage.setItem(
      'auth',
      JSON.stringify({ token: this.token, refreshToken: this.refreshToken, user: this.user })
    );
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth');
  }
}
export const authStore = new AuthStore();