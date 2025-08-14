import { config } from './config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function http<T>(path: string, opts: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`;
  const method = opts.method ?? 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers ?? {}),
  };

  // TODO: attach auth header when implemented
  // const token = await getAccessToken(); headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.apiTimeoutMs);
  try {
    let attempts = 0;
    // basic retry for idempotent GETs
    while (true) {
      try {
        const res = await fetch(url, {
          method,
          headers,
          body: opts.body ? JSON.stringify(opts.body) : undefined,
          signal: controller.signal,
        } as any);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return (await res.json()) as T;
        }
        // @ts-ignore: allow non-json
        return (await (res.text() as unknown)) as T;
      } catch (err) {
        attempts += 1;
        if (method !== 'GET' || attempts > config.apiRetryAttempts) throw err;
        await delay(300 * attempts);
      }
    }
  } finally {
    clearTimeout(timeout);
  }
}

