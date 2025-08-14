declare module '@react-native-async-storage/async-storage' {
  export function getItem(key: string): Promise<string | null>;
  export function setItem(key: string, value: string): Promise<void>;
  export function removeItem(key: string): Promise<void>;
  const AsyncStorage: {
    getItem: typeof getItem;
    setItem: typeof setItem;
    removeItem: typeof removeItem;
  };
  export default AsyncStorage;
}

