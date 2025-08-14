import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList } from '../../navigation/types';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { colors } from '../../theme/colors';

import SafeContainer from '../../components/layout/SafeContainer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import SettingsForm from '../../components/forms/SettingsForm';

type Props = NativeStackScreenProps<MainTabParamList, 'Settings'>;

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'switch' | 'select' | 'action' | 'navigation';
  value?: boolean | string | number;
  onPress?: () => void;
  onValueChange?: (value: any) => void;
  options?: { label: string; value: any }[];
  badge?: string | number;
  disabled?: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    preferences,
    updateNotificationSettings,
    updateAccessibilitySettings,
    updatePrivacySettings,
    exportUserData,
    deleteUserData,
    resetPreferences,
    isLoading: isUserLoading,
  } = useUserStore();

  const { logout } = useAuthStore();
  const { 
    theme,
    setTheme,
    isLoading: isSettingsLoading 
  } = useSettingsStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleNotificationToggle = async (key: keyof typeof preferences.notifications, value: boolean) => {
    try {
      await updateNotificationSettings({ [key]: value });
      
      if (key === 'enabled' && value) {
        // Request notification permissions if enabling
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissões de Notificação',
            'As notificações foram desabilitadas nas configurações do dispositivo. Vá para Configurações > Notificações para habilitá-las.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Configurações', onPress: () => Linking.openSettings() }
            ]
          );
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar configurações de notificação');
    }
  };

  const handleAccessibilityChange = async (key: keyof typeof preferences.accessibility, value: any) => {
    try {
      await updateAccessibilitySettings({ [key]: value });
      Haptics.selectionAsync();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar configurações de acessibilidade');
    }
  };

  const handlePrivacyToggle = async (key: keyof typeof preferences.privacy, value: boolean) => {
    try {
      await updatePrivacySettings({ [key]: value });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar configurações de privacidade');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    Haptics.selectionAsync();
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const filePath = await exportUserData();
      
      Alert.alert(
        'Dados Exportados',
        'Seus dados foram exportados com sucesso.',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Compartilhar',
            onPress: () => Share.share({
              url: filePath,
              title: 'Meus Dados - ViveSaude Lábios',
            })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar dados');
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      await deleteUserData();
      Alert.alert(
        'Dados Removidos',
        'Todos os seus dados foram removidos permanentemente.',
        [{ text: 'OK', onPress: logout }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao remover dados');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Resetar Configurações',
      'Isso irá restaurar todas as configurações para os valores padrão. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            resetPreferences();
            setTheme('system');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const sections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Aparência',
      items: [
        {
          id: 'theme',
          title: 'Tema',
          subtitle: theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro',
          icon: 'color-palette-outline',
          type: 'select',
          value: theme,
          onValueChange: handleThemeChange,
          options: [
            { label: 'Sistema', value: 'system' },
            { label: 'Claro', value: 'light' },
            { label: 'Escuro', value: 'dark' },
          ],
        },
        {
          id: 'fontSize',
          title: 'Tamanho da Fonte',
          subtitle: getFontSizeLabel(preferences.accessibility.fontSize),
          icon: 'text-outline',
          type: 'select',
          value: preferences.accessibility.fontSize,
          onValueChange: (value) => handleAccessibilityChange('fontSize', value),
          options: [
            { label: 'Pequena', value: 'small' },
            { label: 'Média', value: 'medium' },
            { label: 'Grande', value: 'large' },
            { label: 'Extra Grande', value: 'extra-large' },
          ],
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notificações',
      items: [
        {
          id: 'notifications_enabled',
          title: 'Notificações',
          subtitle: 'Permitir notificações do aplicativo',
          icon: 'notifications-outline',
          type: 'switch',
          value: preferences.notifications.enabled,
          onValueChange: (value) => handleNotificationToggle('enabled', value),
        },
        {
          id: 'exam_results',
          title: 'Resultados de Exames',
          subtitle: 'Notificar quando novos resultados estiverem disponíveis',
          icon: 'document-text-outline',
          type: 'switch',
          value: preferences.notifications.examResults,
          onValueChange: (value) => handleNotificationToggle('examResults', value),
          disabled: !preferences.notifications.enabled,
        },
        {
          id: 'appointments',
          title: 'Consultas',
          subtitle: 'Lembretes de consultas e compromissos médicos',
          icon: 'calendar-outline',
          type: 'switch',
          value: preferences.notifications.appointments,
          onValueChange: (value) => handleNotificationToggle('appointments', value),
          disabled: !preferences.notifications.enabled,
        },
        {
          id: 'reminders',
          title: 'Lembretes',
          subtitle: 'Lembretes de medicamentos e cuidados',
          icon: 'alarm-outline',
          type: 'switch',
          value: preferences.notifications.reminders,
          onValueChange: (value) => handleNotificationToggle('reminders', value),
          disabled: !preferences.notifications.enabled,
        },
        {
          id: 'marketing',
          title: 'Marketing',
          subtitle: 'Novidades e promoções do ViveSaude',
          icon: 'megaphone-outline',
          type: 'switch',
          value: preferences.notifications.marketing,
          onValueChange: (value) => handleNotificationToggle('marketing', value),
          disabled: !preferences.notifications.enabled,
        },
      ],
    },
    {
      id: 'accessibility',
      title: 'Acessibilidade',
      items: [
        {
          id: 'high_contrast',
          title: 'Alto Contraste',
          subtitle: 'Melhorar a legibilidade com cores de alto contraste',
          icon: 'contrast-outline',
          type: 'switch',
          value: preferences.accessibility.highContrast,
          onValueChange: (value) => handleAccessibilityChange('highContrast', value),
        },
        {
          id: 'reduce_motion',
          title: 'Reduzir Animações',
          subtitle: 'Minimizar animações e transições',
          icon: 'play-skip-forward-outline',
          type: 'switch',
          value: preferences.accessibility.reduceMotion,
          onValueChange: (value) => handleAccessibilityChange('reduceMotion', value),
        },
        {
          id: 'voice_over',
          title: 'Suporte a VoiceOver',
          subtitle: 'Melhorar compatibilidade com leitores de tela',
          icon: 'volume-high-outline',
          type: 'switch',
          value: preferences.accessibility.voiceOver,
          onValueChange: (value) => handleAccessibilityChange('voiceOver', value),
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacidade e Segurança',
      items: [
        {
          id: 'biometric_auth',
          title: 'Autenticação Biométrica',
          subtitle: 'Usar impressão digital ou Face ID para acessar o app',
          icon: 'finger-print-outline',
          type: 'switch',
          value: preferences.privacy.biometricAuth,
          onValueChange: (value) => handlePrivacyToggle('biometricAuth', value),
        },
        {
          id: 'analytics',
          title: 'Dados de Analytics',
          subtitle: 'Ajudar a melhorar o app compartilhando dados de uso',
          icon: 'analytics-outline',
          type: 'switch',
          value: preferences.privacy.allowAnalytics,
          onValueChange: (value) => handlePrivacyToggle('allowAnalytics', value),
        },
        {
          id: 'anonymous_data',
          title: 'Dados Anônimos',
          subtitle: 'Compartilhar dados anonimizados para pesquisa médica',
          icon: 'shield-checkmark-outline',
          type: 'switch',
          value: preferences.privacy.shareAnonymousData,
          onValueChange: (value) => handlePrivacyToggle('shareAnonymousData', value),
        },
      ],
    },
    {
      id: 'support',
      title: 'Suporte',
      items: [
        {
          id: 'help',
          title: 'Central de Ajuda',
          subtitle: 'Encontre respostas para suas dúvidas',
          icon: 'help-circle-outline',
          type: 'navigation',
          onPress: () => navigation.navigate('Help'),
        },
        {
          id: 'contact',
          title: 'Contato',
          subtitle: 'Entre em contato com nosso suporte',
          icon: 'mail-outline',
          type: 'action',
          onPress: () => Linking.openURL('mailto:suporte@vivesaude.com.br'),
        },
        {
          id: 'rate',
          title: 'Avaliar o App',
          subtitle: 'Deixe sua avaliação na loja de aplicativos',
          icon: 'star-outline',
          type: 'action',
          onPress: () => {
            const storeUrl = 'https://apps.apple.com/app/vivesaude-labios/id123456789';
            Linking.openURL(storeUrl);
          },
        },
      ],
    },
  ];

  if (showAdvanced) {
    sections.push({
      id: 'advanced',
      title: 'Configurações Avançadas',
      items: [
        {
          id: 'export_data',
          title: 'Exportar Dados',
          subtitle: 'Baixar uma cópia de todos os seus dados',
          icon: 'download-outline',
          type: 'action',
          onPress: () => setShowExportModal(true),
        },
        {
          id: 'reset_settings',
          title: 'Resetar Configurações',
          subtitle: 'Restaurar todas as configurações para o padrão',
          icon: 'refresh-outline',
          type: 'action',
          onPress: handleResetSettings,
        },
        {
          id: 'delete_data',
          title: 'Excluir Todos os Dados',
          subtitle: 'Remover permanentemente todos os seus dados',
          icon: 'trash-outline',
          type: 'action',
          onPress: () => setShowDeleteModal(true),
        },
      ],
    });
  }

  const renderSettingItem = (item: SettingItem) => {
    const isDisabled = item.disabled || isUserLoading || isSettingsLoading;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, isDisabled && styles.settingItemDisabled]}
        onPress={item.onPress}
        disabled={isDisabled || item.type === 'switch'}
        accessibilityRole="button"
        accessibilityLabel={item.title}
        accessibilityHint={item.subtitle}
      >
        <View style={styles.settingLeft}>
          <View style={[
            styles.settingIcon,
            { backgroundColor: isDisabled ? colors.secondary[100] : colors.primary[50] }
          ]}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isDisabled ? colors.text.disabled : colors.primary[500]}
            />
          </View>

          <View style={styles.settingContent}>
            <Text style={[
              styles.settingTitle,
              isDisabled && styles.settingTitleDisabled
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[
                styles.settingSubtitle,
                isDisabled && styles.settingSubtitleDisabled
              ]}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.settingRight}>
          {item.badge && (
            <View style={styles.settingBadge}>
              <Text style={styles.settingBadgeText}>{item.badge}</Text>
            </View>
          )}

          {item.type === 'switch' && (
            <Switch
              value={item.value as boolean}
              onValueChange={item.onValueChange}
              disabled={isDisabled}
              trackColor={{
                false: colors.secondary[300],
                true: colors.primary[200],
              }}
              thumbColor={
                item.value
                  ? colors.primary[500]
                  : colors.secondary[100]
              }
            />
          )}

          {(item.type === 'navigation' || item.type === 'action' || item.type === 'select') && (
            <Ionicons
              name="chevron-forward"
              size={16}
              color={isDisabled ? colors.text.disabled : colors.text.secondary}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: SettingSection) => (
    <Card key={section.id} style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < section.items.length - 1 && <View style={styles.itemDivider} />}
          </View>
        ))}
      </View>
    </Card>
  );

  function getFontSizeLabel(fontSize: string) {
    switch (fontSize) {
      case 'small': return 'Pequena';
      case 'medium': return 'Média';
      case 'large': return 'Grande';
      case 'extra-large': return 'Extra Grande';
      default: return 'Média';
    }
  }

  return (
    <SafeContainer>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Configurações</Text>

        <TouchableOpacity
          onPress={() => setShowAdvanced(!showAdvanced)}
          style={styles.advancedButton}
          accessibilityRole="button"
          accessibilityLabel="Configurações avançadas"
        >
          <Ionicons
            name={showAdvanced ? 'close' : 'settings-outline'}
            size={20}
            color={colors.primary[500]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map(renderSection)}

        {/* Version Info */}
        <View style={styles.versionCard}>
          <Text style={styles.versionTitle}>ViveSaude Lábios</Text>
          <Text style={styles.versionText}>Versão 1.0.0 (Build 1)</Text>
          <Text style={styles.versionCopyright}>
            © 2024 ViveSaude. Todos os direitos reservados.
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Export Data Modal */}
      <Modal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Exportar Dados"
      >
        <View style={styles.modalContent}>
          <Ionicons name="download" size={48} color={colors.primary[500]} />
          <Text style={styles.modalTitle}>Exportar Seus Dados</Text>
          <Text style={styles.modalText}>
            Uma cópia de todos os seus dados será gerada em formato JSON.
            Isso inclui perfil, exames, análises e preferências.
          </Text>

          <View style={styles.modalActions}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={() => setShowExportModal(false)}
              style={styles.modalButton}
            />
            <Button
              title={isExporting ? "Exportando..." : "Exportar"}
              variant="primary"
              onPress={handleExportData}
              disabled={isExporting}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Delete Data Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Dados"
      >
        <View style={styles.modalContent}>
          <Ionicons name="warning" size={48} color={colors.error[500]} />
          <Text style={styles.modalTitle}>Excluir Todos os Dados</Text>
          <Text style={styles.modalText}>
            Esta ação não pode ser desfeita. Todos os seus dados serão
            removidos permanentemente, incluindo perfil, exames, análises e configurações.
          </Text>

          <View style={styles.modalActions}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={() => setShowDeleteModal(false)}
              style={styles.modalButton}
            />
            <Button
              title={isDeleting ? "Excluindo..." : "Excluir Tudo"}
              variant="primary"
              onPress={handleDeleteData}
              disabled={isDeleting}
              style={[styles.modalButton, { backgroundColor: colors.error[500] }]}
            />
          </View>
        </View>
      </Modal>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 16,
  },
  advancedButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: colors.text.disabled,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  settingSubtitleDisabled: {
    color: colors.text.disabled,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingBadge: {
    backgroundColor: colors.error[500],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  settingBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: 48,
  },
  versionCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
    marginTop: 16,
  },
  versionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  versionCopyright: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 16,
  },
  modalButton: {
    flex: 1,
  },
});

export default SettingsScreen;