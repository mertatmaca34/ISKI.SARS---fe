import { User } from '../types';
import { authService, AccessToken } from '../services/authService';

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function payloadToUser(payload: Record<string, unknown> | null, fallbackEmail?: string): User | null {
  if (!payload) return null;
  const get = (key: string) => payload[key] as string | undefined;
  const id =
    get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier') ||
    get('nameid') ||
    get('sub') ||
    '';
  const username =
    get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name') ||
    get('unique_name') ||
    fallbackEmail ||
    '';
  const email =
    get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress') ||
    get('email') ||
    fallbackEmail ||
    '';
  const role =
    get('http://schemas.microsoft.com/ws/2008/06/identity/claims/role') ||
    get('role') ||
    'operator';
  return { id, username, email, role: role.toLowerCase() as User['role'], createdAt: '', isActive: true };
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
      this.user = parsed.user || (parsed.token ? payloadToUser(parseJwt(parsed.token)) : null);
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
    const token = await authService.login({ email, password });
    this.user =
      payloadToUser(parseJwt(token.token), email) || {
        id: '',
        username: email,
        email,
        role: 'operator',
        createdAt: '',
        isActive: true,
      };
    this.isAuthenticated = true;
    this.setSession(token);
    return this.user;
  }

  private setSession(token: AccessToken) {
    this.token = token.token;
    this.refreshToken = token.refreshToken;
    localStorage.setItem(
      'auth',
      JSON.stringify({ token: this.token, refreshToken: this.refreshToken, user: this.user })
    );
    if (this.token) {
      sessionStorage.setItem('Token', this.token);
    }
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth');
    sessionStorage.removeItem('Token');
  }
}
export const authStore = new AuthStore();