import AsyncStorage from '@react-native-async-storage/async-storage';

export type UploadStatus = 'sent' | 'failed';

export type UploadEntry = {
  id: string;
  name: string;
  size?: number;
  uri: string;
  uploadedAt: string; // ISO
  status: UploadStatus;
  errorMessage?: string;
};

const KEY = 'upload_history_v1';

export async function getHistory(): Promise<UploadEntry[]> {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (!json) return [];
    const arr = JSON.parse(json) as UploadEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function addHistory(entry: UploadEntry): Promise<void> {
  const list = await getHistory();
  list.unshift(entry);
  const trimmed = list.slice(0, 10);
  await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export async function updateHistory(id: string, patch: Partial<UploadEntry>): Promise<void> {
  const list = await getHistory();
  const idx = list.findIndex((e) => e.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch, id: list[idx].id };
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  }
}
