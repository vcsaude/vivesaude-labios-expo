import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList } from '../../navigation/types';
import { useExamStore } from '../../store/examStore';
import { Exam } from '../../types/exam';
import { colors } from '../../theme/colors';

import SafeContainer from '../../components/layout/SafeContainer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ExamCard from '../../components/exam/ExamCard';
import { dateHelpers } from '../../utils/dateHelpers';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<MainTabParamList, 'History'>;

interface FilterOptions {
  searchQuery: string;
  dateRange: 'all' | 'week' | 'month' | '3months' | 'year';
  sortBy: 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc';
  labFilter: string;
  statusFilter: 'all' | 'normal' | 'attention' | 'urgent';
}

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const {
    exams,
    fetchExams,
    deleteExam,
    getAnalyses,
    getStats,
    isLoading,
  } = useExamStore();

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    dateRange: 'all',
    sortBy: 'date_desc',
    labFilter: 'all',
    statusFilter: 'all',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      await fetchExams();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar histórico de exames');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchExams();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar histórico');
    } finally {
      setRefreshing(false);
    }
  };

  // Get unique labs for filter
  const availableLabs = useMemo(() => {
    const labs = exams
      .filter(exam => exam.lab)
      .map(exam => exam.lab!)
      .filter((lab, index, array) => array.indexOf(lab) === index)
      .sort();
    return ['all', ...labs];
  }, [exams]);

  // Filter and sort exams
  const filteredExams = useMemo(() => {
    let filtered = [...exams];

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(query) ||
        exam.lab?.toLowerCase().includes(query) ||
        exam.parameters.some(param => 
          param.name.toLowerCase().includes(query)
        )
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(exam => 
        new Date(exam.collectedAt) >= startDate
      );
    }

    // Lab filter
    if (filters.labFilter !== 'all') {
      filtered = filtered.filter(exam => exam.lab === filters.labFilter);
    }

    // Status filter (based on analyses)
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(exam => {
        const analyses = getAnalyses(exam.id);
        if (analyses.length === 0) return filters.statusFilter === 'normal';
        
        const latestAnalysis = analyses[0];
        return latestAnalysis.analysisResult.alertLevel === filters.statusFilter ||
               (filters.statusFilter === 'normal' && latestAnalysis.analysisResult.alertLevel === 'normal');
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_asc':
          return new Date(a.collectedAt).getTime() - new Date(b.collectedAt).getTime();
        case 'date_desc':
          return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
      }
    });

    return filtered;
  }, [exams, filters, getAnalyses]);

  // Statistics
  const stats = useMemo(() => {
    const baseStats = getStats();
    const filtered = filteredExams;
    
    return {
      ...baseStats,
      filteredCount: filtered.length,
      showingAll: filtered.length === exams.length,
    };
  }, [exams, filteredExams, getStats]);

  const handleExamSelect = (examId: string) => {
    setSelectedExams(prev => 
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleBulkDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir ${selectedExams.length} exame(s) selecionado(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(selectedExams.map(id => deleteExam(id)));
              setSelectedExams([]);
              setShowBulkActions(false);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir alguns exames');
            }
          }
        }
      ]
    );
  };

  const clearSelection = () => {
    setSelectedExams([]);
    setShowBulkActions(false);
  };

  const toggleSelectAll = () => {
    if (selectedExams.length === filteredExams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(filteredExams.map(exam => exam.id));
    }
  };

  const renderExamItem = ({ item }: { item: Exam }) => {
    const isSelected = selectedExams.includes(item.id);
    const analyses = getAnalyses(item.id);
    
    return (
      <ExamCard
        exam={item}
        analyses={analyses}
        onPress={() => navigation.navigate('ExamDetail', { examId: item.id })}
        onLongPress={() => {
          setShowBulkActions(true);
          handleExamSelect(item.id);
        }}
        isSelected={isSelected}
        onSelect={showBulkActions ? () => handleExamSelect(item.id) : undefined}
        viewMode={viewMode}
        style={styles.examItem}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>
        {filters.searchQuery || filters.dateRange !== 'all' || filters.labFilter !== 'all' || filters.statusFilter !== 'all'
          ? 'Nenhum exame encontrado'
          : 'Nenhum exame no histórico'
        }
      </Text>
      <Text style={styles.emptyDescription}>
        {filters.searchQuery || filters.dateRange !== 'all' || filters.labFilter !== 'all' || filters.statusFilter !== 'all'
          ? 'Tente ajustar os filtros de busca'
          : 'Adicione seu primeiro exame para começar'
        }
      </Text>
      
      {(!filters.searchQuery && filters.dateRange === 'all' && filters.labFilter === 'all' && filters.statusFilter === 'all') && (
        <Button
          title="Adicionar Exame"
          variant="primary"
          onPress={() => navigation.navigate('Upload')}
          icon="add-outline"
          style={styles.emptyAction}
        />
      )}
    </View>
  );

  return (
    <SafeContainer>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>
            {stats.filteredCount} {stats.filteredCount === 1 ? 'exame' : 'exames'}
            {!stats.showingAll && ` de ${stats.totalExams}`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`Alternar para visualização em ${viewMode === 'list' ? 'grade' : 'lista'}`}
          >
            <Ionicons 
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} 
              size={20} 
              color={colors.primary[500]} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={[
              styles.actionButton,
              (filters.searchQuery || filters.dateRange !== 'all' || filters.labFilter !== 'all' || filters.statusFilter !== 'all') &&
              styles.actionButtonActive
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filtros"
          >
            <Ionicons name="filter-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <View style={styles.bulkActionsBar}>
          <View style={styles.bulkActionsLeft}>
            <TouchableOpacity
              onPress={clearSelection}
              style={styles.bulkActionButton}
              accessibilityRole="button"
              accessibilityLabel="Cancelar seleção"
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            
            <Text style={styles.bulkActionsText}>
              {selectedExams.length} selecionado(s)
            </Text>
          </View>

          <View style={styles.bulkActionsRight}>
            <TouchableOpacity
              onPress={toggleSelectAll}
              style={styles.bulkActionButton}
              accessibilityRole="button"
              accessibilityLabel="Selecionar todos"
            >
              <Ionicons 
                name={selectedExams.length === filteredExams.length ? 'checkbox' : 'square-outline'} 
                size={20} 
                color={colors.primary[500]} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBulkDelete}
              style={styles.bulkActionButton}
              accessibilityRole="button"
              accessibilityLabel="Excluir selecionados"
              disabled={selectedExams.length === 0}
            >
              <Ionicons 
                name="trash-outline" 
                size={20} 
                color={selectedExams.length > 0 ? colors.error[500] : colors.text.tertiary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      <FlatList
        data={filteredExams}
        keyExtractor={(item) => item.id}
        renderItem={renderExamItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredExams.length === 0 && styles.listContentEmpty
        ]}
        showsVerticalScrollIndicator={false}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
      >
        <ScrollView style={styles.filtersContent} showsVerticalScrollIndicator={false}>
          {/* Search */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Buscar</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Nome do exame, laboratório ou parâmetro"
              value={filters.searchQuery}
              onChangeText={(text) => setFilters(prev => ({ ...prev, searchQuery: text }))}
              accessibilityLabel="Campo de busca"
            />
          </View>

          {/* Date Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Período</Text>
            <View style={styles.filterOptions}>
              {[
                { value: 'all', label: 'Todos' },
                { value: 'week', label: 'Última semana' },
                { value: 'month', label: 'Último mês' },
                { value: '3months', label: 'Últimos 3 meses' },
                { value: 'year', label: 'Último ano' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFilters(prev => ({ ...prev, dateRange: option.value as any }))}
                  style={[
                    styles.filterOption,
                    filters.dateRange === option.value && styles.filterOptionSelected
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: filters.dateRange === option.value }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.dateRange === option.value && styles.filterOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lab Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Laboratório</Text>
            <View style={styles.filterOptions}>
              {availableLabs.map((lab) => (
                <TouchableOpacity
                  key={lab}
                  onPress={() => setFilters(prev => ({ ...prev, labFilter: lab }))}
                  style={[
                    styles.filterOption,
                    filters.labFilter === lab && styles.filterOptionSelected
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: filters.labFilter === lab }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.labFilter === lab && styles.filterOptionTextSelected
                  ]}>
                    {lab === 'all' ? 'Todos' : lab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {[
                { value: 'all', label: 'Todos', icon: 'ellipse-outline' },
                { value: 'normal', label: 'Normal', icon: 'checkmark-circle' },
                { value: 'attention', label: 'Atenção', icon: 'alert-circle' },
                { value: 'urgent', label: 'Urgente', icon: 'warning' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFilters(prev => ({ ...prev, statusFilter: option.value as any }))}
                  style={[
                    styles.filterOption,
                    filters.statusFilter === option.value && styles.filterOptionSelected
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: filters.statusFilter === option.value }}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={16}
                    color={filters.statusFilter === option.value ? colors.primary[500] : colors.text.secondary}
                  />
                  <Text style={[
                    styles.filterOptionText,
                    filters.statusFilter === option.value && styles.filterOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Ordenar por</Text>
            <View style={styles.filterOptions}>
              {[
                { value: 'date_desc', label: 'Data (mais recente)' },
                { value: 'date_asc', label: 'Data (mais antigo)' },
                { value: 'title_asc', label: 'Nome (A-Z)' },
                { value: 'title_desc', label: 'Nome (Z-A)' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                  style={[
                    styles.filterOption,
                    filters.sortBy === option.value && styles.filterOptionSelected
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: filters.sortBy === option.value }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.sortBy === option.value && styles.filterOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Filters */}
          <View style={styles.filterActions}>
            <Button
              title="Limpar Filtros"
              variant="outline"
              onPress={() => setFilters({
                searchQuery: '',
                dateRange: 'all',
                sortBy: 'date_desc',
                labFilter: 'all',
                statusFilter: 'all',
              })}
              style={styles.clearButton}
            />
            
            <Button
              title="Aplicar"
              variant="primary"
              onPress={() => setShowFilters(false)}
              style={styles.applyButton}
            />
          </View>
        </ScrollView>
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
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
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
  actionButtonActive: {
    backgroundColor: colors.primary[100],
  },
  bulkActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[200],
  },
  bulkActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulkActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bulkActionButton: {
    padding: 4,
  },
  bulkActionsText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
  },
  examItem: {
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyAction: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  filtersContent: {
    maxHeight: 500,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.primary,
    gap: 8,
  },
  filterOptionSelected: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  filterOptionTextSelected: {
    color: colors.primary[700],
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});

export default HistoryScreen;