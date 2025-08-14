import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList } from '../../navigation/types';
import { useExamStore } from '../../store/examStore';
import { Exam, ExamParameter } from '../../types/exam';
import { colors } from '../../theme/colors';

import SafeContainer from '../../components/layout/SafeContainer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ParameterList from '../../components/exam/ParameterList';
import ParameterChart from '../../components/charts/ParameterChart';
import TrendChart from '../../components/charts/TrendChart';
import ExportMenu from '../../components/exam/ExportMenu';
import { dateHelpers } from '../../utils/dateHelpers';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<MainTabParamList, 'ExamDetail'>;

interface ParameterStatus {
  normal: number;
  abnormal: number;
  borderline: number;
}

const ExamDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { examId } = route.params;
  const {
    currentExam,
    getExamById,
    deleteExam,
    exportExam,
    shareExam,
    getAnalyses,
    isLoading,
  } = useExamStore();

  const [exam, setExam] = useState<Exam | null>(currentExam);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedView, setSelectedView] = useState<'table' | 'chart' | 'trend'>('table');

  // Load exam data
  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    try {
      const examData = await getExamById(examId);
      if (examData) {
        setExam(examData);
      } else {
        Alert.alert('Erro', 'Exame não encontrado');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar o exame');
      navigation.goBack();
    }
  };

  // Calculate parameter status
  const parameterStatus = useMemo((): ParameterStatus => {
    if (!exam) return { normal: 0, abnormal: 0, borderline: 0 };

    let normal = 0;
    let abnormal = 0;
    let borderline = 0;

    exam.parameters.forEach((param) => {
      if (!param.referenceRange || !param.value) return;

      const value = parseFloat(param.value);
      if (isNaN(value)) return;

      // Parse reference range (simplified logic)
      const range = param.referenceRange.toLowerCase();
      
      if (range.includes(' - ')) {
        const [min, max] = range.split(' - ').map(v => parseFloat(v.replace(/[<>]/g, '')));
        if (!isNaN(min) && !isNaN(max)) {
          const tolerance = (max - min) * 0.1; // 10% tolerance for borderline
          
          if (value < min - tolerance || value > max + tolerance) {
            abnormal++;
          } else if (value < min || value > max) {
            borderline++;
          } else {
            normal++;
          }
        }
      } else if (range.includes('<')) {
        const max = parseFloat(range.replace('<', '').trim());
        if (!isNaN(max)) {
          const tolerance = max * 0.1;
          if (value > max + tolerance) {
            abnormal++;
          } else if (value > max) {
            borderline++;
          } else {
            normal++;
          }
        }
      } else if (range.includes('>')) {
        const min = parseFloat(range.replace('>', '').trim());
        if (!isNaN(min)) {
          const tolerance = min * 0.1;
          if (value < min - tolerance) {
            abnormal++;
          } else if (value < min) {
            borderline++;
          } else {
            normal++;
          }
        }
      }
    });

    return { normal, abnormal, borderline };
  }, [exam]);

  // Get analyses for this exam
  const analyses = exam ? getAnalyses(exam.id) : [];
  const latestAnalysis = analyses[0];

  const handleDelete = async () => {
    try {
      await deleteExam(examId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao excluir o exame');
    }
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true);
    try {
      const filePath = await exportExam(examId, format);
      await Share.share({
        url: filePath,
        title: `${exam?.title || 'Exame'} - ${format.toUpperCase()}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar o exame');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleShare = async () => {
    try {
      await shareExam(examId);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao compartilhar o exame');
    }
  };

  const handleAnalyze = () => {
    if (exam) {
      navigation.navigate('ExamAnalysis', { examId: exam.id });
    }
  };

  if (isLoading || !exam) {
    return (
      <SafeContainer>
        <LoadingSpinner size="large" />
      </SafeContainer>
    );
  }

  const StatusIndicator = ({ status, count }: { status: keyof ParameterStatus; count: number }) => (
    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.statusCount}>{count}</Text>
      <Text style={styles.statusLabel}>
        {status === 'normal' ? 'Normal' : status === 'abnormal' ? 'Alterado' : 'Atenção'}
      </Text>
    </View>
  );

  const getStatusColor = (status: keyof ParameterStatus) => {
    switch (status) {
      case 'normal':
        return colors.health.success;
      case 'abnormal':
        return colors.health.danger;
      case 'borderline':
        return colors.health.warning;
      default:
        return colors.secondary[400];
    }
  };

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

        <Text style={styles.headerTitle} numberOfLines={1}>
          {exam.title}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleAnalyze}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Analisar com IA"
          >
            <Ionicons name="analytics-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowExportMenu(true)}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Exportar exame"
          >
            <Ionicons name="share-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowDeleteConfirm(true)}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Excluir exame"
          >
            <Ionicons name="trash-outline" size={20} color={colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exam Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.examInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.infoLabel}>Coletado em:</Text>
              <Text style={styles.infoValue}>
                {dateHelpers.formatDateTime(exam.collectedAt)}
              </Text>
            </View>

            {exam.lab && (
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.infoLabel}>Laboratório:</Text>
                <Text style={styles.infoValue}>{exam.lab}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Ionicons name="list-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.infoLabel}>Parâmetros:</Text>
              <Text style={styles.infoValue}>{exam.parameters.length} analisados</Text>
            </View>
          </View>

          {/* Status Summary */}
          <View style={styles.statusSummary}>
            <StatusIndicator status="normal" count={parameterStatus.normal} />
            <StatusIndicator status="borderline" count={parameterStatus.borderline} />
            <StatusIndicator status="abnormal" count={parameterStatus.abnormal} />
          </View>
        </Card>

        {/* Analysis Alert */}
        {latestAnalysis && latestAnalysis.analysisResult.alertLevel !== 'normal' && (
          <Card style={[styles.alertCard, { borderLeftColor: getAlertColor(latestAnalysis.analysisResult.alertLevel) }]}>
            <View style={styles.alertHeader}>
              <Ionicons
                name={latestAnalysis.analysisResult.alertLevel === 'urgent' ? 'warning' : 'information-circle'}
                size={20}
                color={getAlertColor(latestAnalysis.analysisResult.alertLevel)}
              />
              <Text style={styles.alertTitle}>
                {latestAnalysis.analysisResult.alertLevel === 'urgent' ? 'Atenção Necessária' : 'Observações'}
              </Text>
            </View>
            <Text style={styles.alertText}>
              {latestAnalysis.analysisResult.summary}
            </Text>
          </Card>
        )}

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setSelectedView('table')}
            style={[styles.toggleButton, selectedView === 'table' && styles.toggleButtonActive]}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={selectedView === 'table' ? colors.primary[500] : colors.text.secondary}
            />
            <Text style={[styles.toggleText, selectedView === 'table' && styles.toggleTextActive]}>
              Tabela
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedView('chart')}
            style={[styles.toggleButton, selectedView === 'chart' && styles.toggleButtonActive]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={18}
              color={selectedView === 'chart' ? colors.primary[500] : colors.text.secondary}
            />
            <Text style={[styles.toggleText, selectedView === 'chart' && styles.toggleTextActive]}>
              Gráfico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedView('trend')}
            style={[styles.toggleButton, selectedView === 'trend' && styles.toggleButtonActive]}
          >
            <Ionicons
              name="trending-up-outline"
              size={18}
              color={selectedView === 'trend' ? colors.primary[500] : colors.text.secondary}
            />
            <Text style={[styles.toggleText, selectedView === 'trend' && styles.toggleTextActive]}>
              Tendência
            </Text>
          </TouchableOpacity>
        </View>

        {/* Parameters Display */}
        <Card style={styles.parametersCard}>
          {selectedView === 'table' && (
            <ParameterList parameters={exam.parameters} />
          )}

          {selectedView === 'chart' && (
            <ParameterChart
              parameters={exam.parameters}
              title="Parâmetros do Exame"
              height={300}
            />
          )}

          {selectedView === 'trend' && (
            <TrendChart
              parameters={exam.parameters}
              title="Tendência dos Parâmetros"
              height={300}
            />
          )}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Analisar com IA"
            variant="primary"
            onPress={handleAnalyze}
            icon="analytics-outline"
            style={styles.actionButtonLarge}
          />

          <View style={styles.secondaryActions}>
            <Button
              title="Compartilhar"
              variant="outline"
              onPress={handleShare}
              icon="share-outline"
              style={styles.secondaryAction}
            />
            
            <Button
              title="Exportar"
              variant="outline"
              onPress={() => setShowExportMenu(true)}
              icon="download-outline"
              style={styles.secondaryAction}
            />
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Export Menu Modal */}
      <Modal
        visible={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        title="Exportar Exame"
      >
        <ExportMenu
          isLoading={isExporting}
          onExport={handleExport}
          onCancel={() => setShowExportMenu(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmar Exclusão"
      >
        <View style={styles.deleteConfirm}>
          <Ionicons name="warning" size={48} color={colors.error[500]} />
          <Text style={styles.deleteTitle}>Excluir Exame</Text>
          <Text style={styles.deleteText}>
            Esta ação não pode ser desfeita. Tem certeza que deseja excluir este exame?
          </Text>
          
          <View style={styles.deleteActions}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={() => setShowDeleteConfirm(false)}
              style={styles.deleteCancel}
            />
            <Button
              title="Excluir"
              variant="primary"
              onPress={handleDelete}
              style={[styles.deleteConfirmButton, { backgroundColor: colors.error[500] }]}
            />
          </View>
        </View>
      </Modal>
    </SafeContainer>
  );
};

const getAlertColor = (level: string) => {
  switch (level) {
    case 'urgent':
      return colors.health.danger;
    case 'attention':
      return colors.health.warning;
    default:
      return colors.health.info;
  }
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  infoCard: {
    margin: 16,
    marginBottom: 12,
  },
  examInfo: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 2,
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statusIndicator: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  statusCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text.inverse,
    fontWeight: '500',
  },
  alertCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    paddingLeft: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  alertText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary[50],
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  toggleTextActive: {
    color: colors.primary[500],
  },
  parametersCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actions: {
    marginHorizontal: 16,
    gap: 12,
  },
  actionButtonLarge: {
    paddingVertical: 16,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
  },
  deleteConfirm: {
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteCancel: {
    flex: 1,
  },
  deleteConfirmButton: {
    flex: 1,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ExamDetailScreen;