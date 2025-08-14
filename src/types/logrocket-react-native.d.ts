declare module '@logrocket/react-native' {
  interface InitOptions {
    updateId?: string | null;
    expoChannel?: string | undefined;
  }
  const LogRocket: { init: (appId: string, options?: InitOptions) => void };
  export default LogRocket;
}

