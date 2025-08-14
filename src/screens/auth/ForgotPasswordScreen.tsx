import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { validateEmail } from '../../utils/validation';
import { analytics } from '../../services/analytics';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { forgotPassword, isLoading } = useAuthStore();

  useEffect(() => {
    analytics.track('forgot_password_screen_viewed');
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const validateForm = () => {
    setEmailError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return false;
    }

    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) {
      analytics.track('forgot_password_validation_failed');
      return;
    }

    try {
      analytics.track('forgot_password_attempt', { email });
      
      await forgotPassword(email);
      
      analytics.track('forgot_password_success');
      
      setIsSuccess(true);
      setCountdown(60); // 60 seconds cooldown
      
      Alert.alert(
        'Email Enviado!',
        'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      
      analytics.track('forgot_password_failed', {
        error: errorMessage,
        email,
      });
      
      Alert.alert(
        'Erro',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const navigateToLogin = () => {
    analytics.track('login_navigation_from_forgot_password');
    navigation.goBack();
  };

  if (isSuccess) {
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
            {/* Success State */}
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color={colors.success[500]} />
              </View>
              
              <Text style={styles.successTitle}>Email enviado!</Text>
              
              <Text style={styles.successMessage}>
                Enviamos um link de recuperação para{'\n'}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
              
              <Text style={styles.instructionsText}>
                Verifique sua caixa de entrada (e spam) e clique no link para redefinir sua senha.
              </Text>
              
              <Card style={styles.tipsCard} variant="outlined">
                <Text style={styles.tipsTitle}>Dicas importantes:</Text>
                <Text style={styles.tipItem}>" O link é válido por 24 horas</Text>
                <Text style={styles.tipItem}>" Verifique também a pasta de spam</Text>
                <Text style={styles.tipItem}>" Use uma senha forte na redefinição</Text>
              </Card>
              
              <Button
                title={countdown > 0 ? `Reenviar email (${countdown}s)` : 'Reenviar email'}
                onPress={handleForgotPassword}
                variant="outline"
                disabled={isLoading || countdown > 0}
                style={styles.resendButton}
                accessibilityLabel="Reenviar email de recuperação"
              />
              
              <Button
                title="Voltar ao Login"
                onPress={navigateToLogin}
                variant="text"
                style={styles.backButton}
                accessibilityLabel="Voltar para a tela de login"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
            <TouchableOpacity
              style={styles.backButtonHeader}
              onPress={navigateToLogin}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="key" size={32} color={colors.primary[500]} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Esqueceu sua senha?</Text>
            <Text style={styles.subtitle}>
              Não se preocupe! Informe seu email e enviaremos um link para você redefinir sua senha.
            </Text>
          </View>

          {/* Form */}
          <Card style={styles.formCard} variant="elevated">
            <Input
              label="Email"
              type="email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              placeholder="seu.email@exemplo.com"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={handleForgotPassword}
              autoFocus
              accessibilityLabel="Campo de email para recuperação"
              accessibilityHint="Digite o email da sua conta"
            />

            <Button
              title="Enviar link de recuperação"
              onPress={handleForgotPassword}
              loading={isLoading}
              disabled={isLoading || !email.trim()}
              style={styles.submitButton}
              accessibilityLabel="Enviar link de recuperação"
              accessibilityHint="Enviar email com instruções para redefinir senha"
            />
          </Card>

          {/* Security Note */}
          <Card style={styles.securityCard} variant="outlined">
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary[500]} />
              <Text style={styles.securityTitle}>Segurança</Text>
            </View>
            <Text style={styles.securityText}>
              Por questões de segurança, mesmo que o email não exista em nossa base, 
              a mensagem de confirmação será exibida.
            </Text>
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Lembrou da senha? </Text>
            <TouchableOpacity
              onPress={navigateToLogin}
              accessibilityRole="button"
              accessibilityLabel="Fazer login"
            >
              <Text style={styles.loginLink}>Fazer login</Text>
            </TouchableOpacity>
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
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  formCard: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  securityCard: {
    marginBottom: 24,
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[700],
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.primary[700],
    lineHeight: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: '600',
  },
  
  // Success state styles
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    fontWeight: '700',
    color: colors.text.primary,
  },
  instructionsText: {
    fontSize: 16,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  tipsCard: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: colors.background.tertiary,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  resendButton: {
    width: '100%',
    marginBottom: 16,
  },
  backButton: {
    width: '100%',
  },
});