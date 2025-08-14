import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { analytics } from '../../services/analytics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

interface FeatureItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: 'scan',
    title: 'Análise Precisa',
    description: 'Tecnologia avançada de IA para análise detalhada de exames labiais'
  },
  {
    icon: 'shield-checkmark',
    title: 'Segurança Total',
    description: 'Seus dados médicos protegidos com criptografia de nível hospitalar'
  },
  {
    icon: 'trending-up',
    title: 'Acompanhamento',
    description: 'Monitore a evolução dos tratamentos com relatórios detalhados'
  },
  {
    icon: 'medical',
    title: 'Profissional',
    description: 'Desenvolvido em colaboração com especialistas em medicina oral'
  }
];

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    analytics.track('welcome_screen_viewed');
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateToLogin = () => {
    analytics.track('login_navigation_from_welcome');
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    analytics.track('register_navigation_from_welcome');
    navigation.navigate('Register');
  };

  const renderFeature = (feature: FeatureItem, index: number) => {
    const delayedFadeAnim = useRef(new Animated.Value(0)).current;
    const delayedSlideAnim = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(delayedFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 500 + index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(delayedSlideAnim, {
          toValue: 0,
          duration: 600,
          delay: 500 + index * 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        key={feature.title}
        style={[
          styles.featureItem,
          {
            opacity: delayedFadeAnim,
            transform: [{ translateY: delayedSlideAnim }],
          },
        ]}
      >
        <View style={styles.featureIcon}>
          <Ionicons name={feature.icon} size={24} color={colors.primary[500]} />
        </View>
        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary[500], colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Ionicons name="medical" size={48} color={colors.background.primary} />
          </LinearGradient>
          
          <Text style={styles.appName}>ViveSaude Lábios</Text>
          <Text style={styles.tagline}>
            Análise profissional de{'\n'}exames labiais com IA
          </Text>
          
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={16} color={colors.success[500]} />
            <Text style={styles.trustText}>Certificado para uso médico</Text>
          </View>
        </Animated.View>

        {/* Features Section */}
        <Card style={styles.featuresCard} variant="elevated">
          <Text style={styles.featuresTitle}>Por que escolher o ViveSaude?</Text>
          
          {features.map((feature, index) => renderFeature(feature, index))}
        </Card>

        {/* Statistics Section */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Precisão</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5000+</Text>
            <Text style={styles.statLabel}>Análises</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Suporte</Text>
          </View>
        </Animated.View>

        {/* Call to Action */}
        <Animated.View
          style={[
            styles.ctaSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Button
            title="Criar conta gratuita"
            onPress={navigateToRegister}
            style={styles.primaryButton}
            accessibilityLabel="Criar conta gratuita"
            accessibilityHint="Registrar uma nova conta no aplicativo"
          />
          
          <Button
            title="Já tenho uma conta"
            onPress={navigateToLogin}
            variant="outline"
            style={styles.secondaryButton}
            accessibilityLabel="Já tenho uma conta"
            accessibilityHint="Fazer login com conta existente"
          />
        </Animated.View>

        {/* Security Notice */}
        <Card style={styles.securityNotice} variant="outlined">
          <View style={styles.securityHeader}>
            <Ionicons name="lock-closed" size={20} color={colors.primary[500]} />
            <Text style={styles.securityTitle}>Segurança e Privacidade</Text>
          </View>
          
          <Text style={styles.securityText}>
            Seus dados médicos são criptografados e armazenados com segurança. 
            Nunca compartilhamos informações pessoais com terceiros.
          </Text>
          
          <View style={styles.complianceRow}>
            <View style={styles.complianceBadge}>
              <Text style={styles.complianceText}>LGPD</Text>
            </View>
            <View style={styles.complianceBadge}>
              <Text style={styles.complianceText}>ISO 27001</Text>
            </View>
            <View style={styles.complianceBadge}>
              <Text style={styles.complianceText}>HIPAA</Text>
            </View>
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos{' '}
            <Text style={styles.footerLink}>Termos de Uso</Text>
            {' '}e{' '}
            <Text style={styles.footerLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  trustText: {
    fontSize: 14,
    color: colors.success[700],
    fontWeight: '600',
    marginLeft: 6,
  },
  featuresCard: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    paddingTop: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  ctaSection: {
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {},
  securityNotice: {
    marginBottom: 24,
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  complianceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  complianceBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  complianceText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: colors.primary[500],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});