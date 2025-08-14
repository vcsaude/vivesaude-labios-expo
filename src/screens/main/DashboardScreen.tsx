import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { useExamStore } from '../../store/examStore';
import { colors } from '../../theme/colors';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { analytics } from '../../services/analytics';
import { formatDate } from '../../utils/dateHelpers';

const { width: screenWidth } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Card style={[styles.statCard, { borderLeftColor: color }]} variant="elevated">
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          {trend && (
            <View style={[styles.trendBadge, { backgroundColor: trend.isPositive ? colors.success[50] : colors.error[50] }]}>
              <Ionicons 
                name={trend.isPositive ? 'trending-up' : 'trending-down'} 
                size={12} 
                color={trend.isPositive ? colors.success[500] : colors.error[500]} 
              />
              <Text style={[
                styles.trendText, 
                { color: trend.isPositive ? colors.success[500] : colors.error[500] }
              ]}>
                {trend.value}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </Card>
    </Animated.View>
  );
};

const QuickActionCard: React.FC<QuickActionProps> = ({ title, subtitle, icon, color, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <LinearGradient
        colors={[color, color + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionGradient}
      >
        <View style={styles.quickActionIcon}>
          <Ionicons name={icon} size={28} color={colors.background.primary} />
        </View>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const { user, logout } = useAuthStore();
  const { exams, isLoading, fetchExams, getStats } = useExamStore();
  
  // Get computed stats
  const stats = getStats();

  useEffect(() => {
    analytics.track('dashboard_viewed', {
      user_id: user?.id,
      exams_count: exams.length,
    });

    setupGreeting();
    loadInitialData();
    setupAnimations();
  }, []);

  const setupGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia');
    } else if (hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  };

  const loadInitialData = async () => {
    try {
      await fetchExams();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const setupAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    analytics.track('dashboard_refreshed');
    
    try {
      await fetchExams();
    } catch (error) {
      Alert.alert(
        'Erro ao Atualizar',
        'Não foi possível atualizar os dados. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const navigateToNewExam = () => {
    analytics.track('new_exam_initiated_from_dashboard');
    navigation.navigate('Upload');
  };

  const navigateToHistory = () => {
    analytics.track('history_accessed_from_dashboard');
    navigation.navigate('History');
  };

  const navigateToAnalysis = (examId: string) => {
    analytics.track('exam_analysis_accessed', { exam_id: examId });
    navigation.navigate('ExamAnalysis', { examId });
  };

  const navigateToProfile = () => {
    analytics.track('profile_accessed_from_dashboard');
    navigation.navigate('Profile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            analytics.track('logout_initiated');
            await logout();
          },
        },
      ]
    );
  };

  const getRecentExams = () => {
    return exams
      .slice(0, 3)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const renderRecentExam = (exam: any, index: number) => {
    const statusColors = {
      processing: colors.warning[500],
      completed: colors.success[500],
      failed: colors.error[500],
    };

    const statusLabels = {
      processing: 'Analisando',
      completed: 'Concluído',
      failed: 'Erro',
    };

    return (
      <TouchableOpacity
        key={exam.id}
        style={styles.recentExamItem}
        onPress={() => navigateToAnalysis(exam.id)}
        accessibilityRole="button"
        accessibilityLabel={`Exame ${exam.name}`}
      >
        <View style={styles.examInfo}>
          <Text style={styles.examName} numberOfLines={1}>
            {exam.name || `Exame ${index + 1}`}
          </Text>
          <Text style={styles.examDate}>
            {formatDate(exam.createdAt)}
          </Text>
        </View>
        
        <View style={styles.examStatus}>
          <View style={[styles.statusDot, { backgroundColor: statusColors[exam.status] }]} />
          <Text style={[styles.statusText, { color: statusColors[exam.status] }]}>
            {statusLabels[exam.status]}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && exams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Usuário'}</Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={navigateToProfile}
                accessibilityRole="button"
                accessibilityLabel="Perfil"
              >
                <Ionicons name="person-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleLogout}
                accessibilityRole="button"
                accessibilityLabel="Sair"
              >
                <Ionicons name="log-out-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Total de Exames"
              value={stats.totalExams.toString()}
              subtitle="Análises realizadas"
              icon="document-text"
              color={colors.primary[500]}
              trend={{ value: '+12%', isPositive: true }}
            />
            
            <StatCard
              title="Recentes"
              value={stats.recentExams.toString()}
              subtitle="Últimos 7 dias"
              icon="time"
              color={colors.warning[500]}
            />
            
            <StatCard
              title="Alertas"
              value={stats.alertsCount.toString()}
              subtitle="Requerem atenção"
              icon="alert-circle"
              color={stats.alertsCount > 0 ? colors.error[500] : colors.success[500]}
              trend={stats.alertsCount > 0 ? { value: `${stats.alertsCount} alertas`, isPositive: false } : undefined}
            />
            
            <StatCard
              title="Precisão Média"
              value="98,5%"
              subtitle="Taxa de assertividade"
              icon="analytics"
              color={colors.chart.primary}
              trend={{ value: '+2.3%', isPositive: true }}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="Novo Exame"
              subtitle="Enviar para análise"
              icon="add-circle"
              color={colors.primary[500]}
              onPress={navigateToNewExam}
            />
            
            <QuickActionCard
              title="Histórico"
              subtitle="Ver todos os exames"
              icon="time"
              color={colors.secondary[600]}
              onPress={navigateToHistory}
            />
          </View>
        </Animated.View>

        {/* Recent Exams */}
        <Animated.View
          style={[
            styles.recentExamsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exames Recentes</Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={styles.sectionAction}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {getRecentExams().length > 0 ? (
            <Card style={styles.recentExamsCard} variant="elevated">
              {getRecentExams().map((exam, index) => renderRecentExam(exam, index))}
            </Card>
          ) : (
            <Card style={styles.emptyCard} variant="outlined">
              <View style={styles.emptyContent}>
                <Ionicons name="document-outline" size={48} color={colors.text.tertiary} />
                <Text style={styles.emptyTitle}>Nenhum exame ainda</Text>
                <Text style={styles.emptySubtitle}>
                  Comece enviando seu primeiro exame para análise
                </Text>
                <Button
                  title="Enviar Primeiro Exame"
                  onPress={navigateToNewExam}
                  variant="outline"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          )}
        </Animated.View>

        {/* Health Tips */}
        <Animated.View
          style={[
            styles.tipsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={styles.tipsCard} variant="elevated">
            <LinearGradient
              colors={[colors.health.info + '20', colors.health.info + '10']}
              style={styles.tipsGradient}
            >
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={24} color={colors.health.info} />
                <Text style={styles.tipsTitle}>Dica de Saúde</Text>
              </View>
              
              <Text style={styles.tipsContent}>
                Mantenha uma boa higiene bucal escovando os dentes pelo menos duas vezes ao dia 
                e usando fio dental regularmente para prevenir problemas labiais.
              </Text>
            </LinearGradient>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    gap: 16,
  },
  statCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.background.primary,
    textAlign: 'center',
    opacity: 0.8,
  },
  recentExamsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionAction: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '600',
  },
  recentExamsCard: {
    paddingVertical: 8,
  },
  recentExamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  examStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: colors.background.tertiary,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 200,
  },
  tipsSection: {
    paddingHorizontal: 24,
  },
  tipsCard: {
    overflow: 'hidden',
  },
  tipsGradient: {
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.health.info,
    marginLeft: 8,
  },
  tipsContent: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});