import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { validateEmail, validatePassword } from '../../utils/validation';
import { analytics } from '../../services/analytics';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  const { login, loginWithBiometric, isLoading, biometricEnabled } = useAuthStore();

  useEffect(() => {
    checkBiometricAvailability();
    analytics.track('login_screen_viewed');
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricAvailable(hasHardware && isEnrolled && biometricEnabled);
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Touch ID');
      } else {
        setBiometricType('Biometria');
      }
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      isValid = false;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      analytics.track('login_validation_failed', {
        email_error: !!emailError,
        password_error: !!passwordError,
      });
      return;
    }

    try {
      analytics.track('login_attempt', { method: 'email_password' });
      await login(email, password);
      
      analytics.track('login_success', { method: 'email_password' });
      navigation.replace('Main');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      
      analytics.track('login_failed', {
        method: 'email_password',
        error: errorMessage,
      });
      
      Alert.alert(
        'Erro no Login',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleBiometricLogin = async () => {
    try {
      analytics.track('login_attempt', { method: 'biometric' });
      await loginWithBiometric();
      
      analytics.track('login_success', { method: 'biometric' });
      navigation.replace('Main');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na autenticação biométrica';
      
      analytics.track('login_failed', {
        method: 'biometric',
        error: errorMessage,
      });
      
      if (!errorMessage.includes('cancelada')) {
        Alert.alert(
          'Erro na Biometria',
          errorMessage,
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
  };

  const navigateToRegister = () => {
    analytics.track('register_navigation_from_login');
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    analytics.track('forgot_password_navigation');
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="medical" size={48} color={colors.primary[500]} />
            </View>
            <Text style={styles.title}>ViveSaude Lábios</Text>
            <Text style={styles.subtitle}>
              Análise profissional de exames labiais
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard} variant="elevated">
            <Text style={styles.formTitle}>Entrar na sua conta</Text>
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              placeholder="seu.email@exemplo.com"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              returnKeyType="next"
              accessibilityLabel="Campo de email"
              accessibilityHint="Digite seu endereço de email"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              placeholder="Digite sua senha"
              showPasswordToggle={true}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              accessibilityLabel="Campo de senha"
              accessibilityHint="Digite sua senha"
            />

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={navigateToForgotPassword}
              accessibilityRole="button"
              accessibilityLabel="Esqueci minha senha"
            >
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              accessibilityLabel="Botão de entrar"
              accessibilityHint="Toque para fazer login com email e senha"
            />

            {/* Biometric Login */}
            {biometricAvailable && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  title={`Entrar com ${biometricType}`}
                  onPress={handleBiometricLogin}
                  variant="outline"
                  disabled={isLoading}
                  icon={
                    <Ionicons 
                      name={biometricType.includes('Face') ? 'scan' : 'finger-print'} 
                      size={20} 
                      color={colors.primary[500]} 
                    />
                  }
                  accessibilityLabel={`Entrar com ${biometricType}`}
                  accessibilityHint={`Use ${biometricType} para fazer login rapidamente`}
                />
              </>
            )}
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={navigateToRegister}
              accessibilityRole="button"
              accessibilityLabel="Criar conta"
              disabled={isLoading}
            >
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Versão 1.0.0 " Desenvolvido para profissionais de saúde
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  registerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  registerLink: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});