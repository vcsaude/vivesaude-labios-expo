import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import UploadScreen from './src/screens/UploadScreen';

export default function App() {
  useEffect(() => {
    // Lazy init to avoid crashes if dependency is not installed yet
    (async () => {
      try {
        const mod = await import('@logrocket/react-native');
        const LogRocket = (mod as any).default ?? mod;
        if (LogRocket && typeof LogRocket.init === 'function') {
          LogRocket.init('rilppt/vcsaude', {
            updateId: (Updates as any).isEmbeddedLaunch ? null : (Updates as any).updateId,
            expoChannel: (Updates as any).channel,
          });
        }
      } catch (e) {
        // Silently ignore if package not available in this build
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <UploadScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
});
