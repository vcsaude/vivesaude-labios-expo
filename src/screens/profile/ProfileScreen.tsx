import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActionSheetIOS,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList } from '../../navigation/types';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useExamStore } from '../../store/examStore';
import { colors } from '../../theme/colors';

import SafeContainer from '../../components/layout/SafeContainer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import ProfileForm from '../../components/forms/ProfileForm';
import { dateHelpers } from '../../utils/dateHelpers';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  badge?: number;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const {
    profile,
    updateProfile,
    isLoading: isUserLoading,
  } = useUserStore();
  
  const { logout } = useAuthStore();
  const { getStats } = useExamStore();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // Get exam statistics
  const examStats = getStats();

  const handleAvatarPress = () => {
    const options = [
      'Câmera',
      'Galeria de Fotos',
      'Remover Foto',
      'Cancelar'
    ];

    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            openCamera();
          } else if (buttonIndex === 1) {
            openImageLibrary();
          } else if (buttonIndex === 2) {
            removeAvatar();
          }
        }
      );
    } else {
      Alert.alert(
        'Foto do Perfil',
        'Escolha uma opção',
        [
          { text: 'Câmera', onPress: openCamera },
          { text: 'Galeria', onPress: openImageLibrary },
          { text: 'Remover Foto', onPress: removeAvatar, style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permissão Necessária', 'É necessário permitir o acesso à câmera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        await updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao capturar foto');
    }
  };

  const openImageLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permissão Necessária', 'É necessário permitir o acesso à galeria');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        await updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar imagem');
    }
  };

  const updateAvatar = async (imageUri: string) => {
    setIsUpdatingAvatar(true);
    try {
      await updateProfile({ avatar: imageUri });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar foto do perfil');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    setIsUpdatingAvatar(true);
    try {
      await updateProfile({ avatar: undefined });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao remover foto do perfil');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const quickActions: QuickAction[] = [
    {
      id: 'settings',
      title: 'Configurações',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Ajuda',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Help'),
    },
    {
      id: 'medical',
      title: 'Info Médica',
      icon: 'medical-outline',
      onPress: () => setShowMedicalInfo(true),
    },
    {
      id: 'export',
      title: 'Exportar Dados',
      icon: 'download-outline',
      onPress: () => handleExportData(),
    },
  ];

  const handleExportData = async () => {
    try {
      Alert.alert(
        'Exportar Dados',
        'Seus dados serão compilados e disponibilizados para download.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Exportar', onPress: () => console.log('Export initiated') }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar dados');
    }
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <SafeContainer>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        
        <TouchableOpacity
          onPress={() => setShowEditProfile(true)}
          style={styles.editButton}
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
        >
          <Ionicons name="create-outline" size={20} color={colors.primary[500]} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Card */}
        <Card style={styles.profileCard}>
          <LinearGradient
            colors={[colors.primary[500], colors.primary[600]]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              onPress={handleAvatarPress}
              style={styles.avatarContainer}
              accessibilityRole="button"
              accessibilityLabel="Alterar foto do perfil"
              disabled={isUpdatingAvatar}
            >
              <Avatar
                size={80}
                source={profile?.avatar}
                name={profile?.name || 'Usuário'}
                style={styles.avatar}
              />
              
              {isUpdatingAvatar ? (
                <View style={styles.avatarOverlay}>
                  <LoadingSpinner size="small" color={colors.text.inverse} />
                </View>
              ) : (
                <View style={styles.avatarBadge}>
                  <Ionicons name="camera" size={16} color={colors.text.inverse} />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.name || 'Nome do Usuário'}
              </Text>
              
              {profile?.email && (
                <Text style={styles.profileEmail}>{profile.email}</Text>
              )}

              <View style={styles.profileMeta}>
                {profile?.birthDate && (
                  <Text style={styles.profileMetaText}>
                    {getAge(profile.birthDate)} anos
                  </Text>
                )}
                
                {profile?.phone && (
                  <Text style={styles.profileMetaText}>
                    {profile.phone}
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{examStats.totalExams}</Text>
              <Text style={styles.statLabel}>Exames</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{examStats.recentExams}</Text>
              <Text style={styles.statLabel}>Esta Semana</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                examStats.alertsCount > 0 && { color: colors.health.warning }
              ]}>
                {examStats.alertsCount}
              </Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
          </View>

          {examStats.lastUpload && (
            <View style={styles.lastActivity}>
              <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.lastActivityText}>
                Último exame: {dateHelpers.formatRelative(examStats.lastUpload)}
              </Text>
            </View>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                style={[
                  styles.actionItem,
                  index % 2 === 1 && styles.actionItemRight
                ]}
                accessibilityRole="button"
                accessibilityLabel={action.title}
              >
                <View style={styles.actionIcon}>
                  <Ionicons 
                    name={action.icon as any} 
                    size={24} 
                    color={colors.primary[500]} 
                  />
                  {action.badge && action.badge > 0 && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>{action.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Medical Info Quick View */}
        {profile?.medicalInfo && (
          <Card style={styles.medicalCard}>
            <TouchableOpacity
              onPress={() => setShowMedicalInfo(true)}
              style={styles.medicalHeader}
              accessibilityRole="button"
              accessibilityLabel="Ver informações médicas"
            >
              <View style={styles.medicalTitleContainer}>
                <Ionicons name="medical" size={20} color={colors.health.info} />
                <Text style={styles.sectionTitle}>Informações Médicas</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>

            <View style={styles.medicalSummary}>
              {profile.medicalInfo.allergies && profile.medicalInfo.allergies.length > 0 && (
                <View style={styles.medicalItem}>
                  <Text style={styles.medicalLabel}>Alergias:</Text>
                  <Text style={styles.medicalValue}>
                    {profile.medicalInfo.allergies.length} cadastrada(s)
                  </Text>
                </View>
              )}

              {profile.medicalInfo.medications && profile.medicalInfo.medications.length > 0 && (
                <View style={styles.medicalItem}>
                  <Text style={styles.medicalLabel}>Medicamentos:</Text>
                  <Text style={styles.medicalValue}>
                    {profile.medicalInfo.medications.length} em uso
                  </Text>
                </View>
              )}

              {profile.medicalInfo.conditions && profile.medicalInfo.conditions.length > 0 && (
                <View style={styles.medicalItem}>
                  <Text style={styles.medicalLabel}>Condições:</Text>
                  <Text style={styles.medicalValue}>
                    {profile.medicalInfo.conditions.length} cadastrada(s)
                  </Text>
                </View>
              )}

              {profile.medicalInfo.emergencyContact && (
                <View style={styles.medicalItem}>
                  <Text style={styles.medicalLabel}>Contato de Emergência:</Text>
                  <Text style={styles.medicalValue}>
                    {profile.medicalInfo.emergencyContact.name}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Account Actions */}
        <Card style={styles.accountCard}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <TouchableOpacity
            style={styles.accountAction}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error[500]} />
            <Text style={[styles.accountActionText, { color: colors.error[500] }]}>
              Sair
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.error[500]} />
          </TouchableOpacity>
        </Card>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>ViveSaude Lábios v1.0.0</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Editar Perfil"
      >
        <ProfileForm
          profile={profile}
          onSave={async (updatedProfile) => {
            try {
              await updateProfile(updatedProfile);
              setShowEditProfile(false);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao atualizar perfil');
            }
          }}
          onCancel={() => setShowEditProfile(false)}
          isLoading={isUserLoading}
        />
      </Modal>

      {/* Medical Info Modal */}
      <Modal
        visible={showMedicalInfo}
        onClose={() => setShowMedicalInfo(false)}
        title="Informações Médicas"
      >
        <ScrollView style={styles.medicalModal} showsVerticalScrollIndicator={false}>
          {profile?.medicalInfo ? (
            <View style={styles.medicalDetails}>
              {/* Allergies */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Alergias</Text>
                {profile.medicalInfo.allergies && profile.medicalInfo.allergies.length > 0 ? (
                  profile.medicalInfo.allergies.map((allergy, index) => (
                    <Text key={index} style={styles.medicalListItem}>
                      " {allergy}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.medicalEmptyText}>Nenhuma alergia cadastrada</Text>
                )}
              </View>

              {/* Medications */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Medicamentos</Text>
                {profile.medicalInfo.medications && profile.medicalInfo.medications.length > 0 ? (
                  profile.medicalInfo.medications.map((medication, index) => (
                    <Text key={index} style={styles.medicalListItem}>
                      " {medication}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.medicalEmptyText}>Nenhum medicamento cadastrado</Text>
                )}
              </View>

              {/* Conditions */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Condições Médicas</Text>
                {profile.medicalInfo.conditions && profile.medicalInfo.conditions.length > 0 ? (
                  profile.medicalInfo.conditions.map((condition, index) => (
                    <Text key={index} style={styles.medicalListItem}>
                      " {condition}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.medicalEmptyText}>Nenhuma condição cadastrada</Text>
                )}
              </View>

              {/* Emergency Contact */}
              <View style={styles.medicalSection}>
                <Text style={styles.medicalSectionTitle}>Contato de Emergência</Text>
                {profile.medicalInfo.emergencyContact ? (
                  <View style={styles.emergencyContact}>
                    <Text style={styles.medicalContactName}>
                      {profile.medicalInfo.emergencyContact.name}
                    </Text>
                    <Text style={styles.medicalContactInfo}>
                      {profile.medicalInfo.emergencyContact.phone}
                    </Text>
                    <Text style={styles.medicalContactInfo}>
                      {profile.medicalInfo.emergencyContact.relationship}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.medicalEmptyText}>Nenhum contato de emergência cadastrado</Text>
                )}
              </View>

              <Button
                title="Editar Informações Médicas"
                variant="outline"
                onPress={() => {
                  setShowMedicalInfo(false);
                  setShowEditProfile(true);
                }}
                style={styles.editMedicalButton}
              />
            </View>
          ) : (
            <View style={styles.medicalEmpty}>
              <Text style={styles.medicalEmptyText}>
                Nenhuma informação médica cadastrada
              </Text>
              <Button
                title="Adicionar Informações"
                variant="primary"
                onPress={() => {
                  setShowMedicalInfo(false);
                  setShowEditProfile(true);
                }}
                style={styles.addMedicalButton}
              />
            </View>
          )}
        </ScrollView>
      </Modal>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary[500],
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 3,
    borderColor: colors.text.inverse,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.overlay,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[700],
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.text.inverse,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
    marginBottom: 8,
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  profileMetaText: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border.light,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  lastActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  lastActivityText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    minWidth: (width - 56) / 2, // Account for card padding and gap
    maxWidth: (width - 56) / 2,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionItemRight: {
    marginLeft: 0,
  },
  actionIcon: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 24,
    marginBottom: 8,
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  medicalCard: {
    marginBottom: 16,
  },
  medicalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicalSummary: {
    gap: 8,
  },
  medicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicalLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    minWidth: 120,
  },
  medicalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  accountCard: {
    marginBottom: 16,
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  accountActionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  bottomSpacing: {
    height: 32,
  },
  medicalModal: {
    maxHeight: 400,
  },
  medicalDetails: {
    gap: 24,
  },
  medicalSection: {
    gap: 8,
  },
  medicalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  medicalListItem: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  medicalEmptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  emergencyContact: {
    gap: 4,
  },
  medicalContactName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  medicalContactInfo: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  editMedicalButton: {
    marginTop: 8,
  },
  medicalEmpty: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 32,
  },
  addMedicalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default ProfileScreen;