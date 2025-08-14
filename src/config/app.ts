const read = (k: string, fallback?: string) =>
  (typeof process !== 'undefined' && process.env && (process.env as any)[k]) ?? fallback;

export const appConfig = {
  maxUploadMb: parseInt(read('EXPO_PUBLIC_MAX_UPLOAD_MB', '15') as string, 10),
  webUrl: read('EXPO_PUBLIC_WEB_URL', ''),
  get privacyUrl() {
    const base = this.webUrl?.replace(/\/$/, '') || 'https://vivesaude.com.br';
    return `${base}/privacidade`;
  },
  get termsUrl() {
    const base = this.webUrl?.replace(/\/$/, '') || 'https://vivesaude.com.br';
    return `${base}/termos`;
  },
};
