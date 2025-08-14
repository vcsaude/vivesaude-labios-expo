type Lang = 'pt-BR' | 'en-US';

const read = (k: string, fallback?: string) =>
  (typeof process !== 'undefined' && process.env && (process.env as any)[k]) ?? fallback;

const detect = (): Lang => {
  const env = (read('EXPO_PUBLIC_LOCALE') || '').toString();
  if (env === 'en-US') return 'en-US';
  const sys = (Intl && Intl.DateTimeFormat().resolvedOptions().locale) || '';
  if (sys.startsWith('en')) return 'en-US';
  return 'pt-BR';
};

export const i18n = {
  lang: detect(),
  t(key: string, vars?: Record<string, string | number>): string {
    const dict = resources[this.lang] ?? resources['pt-BR'];
    const template = (dict as any)[key] ?? key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_match: string, k: string) => String(vars[k] ?? ''));
  },
};

const resources: Record<Lang, Record<string, string>> = {
  'pt-BR': {
    upload_title: 'Enviar exame em PDF',
    upload_subtitle: 'Selecione o arquivo do seu exame para análise segura.',
    upload_note: 'Apenas PDF • até {max} MB',
    select_pdf: 'Selecionar PDF',
    confirm_send: 'Confirmar envio',
    file_label: 'Arquivo',
    size_label: 'Tamanho',
    change_file: 'Trocar arquivo',
    send_now: 'Enviar agora',
    recent_uploads: 'Envios recentes',
    clear: 'Limpar',
    none_yet: 'Nenhum envio ainda.',
    retry: 'Reenviar',
    success_msg: 'Exame enviado com sucesso. Obrigado!',
    error_msg: 'Falha ao enviar o PDF. Tente novamente.',
    invalid_format: 'Formato inválido. Envie um arquivo PDF.',
    too_large: 'Arquivo muito grande. Máximo {max} MB.',
    terms_sentence: 'Ao enviar, você concorda com nossos {terms} e {privacy}.',
    terms: 'Termos de Uso',
    privacy: 'Política de Privacidade',
    a11y_select_pdf: 'Selecionar arquivo PDF',
    a11y_change_file: 'Trocar arquivo',
    a11y_send_now: 'Enviar arquivo agora',
    a11y_clear_history: 'Limpar histórico de envios',
  },
  'en-US': {
    upload_title: 'Upload lab exam PDF',
    upload_subtitle: 'Select your exam file for secure analysis.',
    upload_note: 'PDF only • up to {max} MB',
    select_pdf: 'Select PDF',
    confirm_send: 'Confirm upload',
    file_label: 'File',
    size_label: 'Size',
    change_file: 'Change file',
    send_now: 'Upload now',
    recent_uploads: 'Recent uploads',
    clear: 'Clear',
    none_yet: 'No uploads yet.',
    retry: 'Retry',
    success_msg: 'Upload successful. Thank you!',
    error_msg: 'Failed to upload PDF. Please try again.',
    invalid_format: 'Invalid format. Please upload a PDF.',
    too_large: 'File too large. Max {max} MB.',
    terms_sentence: 'By uploading, you agree to our {terms} and {privacy}.',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    a11y_select_pdf: 'Select PDF file',
    a11y_change_file: 'Change file',
    a11y_send_now: 'Upload file now',
    a11y_clear_history: 'Clear upload history',
  },
};

export default i18n;
