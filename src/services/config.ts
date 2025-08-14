export type ApiMode = 'mock' | 'api';

const read = (key: string, fallback?: string) =>
  (typeof process !== 'undefined' && process.env && (process.env as any)[key]) ?? fallback;

export const config = {
  apiBaseUrl: read('API_BASE_URL', read('EXPO_PUBLIC_API_URL', '')),
  apiTimeoutMs: parseInt(read('API_TIMEOUT', '30000') as string, 10),
  apiRetryAttempts: parseInt(read('API_RETRY_ATTEMPTS', '2') as string, 10),
  mode: (read('EXPO_PUBLIC_USE_API_MODE', 'mock') as ApiMode),
};

