import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AccessToken {
  token: string;
  refreshToken: string;
  expiration: string;
}

export const authService = {
  login: (data: LoginDto) => api.post<AccessToken>('/api/auth/login', data),
  register: (data: RegisterDto) => api.post<AccessToken>('/api/auth/register', data),
  refresh: (data: RefreshTokenDto) => api.post<AccessToken>('/api/auth/refresh-token', data),
};
