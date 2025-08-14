import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const ViveSaudeTheme = {
  colors: {
    primary: '#1a1a2e',
    primaryLight: '#2a2a3e',
    secondary: '#0f172a',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    text: '#1a1a2e',
    textSecondary: '#64748b',
    accent: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
  },
  shadows: {
    card: {
      shadowColor: '#1a1a2e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    button: {
      shadowColor: '#1a1a2e',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LoginScreen = () => (
    <View style={styles.loginContainer}>
      <View style={styles.loginCard}>
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>VS</Text>
          </View>
          <Text style={styles.brandTitle}>Vive & Saúde</Text>
          <Text style={styles.brandSubtitle}>Healthcare Assistant</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Bem-vindo de volta</Text>
          <Text style={styles.formSubtitle}>Entre na sua conta para continuar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={ViveSaudeTheme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor={ViveSaudeTheme.colors.textSecondary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('dashboard')}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const DashboardScreen = () => (
    <ScrollView style={styles.dashboardContainer}>
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.greetingText}>Olá, Dr. Vitor</Text>
          <Text style={styles.greetingSubtext}>Bem-vindo ao ViveSaúde</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.profileButtonText}>DV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>127</Text>
          <Text style={styles.statLabel}>Análises Hoje</Text>
          <Text style={styles.statChange}>+12% vs ontem</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>89%</Text>
          <Text style={styles.statLabel}>Precisão IA</Text>
          <Text style={styles.statChange}>+2% esta semana</Text>
        </View>
      </View>

      <View style={styles.featuresGrid}>
        {[
          { icon: '⎗', title: 'Análise de PDFs', subtitle: 'Upload e processamento inteligente' },
          { icon: '⊗', title: 'Biometria', subtitle: 'Autenticação segura' },
          { icon: '⎔', title: 'Dashboard', subtitle: 'Resultados em tempo real' },
          { icon: '◈', title: 'IA Avançada', subtitle: 'Machine Learning integrado' },
          { icon: '◉', title: 'Moedas', subtitle: 'Sistema de recompensas' },
          { icon: '⊞', title: 'Mobile First', subtitle: 'Experiência otimizada' },
        ].map((feature, index) => (
          <TouchableOpacity key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {currentScreen === 'login' ? <LoginScreen /> : <DashboardScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ViveSaudeTheme.colors.background,
  },
  
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: ViveSaudeTheme.colors.surface,
    justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    backgroundColor: ViveSaudeTheme.colors.background,
    borderRadius: 16,
    padding: 32,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    ...ViveSaudeTheme.shadows.card,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: ViveSaudeTheme.colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: ViveSaudeTheme.colors.background,
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 15,
    color: ViveSaudeTheme.colors.textSecondary,
    fontWeight: '500',
  },
  formSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 15,
    color: ViveSaudeTheme.colors.textSecondary,
    marginBottom: 32,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  input: {
    backgroundColor: ViveSaudeTheme.colors.surface,
    borderWidth: 1,
    borderColor: ViveSaudeTheme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: ViveSaudeTheme.colors.text,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: ViveSaudeTheme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    ...ViveSaudeTheme.shadows.button,
  },
  primaryButtonText: {
    color: ViveSaudeTheme.colors.background,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 12,
  },
  secondaryButtonText: {
    color: ViveSaudeTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  // Dashboard Screen Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: ViveSaudeTheme.colors.surface,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: ViveSaudeTheme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: ViveSaudeTheme.colors.border,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: ViveSaudeTheme.colors.text,
    letterSpacing: -0.5,
  },
  greetingSubtext: {
    fontSize: 15,
    color: ViveSaudeTheme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 48,
    height: 48,
    backgroundColor: ViveSaudeTheme.colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...ViveSaudeTheme.shadows.button,
  },
  profileButtonText: {
    color: ViveSaudeTheme.colors.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsSection: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 12,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: ViveSaudeTheme.colors.background,
    borderRadius: 16,
    padding: 20,
    ...ViveSaudeTheme.shadows.card,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: ViveSaudeTheme.colors.primary,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  statChange: {
    fontSize: 13,
    color: ViveSaudeTheme.colors.success,
    fontWeight: '500',
  },
  featuresGrid: {
    padding: 24,
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    backgroundColor: ViveSaudeTheme.colors.background,
    borderRadius: 16,
    padding: 20,
    width: (width - 64) / 2,
    minHeight: 120,
    justifyContent: 'space-between',
    ...ViveSaudeTheme.shadows.card,
  },
  featureIcon: {
    fontSize: 24,
    color: ViveSaudeTheme.colors.primary,
    marginBottom: 12,
    fontWeight: '600',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ViveSaudeTheme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featureSubtitle: {
    fontSize: 13,
    color: ViveSaudeTheme.colors.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
});
