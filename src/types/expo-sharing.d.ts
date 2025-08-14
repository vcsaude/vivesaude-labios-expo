declare module 'expo-sharing' {
  export async function isAvailableAsync(): Promise<boolean>;
  export async function shareAsync(uri: string, options?: { mimeType?: string; dialogTitle?: string }): Promise<void>;
}

