import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ViveSaudeTheme = {
  colors: {
    primary: '#0066CC',
    secondary: '#1a1a2e', 
    background: '#FFFFFF',
    text: '#1a1a2e',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  fonts: {
    regular: 'SF Pro Display',
    medium: 'SF Pro Display Medium',
    bold: 'SF Pro Display Bold',
  }
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Vive & Saúde</Text>
        <Text style={styles.subtitle}>Lábios - Healthcare Assistant</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ Projeto Expo Configurado!</Text>
          <Text style={styles.cardDescription}>
            Sua aplicação de saúde está pronta para desenvolvimento.
          </Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Próximas Implementações:</Text>
          <Text style={styles.feature}>📄 Upload e análise de PDFs</Text>
          <Text style={styles.feature}>🔒 Autenticação biométrica</Text>
          <Text style={styles.feature}>📊 Dashboard de resultados</Text>
          <Text style={styles.feature}>🤖 Análise com IA</Text>
          <Text style={styles.feature}>💰 Sistema de moedas</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ViveSaudeTheme.colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ViveSaudeTheme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: ViveSaudeTheme.colors.text,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: ViveSaudeTheme.colors.primary,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: ViveSaudeTheme.colors.text,
    opacity: 0.8,
    lineHeight: 20,
  },
  features: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 12,
  },
  feature: {
    fontSize: 14,
    color: ViveSaudeTheme.colors.text,
    marginBottom: 8,
    paddingLeft: 8,
  },
});
