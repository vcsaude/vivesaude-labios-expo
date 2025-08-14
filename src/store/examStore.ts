import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exam, ExamParameter } from '../types/exam';

export interface ExamAnalysis {
  id: string;
  examId: string;
  symptoms: string[];
  analysisResult: {
    summary: string;
    recommendations: string[];
    alertLevel: 'normal' | 'attention' | 'urgent';
    findings: Array<{
      parameter: string;
      status: 'normal' | 'altered';
      observation: string;
    }>;
  };
  createdAt: string;
}

export interface ExamUpload {
  id: string;
  name: string;
  uri: string;
  size?: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  uploadedAt: string;
  processedAt?: string;
  examId?: string;
  error?: string;
}

interface ExamState {
  // State
  exams: Exam[];
  currentExam: Exam | null;
  uploads: ExamUpload[];
  analyses: ExamAnalysis[];
  isLoading: boolean;
  uploadProgress: Record<string, number>;
  
  // Actions
  fetchExams: () => Promise<void>;
  getExamById: (id: string) => Promise<Exam | null>;
  uploadExam: (file: { uri: string; name: string; size?: number }) => Promise<string>;
  deleteExam: (id: string) => Promise<void>;
  
  // Analysis actions
  analyzeExam: (examId: string, symptoms: string[]) => Promise<ExamAnalysis>;
  getAnalyses: (examId: string) => ExamAnalysis[];
  
  // Current exam actions
  setCurrentExam: (exam: Exam | null) => void;
  updateExamParameters: (examId: string, parameters: ExamParameter[]) => Promise<void>;
  
  // Upload management
  updateUploadProgress: (uploadId: string, progress: number) => void;
  updateUploadStatus: (uploadId: string, status: ExamUpload['status'], error?: string) => void;
  clearCompletedUploads: () => void;
  
  // Export actions
  exportExam: (examId: string, format: 'csv' | 'pdf' | 'json') => Promise<string>;
  shareExam: (examId: string) => Promise<void>;
  
  // Statistics
  getStats: () => {
    totalExams: number;
    recentExams: number;
    lastUpload: string | null;
    alertsCount: number;
  };
}

// Mock API functions
const examApi = {
  getExams: async (): Promise<Exam[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return [
      {
        id: '1',
        title: 'Hemograma Completo',
        collectedAt: '2024-01-15T09:00:00Z',
        lab: 'Laboratório Central',
        parameters: [
          {
            id: '1',
            name: 'Hemácias',
            value: '4.5',
            unit: 'milhões/¼L',
            referenceRange: '4.0 - 5.2',
          },
          {
            id: '2',
            name: 'Hemoglobina',
            value: '13.2',
            unit: 'g/dL',
            referenceRange: '12.0 - 15.5',
          },
          {
            id: '3',
            name: 'Hematócrito',
            value: '39.5',
            unit: '%',
            referenceRange: '36.0 - 45.0',
          },
        ],
      },
      {
        id: '2',
        title: 'Perfil Lipídico',
        collectedAt: '2024-01-10T08:30:00Z',
        lab: 'Lab Express',
        parameters: [
          {
            id: '4',
            name: 'Colesterol Total',
            value: '195',
            unit: 'mg/dL',
            referenceRange: '< 200',
          },
          {
            id: '5',
            name: 'HDL',
            value: '65',
            unit: 'mg/dL',
            referenceRange: '> 40',
          },
          {
            id: '6',
            name: 'LDL',
            value: '115',
            unit: 'mg/dL',
            referenceRange: '< 130',
          },
        ],
      },
    ];
  },
  
  getExamById: async (id: string): Promise<Exam | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const exams = await examApi.getExams();
    return exams.find(exam => exam.id === id) || null;
  },
  
  uploadExam: async (file: { uri: string; name: string; size?: number }): Promise<string> => {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return new exam ID
    return `exam_${Date.now()}`;
  },
  
  analyzeExam: async (examId: string, symptoms: string[]): Promise<ExamAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI analysis
    return {
      id: `analysis_${Date.now()}`,
      examId,
      symptoms,
      analysisResult: {
        summary: 'Os resultados mostram valores dentro da normalidade para a maioria dos parâmetros analisados.',
        recommendations: [
          'Manter dieta equilibrada',
          'Praticar exercícios regularmente',
          'Acompanhar evolução dos valores em próximos exames',
        ],
        alertLevel: 'normal',
        findings: [
          {
            parameter: 'Hemoglobina',
            status: 'normal',
            observation: 'Valor dentro da faixa de referência esperada',
          },
        ],
      },
      createdAt: new Date().toISOString(),
    };
  },
  
  exportExam: async (examId: string, format: 'csv' | 'pdf' | 'json'): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock file path
    return `file://path/to/exam_${examId}.${format}`;
  },
};

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      exams: [],
      currentExam: null,
      uploads: [],
      analyses: [],
      isLoading: false,
      uploadProgress: {},

      // Fetch exams
      fetchExams: async () => {
        set({ isLoading: true });
        
        try {
          const exams = await examApi.getExams();
          set({ exams, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Get exam by ID
      getExamById: async (id: string) => {
        const { exams } = get();
        
        // Check if exam is already in store
        const existingExam = exams.find(exam => exam.id === id);
        if (existingExam) {
          return existingExam;
        }
        
        try {
          const exam = await examApi.getExamById(id);
          
          if (exam) {
            // Add to store
            set(state => ({
              exams: [...state.exams.filter(e => e.id !== id), exam],
            }));
          }
          
          return exam;
        } catch (error) {
          throw error;
        }
      },

      // Upload exam
      uploadExam: async (file: { uri: string; name: string; size?: number }) => {
        const uploadId = `upload_${Date.now()}`;
        
        // Create upload record
        const upload: ExamUpload = {
          id: uploadId,
          name: file.name,
          uri: file.uri,
          size: file.size,
          status: 'uploading',
          progress: 0,
          uploadedAt: new Date().toISOString(),
        };
        
        set(state => ({
          uploads: [upload, ...state.uploads],
          uploadProgress: { ...state.uploadProgress, [uploadId]: 0 },
        }));
        
        try {
          // Simulate progress updates
          const updateProgress = (progress: number) => {
            set(state => ({
              uploadProgress: { ...state.uploadProgress, [uploadId]: progress },
            }));
          };
          
          // Simulate upload progress
          for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            updateProgress(i);
          }
          
          const examId = await examApi.uploadExam(file);
          
          // Update upload status
          set(state => ({
            uploads: state.uploads.map(u =>
              u.id === uploadId
                ? {
                    ...u,
                    status: 'completed',
                    progress: 100,
                    processedAt: new Date().toISOString(),
                    examId,
                  }
                : u
            ),
          }));
          
          // Refresh exams list
          await get().fetchExams();
          
          return examId;
        } catch (error) {
          // Update upload status to failed
          set(state => ({
            uploads: state.uploads.map(u =>
              u.id === uploadId
                ? {
                    ...u,
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Erro no upload',
                  }
                : u
            ),
          }));
          
          throw error;
        }
      },

      // Delete exam
      deleteExam: async (id: string) => {
        try {
          // Remove from API (mock)
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            exams: state.exams.filter(exam => exam.id !== id),
            analyses: state.analyses.filter(analysis => analysis.examId !== id),
            currentExam: state.currentExam?.id === id ? null : state.currentExam,
          }));
        } catch (error) {
          throw error;
        }
      },

      // Analyze exam
      analyzeExam: async (examId: string, symptoms: string[]) => {
        try {
          const analysis = await examApi.analyzeExam(examId, symptoms);
          
          set(state => ({
            analyses: [analysis, ...state.analyses],
          }));
          
          return analysis;
        } catch (error) {
          throw error;
        }
      },

      // Get analyses for exam
      getAnalyses: (examId: string) => {
        return get().analyses.filter(analysis => analysis.examId === examId);
      },

      // Set current exam
      setCurrentExam: (exam: Exam | null) => {
        set({ currentExam: exam });
      },

      // Update exam parameters
      updateExamParameters: async (examId: string, parameters: ExamParameter[]) => {
        try {
          // Update in API (mock)
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            exams: state.exams.map(exam =>
              exam.id === examId ? { ...exam, parameters } : exam
            ),
            currentExam: state.currentExam?.id === examId
              ? { ...state.currentExam, parameters }
              : state.currentExam,
          }));
        } catch (error) {
          throw error;
        }
      },

      // Update upload progress
      updateUploadProgress: (uploadId: string, progress: number) => {
        set(state => ({
          uploadProgress: { ...state.uploadProgress, [uploadId]: progress },
          uploads: state.uploads.map(u =>
            u.id === uploadId ? { ...u, progress } : u
          ),
        }));
      },

      // Update upload status
      updateUploadStatus: (uploadId: string, status: ExamUpload['status'], error?: string) => {
        set(state => ({
          uploads: state.uploads.map(u =>
            u.id === uploadId ? { ...u, status, error } : u
          ),
        }));
      },

      // Clear completed uploads
      clearCompletedUploads: () => {
        set(state => ({
          uploads: state.uploads.filter(u => u.status !== 'completed'),
          uploadProgress: Object.fromEntries(
            Object.entries(state.uploadProgress).filter(
              ([id]) => !state.uploads.find(u => u.id === id && u.status === 'completed')
            )
          ),
        }));
      },

      // Export exam
      exportExam: async (examId: string, format: 'csv' | 'pdf' | 'json') => {
        try {
          const filePath = await examApi.exportExam(examId, format);
          return filePath;
        } catch (error) {
          throw error;
        }
      },

      // Share exam
      shareExam: async (examId: string) => {
        try {
          // Generate shareable format and use sharing API
          const filePath = await get().exportExam(examId, 'pdf');
          
          // Mock sharing
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('Sharing exam:', filePath);
        } catch (error) {
          throw error;
        }
      },

      // Get statistics
      getStats: () => {
        const { exams, analyses } = get();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentExams = exams.filter(
          exam => new Date(exam.collectedAt) > oneWeekAgo
        ).length;
        
        const lastUpload = exams.length > 0
          ? exams
              .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())[0]
              .collectedAt
          : null;
        
        const alertsCount = analyses.filter(
          analysis => analysis.analysisResult.alertLevel !== 'normal'
        ).length;
        
        return {
          totalExams: exams.length,
          recentExams,
          lastUpload,
          alertsCount,
        };
      },
    }),
    {
      name: 'vivesaude-exams',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        exams: state.exams,
        analyses: state.analyses,
        // Don't persist uploads and current exam
      }),
    }
  )
);