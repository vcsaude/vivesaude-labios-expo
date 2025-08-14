export const formatBytes = (bytes?: number | null): string => {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

export const formatDate = (iso?: string | number | Date): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
};

