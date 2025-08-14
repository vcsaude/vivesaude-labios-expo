import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList } from '../../navigation/types';
import { useExamStore, ExamAnalysis } from '../../store/examStore';
import { Exam, ExamParameter } from '../../types/exam';
import { colors } from '../../theme/colors';

import SafeContainer from '../../components/layout/SafeContainer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import CropSelector from '../../components/exam/CropSelector';
import { dateHelpers } from '../../utils/dateHelpers';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<MainTabParamList, 'ExamAnalysis'>;

interface SymptomInput {
  id: string;
  text: string;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

const ExamAnalysisScreen: React.FC<Props> = ({ route, navigation }) => {
  const { examId } = route.params;
  const {
    getExamById,
    analyzeExam,
    getAnalyses,
    isLoading,
  } = useExamStore();

  const [exam, setExam] = useState<Exam | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([{ id: '1', text: '' }]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ExamAnalysis | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Load exam data
  useEffect(() => {
    loadExam();
    initializeAnalysisSteps();
  }, [examId]);

  const loadExam = async () => {
    try {
      const examData = await getExamById(examId);
      if (examData) {
        setExam(examData);
        
        // Select all parameters by default
        setSelectedParameters(examData.parameters.map(p => p.id));
        
        // Check for existing analyses
        const analyses = getAnalyses(examId);
        if (analyses.length > 0) {
          setCurrentAnalysis(analyses[0]);
          setShowResults(true);
        }
      } else {
        Alert.alert('Erro', 'Exame não encontrado');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar o exame');
      navigation.goBack();
    }
  };

  const initializeAnalysisSteps = () => {
    setAnalysisSteps([
      {
        id: '1',
        title: 'Processando Parâmetros',
        description: 'Analisando valores e referências dos parâmetros selecionados',
        completed: false,
        progress: 0,
      },
      {
        id: '2',
        title: 'Correlação com Sintomas',
        description: 'Correlacionando resultados laboratoriais com sintomas relatados',
        completed: false,
        progress: 0,
      },
      {
        id: '3',
        title: 'Análise por IA',
        description: 'Aplicando algoritmos de IA para análise médica avançada',
        completed: false,
        progress: 0,
      },
      {
        id: '4',
        title: 'Geração de Relatório',
        description: 'Compilando recomendações e insights médicos',
        completed: false,
        progress: 0,
      },
    ]);
  };

  const addSymptom = () => {
    const newId = (symptoms.length + 1).toString();
    setSymptoms([...symptoms, { id: newId, text: '' }]);
  };

  const removeSymptom = (id: string) => {
    if (symptoms.length > 1) {
      setSymptoms(symptoms.filter(s => s.id !== id));
    }
  };

  const updateSymptom = (id: string, text: string) => {
    setSymptoms(symptoms.map(s => s.id === id ? { ...s, text } : s));
  };

  const toggleParameter = (parameterId: string) => {
    setSelectedParameters(prev => 
      prev.includes(parameterId)
        ? prev.filter(id => id !== parameterId)
        : [...prev, parameterId]
    );
  };

  const simulateAnalysisProgress = async () => {
    const steps = [...analysisSteps];
    
    for (let i = 0; i < steps.length; i++) {
      // Update current step progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        setAnalysisSteps(prevSteps => 
          prevSteps.map((step, index) => 
            index === i 
              ? { ...step, progress }
              : step
          )
        );
        
        setAnalysisProgress(((i * 100 + progress) / (steps.length * 100)) * 100);
      }
      
      // Mark step as completed
      setAnalysisSteps(prevSteps => 
        prevSteps.map((step, index) => 
          index === i 
            ? { ...step, completed: true }
            : step
        )
      );
    }
  };

  const handleAnalyze = async () => {
    if (!exam) return;

    const validSymptoms = symptoms
      .filter(s => s.text.trim().length > 0)
      .map(s => s.text.trim());

    if (validSymptoms.length === 0) {
      Alert.alert('Atenção', 'Por favor, informe pelo menos um sintoma para análise');
      return;
    }

    if (selectedParameters.length === 0) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos um parâmetro para análise');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Start progress simulation
      simulateAnalysisProgress();

      // Perform actual analysis
      const analysis = await analyzeExam(exam.id, validSymptoms);
      
      setCurrentAnalysis(analysis);
      setShowResults(true);

      // Animation for results
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      Alert.alert('Erro', 'Falha na análise do exame. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setShowResults(false);
    setSymptoms([{ id: '1', text: '' }]);
    setAnalysisProgress(0);
    initializeAnalysisSteps();
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
  };

  const selectedParametersData = useMemo(() => {
    if (!exam) return [];
    return exam.parameters.filter(p => selectedParameters.includes(p.id));
  }, [exam, selectedParameters]);

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

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'urgent':
        return 'warning';
      case 'attention':
        return 'alert-circle-outline';
      default:
        return 'information-circle-outline';
    }
  };

  if (!exam) {
    return (
      <SafeContainer>
        <LoadingSpinner size="large" />
      </SafeContainer>
    );
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

        <Text style={styles.headerTitle}>Análise com IA</Text>

        {showResults && (
          <TouchableOpacity
            onPress={handleNewAnalysis}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Nova análise"
          >
            <Ionicons name="add-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exam Info */}
        <Card style={styles.examCard}>
          <View style={styles.examInfo}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary[500]} />
            <View style={styles.examDetails}>
              <Text style={styles.examTitle}>{exam.title}</Text>
              <Text style={styles.examDate}>
                {dateHelpers.formatDateTime(exam.collectedAt)}
              </Text>
            </View>
          </View>
        </Card>

        {!showResults ? (
          /* Analysis Configuration */
          <>
            {/* Symptoms Input */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="medical-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.sectionTitle}>Sintomas e Observações</Text>
              </View>
              
              <Text style={styles.sectionDescription}>
                Descreva os sintomas ou observações clínicas relevantes
              </Text>

              {symptoms.map((symptom, index) => (
                <View key={symptom.id} style={styles.symptomRow}>
                  <TextInput
                    style={styles.symptomInput}
                    placeholder={`Sintoma ${index + 1}`}
                    value={symptom.text}
                    onChangeText={(text) => updateSymptom(symptom.id, text)}
                    multiline
                    maxLength={200}
                    accessibilityLabel={`Campo de sintoma ${index + 1}`}
                  />
                  
                  {symptoms.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeSymptom(symptom.id)}
                      style={styles.removeButton}
                      accessibilityRole="button"
                      accessibilityLabel="Remover sintoma"
                    >
                      <Ionicons name="close-circle" size={20} color={colors.error[500]} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                onPress={addSymptom}
                style={styles.addSymptomButton}
                accessibilityRole="button"
                accessibilityLabel="Adicionar sintoma"
              >
                <Ionicons name="add-outline" size={16} color={colors.primary[500]} />
                <Text style={styles.addSymptomText}>Adicionar Sintoma</Text>
              </TouchableOpacity>
            </Card>

            {/* Parameter Selection */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="analytics-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.sectionTitle}>Parâmetros para Análise</Text>
              </View>
              
              <Text style={styles.sectionDescription}>
                Selecione os parâmetros que deseja incluir na análise
              </Text>

              <TouchableOpacity
                onPress={() => setShowCropSelector(true)}
                style={styles.cropButton}
                accessibilityRole="button"
                accessibilityLabel="Recortar parâmetros da imagem"
              >
                <Ionicons name="crop-outline" size={16} color={colors.primary[500]} />
                <Text style={styles.cropButtonText}>Recortar da Imagem</Text>
              </TouchableOpacity>

              <View style={styles.parametersList}>
                {exam.parameters.map((parameter) => (
                  <TouchableOpacity
                    key={parameter.id}
                    onPress={() => toggleParameter(parameter.id)}
                    style={[
                      styles.parameterItem,
                      selectedParameters.includes(parameter.id) && styles.parameterItemSelected
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selectedParameters.includes(parameter.id) }}
                  >
                    <View style={styles.parameterHeader}>
                      <Ionicons
                        name={selectedParameters.includes(parameter.id) ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={selectedParameters.includes(parameter.id) ? colors.primary[500] : colors.text.secondary}
                      />
                      <Text style={[
                        styles.parameterName,
                        selectedParameters.includes(parameter.id) && styles.parameterNameSelected
                      ]}>
                        {parameter.name}
                      </Text>
                    </View>
                    
                    <View style={styles.parameterValue}>
                      <Text style={styles.parameterValueText}>
                        {parameter.value} {parameter.unit}
                      </Text>
                      {parameter.referenceRange && (
                        <Text style={styles.parameterRange}>
                          Ref: {parameter.referenceRange}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Ionicons name="analytics" size={24} color={colors.primary[500]} />
                  <Text style={styles.progressTitle}>Analisando...</Text>
                </View>

                <ProgressBar 
                  progress={analysisProgress} 
                  style={styles.overallProgress}
                  color={colors.primary[500]}
                />

                <View style={styles.stepsContainer}>
                  {analysisSteps.map((step) => (
                    <View key={step.id} style={styles.stepItem}>
                      <View style={styles.stepHeader}>
                        <Ionicons
                          name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={16}
                          color={step.completed ? colors.health.success : colors.text.secondary}
                        />
                        <Text style={[
                          styles.stepTitle,
                          step.completed && styles.stepTitleCompleted
                        ]}>
                          {step.title}
                        </Text>
                      </View>
                      
                      <Text style={styles.stepDescription}>
                        {step.description}
                      </Text>

                      {!step.completed && step.progress > 0 && (
                        <ProgressBar 
                          progress={step.progress} 
                          style={styles.stepProgress}
                          color={colors.primary[300]}
                          height={2}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Analyze Button */}
            {!isAnalyzing && (
              <View style={styles.analyzeContainer}>
                <Button
                  title="Iniciar Análise"
                  variant="primary"
                  onPress={handleAnalyze}
                  icon="analytics-outline"
                  style={styles.analyzeButton}
                  disabled={isLoading}
                />
              </View>
            )}
          </>
        ) : (
          /* Analysis Results */
          <Animated.View 
            style={[
              styles.resultsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {currentAnalysis && (
              <>
                {/* Alert Level */}
                <Card style={[
                  styles.alertCard, 
                  { borderLeftColor: getAlertColor(currentAnalysis.analysisResult.alertLevel) }
                ]}>
                  <View style={styles.alertHeader}>
                    <Ionicons
                      name={getAlertIcon(currentAnalysis.analysisResult.alertLevel)}
                      size={24}
                      color={getAlertColor(currentAnalysis.analysisResult.alertLevel)}
                    />
                    <Text style={styles.alertTitle}>
                      {currentAnalysis.analysisResult.alertLevel === 'urgent' 
                        ? 'Atenção Necessária'
                        : currentAnalysis.analysisResult.alertLevel === 'attention'
                        ? 'Observações Importantes'
                        : 'Resultados Normais'
                      }
                    </Text>
                  </View>
                </Card>

                {/* Summary */}
                <Card style={styles.summaryCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="document-text-outline" size={20} color={colors.primary[500]} />
                    <Text style={styles.sectionTitle}>Resumo da Análise</Text>
                  </View>
                  
                  <Text style={styles.summaryText}>
                    {currentAnalysis.analysisResult.summary}
                  </Text>
                </Card>

                {/* Findings */}
                {currentAnalysis.analysisResult.findings.length > 0 && (
                  <Card style={styles.findingsCard}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="search-outline" size={20} color={colors.primary[500]} />
                      <Text style={styles.sectionTitle}>Achados Detalhados</Text>
                    </View>

                    {currentAnalysis.analysisResult.findings.map((finding, index) => (
                      <View key={index} style={styles.findingItem}>
                        <View style={styles.findingHeader}>
                          <Ionicons
                            name={finding.status === 'normal' ? 'checkmark-circle' : 'alert-circle'}
                            size={16}
                            color={finding.status === 'normal' ? colors.health.success : colors.health.warning}
                          />
                          <Text style={styles.findingParameter}>{finding.parameter}</Text>
                          <View style={[
                            styles.statusBadge,
                            { backgroundColor: finding.status === 'normal' ? colors.health.success : colors.health.warning }
                          ]}>
                            <Text style={styles.statusBadgeText}>
                              {finding.status === 'normal' ? 'Normal' : 'Alterado'}
                            </Text>
                          </View>
                        </View>
                        
                        <Text style={styles.findingObservation}>
                          {finding.observation}
                        </Text>
                      </View>
                    ))}
                  </Card>
                )}

                {/* Recommendations */}
                {currentAnalysis.analysisResult.recommendations.length > 0 && (
                  <Card style={styles.recommendationsCard}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="bulb-outline" size={20} color={colors.primary[500]} />
                      <Text style={styles.sectionTitle}>Recomendações</Text>
                    </View>

                    {currentAnalysis.analysisResult.recommendations.map((recommendation, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Ionicons name="arrow-forward" size={12} color={colors.primary[500]} />
                        <Text style={styles.recommendationText}>{recommendation}</Text>
                      </View>
                    ))}
                  </Card>
                )}

                {/* Actions */}
                <View style={styles.resultsActions}>
                  <Button
                    title="Nova Análise"
                    variant="outline"
                    onPress={handleNewAnalysis}
                    icon="refresh-outline"
                    style={styles.resultAction}
                  />
                  
                  <Button
                    title="Ver Detalhes"
                    variant="primary"
                    onPress={() => navigation.navigate('ExamDetail', { examId: exam.id })}
                    icon="eye-outline"
                    style={styles.resultAction}
                  />
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Crop Selector Modal */}
      <Modal
        visible={showCropSelector}
        onClose={() => setShowCropSelector(false)}
        title="Selecionar Parâmetros"
      >
        <CropSelector
          examImage={exam.imageUri}
          parameters={exam.parameters}
          selectedParameters={selectedParameters}
          onParametersSelected={setSelectedParameters}
          onClose={() => setShowCropSelector(false)}
        />
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
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  examCard: {
    margin: 16,
    marginBottom: 12,
  },
  examInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  examDetails: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  symptomInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  removeButton: {
    padding: 8,
  },
  addSymptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  addSymptomText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '500',
  },
  cropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    marginBottom: 16,
  },
  cropButtonText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '500',
  },
  parametersList: {
    gap: 8,
  },
  parameterItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
  },
  parameterItemSelected: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  parameterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  parameterName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  parameterNameSelected: {
    color: colors.primary[700],
  },
  parameterValue: {
    marginLeft: 28,
  },
  parameterValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  parameterRange: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  overallProgress: {
    marginBottom: 24,
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    gap: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  stepTitleCompleted: {
    color: colors.health.success,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginLeft: 24,
  },
  stepProgress: {
    marginLeft: 24,
    marginTop: 4,
  },
  analyzeContainer: {
    margin: 16,
  },
  analyzeButton: {
    paddingVertical: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  alertCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    paddingLeft: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 22,
  },
  findingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  findingItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  findingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  findingParameter: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  findingObservation: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginLeft: 24,
  },
  recommendationsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    flex: 1,
  },
  resultsActions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultAction: {
    flex: 1,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ExamAnalysisScreen;