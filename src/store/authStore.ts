import { User } from '../types';

class AuthStore {
  private user: User | null = null;
  private isAuthenticated = false;

  constructor() {
    // Initialize with mock admin user for demo
    this.user = {
      id: '1',
      username: 'admin',
      email: 'admin@iski.gov.tr',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      isActive: true
    };
    this.isAuthenticated = true;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  login(username: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Mock authentication
      if (username === 'admin' && password === 'admin123') {
        this.user = {
          id: '1',
          username: 'admin',
          email: 'admin@iski.gov.tr',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          isActive: true
        };
        this.isAuthenticated = true;
        resolve(this.user);
      } else if (username === 'operator' && password === 'op123') {
        this.user = {
          id: '2',
          username: 'operator',
          email: 'operator@iski.gov.tr',
          role: 'operator',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          isActive: true
        };
        this.isAuthenticated = true;
        resolve(this.user);
      } else {
        reject(new Error('Kullanıcı adı veya şifre hatalı'));
      }
    });
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
  }
}

export const authStore = new AuthStore();