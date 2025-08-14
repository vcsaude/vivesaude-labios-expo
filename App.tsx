import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Components
import { useToast } from './src/components/ui/Toast';

export default function App() {
  const { ToastComponent } = useToast();

  useEffect(() => {
    // Skip LogRocket initialization for now to avoid import.meta issues
    console.log('App initialized successfully');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <AppNavigator />
        <ToastComponent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
});
