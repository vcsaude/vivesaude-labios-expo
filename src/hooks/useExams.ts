import { useExamStore } from '../store/examStore';
import { useToast } from '../components/ui/Toast';

export function useExams() {
  const store = useExamStore();
  const { showError, showSuccess } = useToast();

  const uploadExamFile = async (file: { uri: string; name: string; size?: number }) => {
    try {
      const examId = await store.uploadExam(file);
      showSuccess('Exame enviado com sucesso!');
      return examId;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao enviar exame');
      throw error;
    }
  };

  const analyzeExamWithSymptoms = async (examId: string, symptoms: string[]) => {
    try {
      const analysis = await store.analyzeExam(examId, symptoms);
      showSuccess('Análise concluída!');
      return analysis;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro na análise');
      throw error;
    }
  };

  const deleteExamById = async (id: string) => {
    try {
      await store.deleteExam(id);
      showSuccess('Exame excluído com sucesso');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao excluir exame');
      throw error;
    }
  };

  const exportExamData = async (examId: string, format: 'csv' | 'pdf' | 'json') => {
    try {
      const filePath = await store.exportExam(examId, format);
      showSuccess(`Exame exportado como ${format.toUpperCase()}`);
      return filePath;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao exportar exame');
      throw error;
    }
  };

  return {
    // State
    exams: store.exams,
    currentExam: store.currentExam,
    uploads: store.uploads,
    analyses: store.analyses,
    isLoading: store.isLoading,
    uploadProgress: store.uploadProgress,
    
    // Actions with toast feedback
    uploadExam: uploadExamFile,
    analyzeExam: analyzeExamWithSymptoms,
    deleteExam: deleteExamById,
    exportExam: exportExamData,
    
    // Direct store actions
    fetchExams: store.fetchExams,
    getExamById: store.getExamById,
    getAnalyses: store.getAnalyses,
    setCurrentExam: store.setCurrentExam,
    updateExamParameters: store.updateExamParameters,
    updateUploadProgress: store.updateUploadProgress,
    updateUploadStatus: store.updateUploadStatus,
    clearCompletedUploads: store.clearCompletedUploads,
    shareExam: store.shareExam,
    getStats: store.getStats,
  };
}