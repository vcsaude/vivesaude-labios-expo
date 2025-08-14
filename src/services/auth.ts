import { http } from './http';
import { config } from './config';

type Tokens = { accessToken: string; refreshToken: string };

export const authService = {
  async login(email: string, password: string): Promise<Tokens> {
    if (config.mode === 'mock') {
      return { accessToken: 'mock-access', refreshToken: 'mock-refresh' };
    }
    return http<Tokens>('/auth/login', { method: 'POST', body: { email, password } });
  },
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (config.mode === 'mock') return { accessToken: 'mock-access' };
    return http<{ accessToken: string }>('/auth/refresh', { method: 'POST', body: { refreshToken } });
  },
  async logout(): Promise<void> {
    // Usually client-side only; token revocation optional.
    return;
  },
};

