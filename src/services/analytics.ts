import { config } from './config';

type EventName =
  | 'upload_open_picker'
  | 'upload_selected'
  | 'upload_sent'
  | 'upload_failed'
  | 'upload_retry'
  | 'history_cleared';

type Params = Record<string, string | number | boolean | undefined>;

const safe = (p?: Params): Params => {
  const sanitized: Params = {};
  if (!p) return sanitized;
  // Only allow non-sensitive keys; never pass names or URIs
  const allow = ['size', 'locale', 'status', 'reason'];
  for (const k of allow) if (k in p) sanitized[k] = p[k];
  return sanitized;
};

export const analytics = {
  enabled: false,
  init() {
    // Could read from env in the future; default off
    this.enabled = false;
  },
  track(event: EventName, params?: Params) {
    if (!this.enabled) return;
    try {
      // Placeholder: send to a privacy-safe pipeline
      // fetch('https://telemetry.vivesaude.com/events', { method: 'POST', body: JSON.stringify({ event, params: safe(params) }) })
      // For now, noop
    } catch {}
  },
};

analytics.init();

