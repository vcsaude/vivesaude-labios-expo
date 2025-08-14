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
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateName,
  validatePhone,
  getPasswordStrength,
} from '../../utils/validation';
import { analytics } from '../../services/analytics';

interface RegisterScreenProps {
  navigation: any;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''));

  const { register, isLoading } = useAuthStore();

  useEffect(() => {
    analytics.track('register_screen_viewed');
  }, []);

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(formData.password));
  }, [formData.password]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
      isValid = false;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
      isValid = false;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
      isValid = false;
    }

    // Validate password confirmation
    const confirmPasswordValidation = validatePasswordConfirm(
      formData.password,
      formData.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error;
      isValid = false;
    }

    // Validate phone (optional)
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error;
        isValid = false;
      }
    }

    // Check terms acceptance
    if (!termsAccepted) {
      Alert.alert(
        'Termos de Uso',
        'Para continuar, você deve aceitar os Termos de Uso e Política de Privacidade.',
        [{ text: 'OK', style: 'default' }]
      );
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      analytics.track('register_validation_failed', {
        errors: Object.keys(errors),
        terms_accepted: termsAccepted,
      });
      return;
    }

    try {
      analytics.track('register_attempt', {
        has_phone: !!formData.phone,
        password_strength: passwordStrength.score,
      });

      await register(formData.name, formData.email, formData.password);
      
      analytics.track('register_success');
      
      Alert.alert(
        'Conta Criada!',
        'Sua conta foi criada com sucesso. Você será redirecionado para o tutorial.',
        [
          {
            text: 'Continuar',
            onPress: () => navigation.replace('Tutorial'),
          },
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no cadastro';
      
      analytics.track('register_failed', {
        error: errorMessage,
        password_strength: passwordStrength.score,
      });
      
      Alert.alert(
        'Erro no Cadastro',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const navigateToLogin = () => {
    analytics.track('login_navigation_from_register');
    navigation.navigate('Login');
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const numbers = text.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15); // Limit to (XX) XXXXX-XXXX
    }
  };

  const renderPasswordStrength = () => {
    if (!formData.password) return null;

    return (
      <View style={styles.passwordStrength}>
        <View style={styles.strengthBar}>
          <View
            style={[
              styles.strengthFill,
              {
                width: `${passwordStrength.score}%`,
                backgroundColor: passwordStrength.color,
              },
            ]}
          />
        </View>
        <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
          {passwordStrength.label}
        </Text>
      </View>
    );
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigateToLogin}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Junte-se aos profissionais que confiam no ViveSaude
            </Text>
          </View>

          {/* Registration Form */}
          <Card style={styles.formCard} variant="elevated">
            <Input
              label="Nome completo"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              error={errors.name}
              placeholder="Seu nome completo"
              leftIcon={
                <Ionicons name="person-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              required
              accessibilityLabel="Campo de nome completo"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              placeholder="seu.email@exemplo.com"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              returnKeyType="next"
              required
              accessibilityLabel="Campo de email"
            />

            <Input
              label="Telefone (opcional)"
              type="phone"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', formatPhoneNumber(value))}
              error={errors.phone}
              placeholder="(11) 99999-9999"
              leftIcon={
                <Ionicons name="call-outline" size={20} color={colors.gray[400]} />
              }
              keyboardType="phone-pad"
              returnKeyType="next"
              maxLength={15}
              accessibilityLabel="Campo de telefone"
              hint="Recomendado para recuperação de conta"
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              placeholder="Crie uma senha segura"
              showPasswordToggle={true}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              required
              accessibilityLabel="Campo de senha"
            />
            
            {renderPasswordStrength()}

            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              error={errors.confirmPassword}
              placeholder="Digite a senha novamente"
              showPasswordToggle={true}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={colors.gray[400]} />
              }
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              required
              accessibilityLabel="Campo de confirmação de senha"
            />

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: termsAccepted }}
              accessibilityLabel="Aceitar termos de uso"
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && (
                  <Ionicons name="checkmark" size={14} color={colors.background.primary} />
                )}
              </View>
              <Text style={styles.termsText}>
                Aceito os{' '}
                <Text style={styles.termsLink}>Termos de Uso</Text>
                {' '}e{' '}
                <Text style={styles.termsLink}>Política de Privacidade</Text>
              </Text>
            </TouchableOpacity>

            <Button
              title="Criar conta"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
              accessibilityLabel="Criar conta"
            />
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity
              onPress={navigateToLogin}
              accessibilityRole="button"
              accessibilityLabel="Fazer login"
              disabled={isLoading}
            >
              <Text style={styles.loginLink}>Entrar</Text>
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
    marginBottom: 24,
    marginTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  formCard: {
    marginBottom: 24,
  },
  passwordStrength: {
    marginTop: 8,
    marginBottom: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary[500],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
    marginTop: 8,
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
});