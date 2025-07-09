import { User } from '../types';
import { authService, AccessToken } from '../services/authService';

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
      this.user = parsed.user;
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
    this.setSession(token);
    // Ideally backend returns user info; here we call refresh token to get user if needed
    this.user = { id: '0', username: email, email, role: 'operator', createdAt: '', isActive: true };
    this.isAuthenticated = true;
    return this.user;
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