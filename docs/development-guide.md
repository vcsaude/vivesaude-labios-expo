# 👨‍💻 **Guia de Desenvolvimento - ViveSaude Lábios**

## 🎯 **Filosofia de Desenvolvimento**

Este projeto segue princípios de **Clean Architecture**, **TypeScript-first**, e **Healthcare Compliance** para garantir qualidade, manutenibilidade e segurança dos dados médicos.

## 🏗️ **Arquitetura do Projeto**

### **Clean Architecture Layers**

```
┌─────────────────────────────────────┐
│           Presentation              │
│        (Screens/Components)         │
├─────────────────────────────────────┤
│            Application              │
│         (Stores/Services)           │
├─────────────────────────────────────┤
│             Domain                  │
│        (Types/Interfaces)           │
├─────────────────────────────────────┤
│           Infrastructure            │
│        (APIs/Storage/Utils)         │
└─────────────────────────────────────┘
```

### **Estrutura de Pastas Detalhada**

```
src/
├── components/
│   ├── ui/                 # Componentes base (Button, Input, etc)
│   ├── forms/              # Componentes de formulário
│   ├── charts/             # Gráficos e visualizações
│   └── layout/             # Layout components
├── screens/
│   ├── auth/               # Telas de autenticação
│   ├── upload/             # Upload e processamento
│   ├── results/            # Resultados de exames
│   ├── analysis/           # Análise com IA
│   └── profile/            # Perfil do usuário
├── navigation/
│   ├── AppNavigator.tsx    # Navegação principal
│   ├── AuthNavigator.tsx   # Navegação de auth
│   └── TabNavigator.tsx    # Navegação por tabs
├── services/
│   ├── api/                # Cliente HTTP e endpoints
│   ├── auth/               # Serviços de autenticação
│   ├── storage/            # Persistência local
│   ├── crypto/             # Criptografia
│   └── ai/                 # Integração com IA
├── stores/
│   ├── authStore.ts        # Estado de autenticação
│   ├── examStore.ts        # Estado de exames
│   ├── userStore.ts        # Estado do usuário
│   └── index.ts            # Store principal
├── types/
│   ├── api.ts              # Tipos de API
│   ├── domain.ts           # Entidades de domínio
│   └── navigation.ts       # Tipos de navegação
├── utils/
│   ├── validation.ts       # Validações
│   ├── formatting.ts       # Formatação
│   ├── constants.ts        # Constantes
│   └── helpers.ts          # Funções utilitárias
└── constants/
    ├── colors.ts           # Paleta de cores
    ├── fonts.ts            # Tipografia
    └── dimensions.ts       # Dimensões e espaçamentos
```

## 🎨 **Design System Implementation**

### **1. Tema e Cores**

```typescript
// src/constants/colors.ts
export const Colors = {
  // Brand Colors
  primary: '#0066CC',
  primaryDark: '#004499',
  primaryLight: '#3384D6',
  
  // Neutral Colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1a1a2e',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  
  // Semantic Colors
  success: '#10B981',    // Resultados normais
  warning: '#F59E0B',    // Atenção necessária
  error: '#EF4444',      // Valores críticos
  info: '#3B82F6',       // Informações
  
  // Medical Specific
  healthy: '#10B981',
  atRisk: '#F59E0B',
  critical: '#EF4444',
  unknown: '#6B7280',
} as const;
```

### **2. Tipografia**

```typescript
// src/constants/fonts.ts
export const Fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  families: {
    regular: 'SF Pro Display',
    monospace: 'SF Mono',
  },
} as const;
```

### **3. Componentes Base**

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  loading,
  disabled,
  onPress,
  children,
}) => {
  // Implementation with proper styling and accessibility
};
```

## 🔐 **Padrões de Segurança**

### **1. Autenticação Biométrica**

```typescript
// src/services/auth/biometricAuth.ts
import * as LocalAuthentication from 'expo-local-authentication';

export class BiometricAuthService {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  async authenticate(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Acesse seus exames médicos',
        subPrompt: 'Use sua biometria para acessar com segurança',
        fallbackLabel: 'Usar senha',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  }
}
```

### **2. Criptografia de Dados**

```typescript
// src/services/crypto/encryption.ts
import * as Crypto from 'expo-crypto';

export class EncryptionService {
  private readonly algorithm = 'AES-256-GCM';
  
  async encryptSensitiveData(data: string, key: string): Promise<string> {
    // Implementar criptografia AES-256
    const encrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data + key
    );
    return encrypted;
  }

  async decryptSensitiveData(encryptedData: string, key: string): Promise<string> {
    // Implementar descriptografia
    // HIPAA/LGPD compliant implementation
  }
}
```

### **3. Armazenamento Seguro**

```typescript
// src/services/storage/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export class SecureStorageService {
  async storeSecurely(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value, {
      requireAuthentication: true,
      authenticationPrompt: 'Authenticate to access medical data',
    });
  }

  async getSecurely(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key, {
      requireAuthentication: true,
      authenticationPrompt: 'Authenticate to access medical data',
    });
  }
}
```

## 📊 **Gerenciamento de Estado**

### **1. Zustand Store Setup**

```typescript
// src/stores/examStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ExamState {
  exams: Exam[];
  selectedExam: Exam | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  addExam: (exam: Exam) => void;
  selectExam: (examId: string) => void;
  updateExam: (examId: string, updates: Partial<Exam>) => void;
  deleteExam: (examId: string) => void;
  clearError: () => void;
}

export const useExamStore = create<ExamState>()(
  devtools(
    persist(
      (set, get) => ({
        exams: [],
        selectedExam: null,
        loading: false,
        error: null,

        addExam: (exam) => set((state) => ({
          exams: [...state.exams, exam],
        })),

        selectExam: (examId) => set((state) => ({
          selectedExam: state.exams.find(e => e.id === examId) || null,
        })),

        updateExam: (examId, updates) => set((state) => ({
          exams: state.exams.map(exam =>
            exam.id === examId ? { ...exam, ...updates } : exam
          ),
        })),

        deleteExam: (examId) => set((state) => ({
          exams: state.exams.filter(exam => exam.id !== examId),
          selectedExam: state.selectedExam?.id === examId ? null : state.selectedExam,
        })),

        clearError: () => set({ error: null }),
      }),
      {
        name: 'exam-storage',
        partialize: (state) => ({ exams: state.exams }), // Only persist exams
      }
    )
  )
);
```

### **2. React Query Integration**

```typescript
// src/services/api/examQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useExams = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: examApi.getExams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUploadExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examApi.uploadExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};
```

## 🔄 **Padrões de Navegação**

### **1. Type-Safe Navigation**

```typescript
// src/types/navigation.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ExamDetail: { examId: string };
  AnalysisDetail: { analysisId: string };
};

export type MainTabParamList = {
  Upload: undefined;
  Results: undefined;
  Analysis: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### **2. Navigation Service**

```typescript
// src/navigation/NavigationService.ts
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
```

## 📱 **Healthcare-Specific Patterns**

### **1. PDF Processing**

```typescript
// src/services/pdf/pdfProcessor.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export class PDFProcessorService {
  async selectPDFDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    return await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });
  }

  async processPDFForOCR(fileUri: string): Promise<ProcessedPDF> {
    // 1. Validate PDF
    const isValid = await this.validatePDF(fileUri);
    if (!isValid) throw new Error('Invalid PDF file');

    // 2. Extract text using OCR
    const extractedText = await this.extractText(fileUri);

    // 3. Parse medical data
    const medicalData = await this.parseMedicalData(extractedText);

    return {
      originalFile: fileUri,
      extractedText,
      medicalData,
      processedAt: new Date(),
    };
  }

  private async validatePDF(fileUri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      return fileInfo.exists && fileInfo.size > 0;
    } catch {
      return false;
    }
  }
}
```

### **2. Medical Data Validation**

```typescript
// src/utils/validation.ts
export const medicalValidation = {
  bloodGlucose: (value: number): ValidationResult => {
    if (value < 70) return { isValid: false, level: 'critical', message: 'Hipoglicemia severa' };
    if (value < 100) return { isValid: true, level: 'normal', message: 'Normal' };
    if (value < 126) return { isValid: true, level: 'warning', message: 'Pré-diabetes' };
    return { isValid: false, level: 'critical', message: 'Diabetes' };
  },

  cholesterol: (value: number): ValidationResult => {
    if (value < 200) return { isValid: true, level: 'normal', message: 'Desejável' };
    if (value < 240) return { isValid: true, level: 'warning', message: 'Limítrofe' };
    return { isValid: false, level: 'critical', message: 'Alto' };
  },
};

interface ValidationResult {
  isValid: boolean;
  level: 'normal' | 'warning' | 'critical';
  message: string;
}
```

## 🧪 **Testing Patterns**

### **1. Component Testing**

```typescript
// src/components/__tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button variant="primary" size="md" onPress={jest.fn()}>
        Test Button
      </Button>
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button variant="primary" size="md" onPress={mockOnPress}>
        Test Button
      </Button>
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

### **2. Store Testing**

```typescript
// src/stores/__tests__/examStore.test.ts
import { useExamStore } from '../examStore';

describe('examStore', () => {
  beforeEach(() => {
    useExamStore.getState().clearError();
  });

  it('should add exam correctly', () => {
    const mockExam = { id: '1', name: 'Test Exam' };
    useExamStore.getState().addExam(mockExam);
    
    const state = useExamStore.getState();
    expect(state.exams).toContain(mockExam);
  });
});
```

## 🚀 **Performance Optimization**

### **1. Lazy Loading**

```typescript
// src/navigation/AppNavigator.tsx
import React, { Suspense } from 'react';

const UploadScreen = React.lazy(() => import('../screens/upload/UploadScreen'));
const ResultsScreen = React.lazy(() => import('../screens/results/ResultsScreen'));

export const AppNavigator = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Stack.Navigator>
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};
```

### **2. Memoization**

```typescript
// src/components/ExamCard.tsx
import React, { memo, useMemo } from 'react';

interface ExamCardProps {
  exam: Exam;
  onPress: (examId: string) => void;
}

export const ExamCard = memo<ExamCardProps>(({ exam, onPress }) => {
  const formattedDate = useMemo(() => {
    return new Date(exam.date).toLocaleDateString('pt-BR');
  }, [exam.date]);

  const statusColor = useMemo(() => {
    return getStatusColor(exam.status);
  }, [exam.status]);

  return (
    <TouchableOpacity onPress={() => onPress(exam.id)}>
      {/* Component content */}
    </TouchableOpacity>
  );
});
```

## 📋 **Code Quality Standards**

### **1. ESLint Configuration**

```json
// .eslintrc.js
module.exports = {
  extends: [
    'expo',
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'error',
    'react-native/no-unused-styles': 'error',
  },
};
```

### **2. Prettier Configuration**

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### **3. Git Hooks**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 🔍 **Debugging e Logging**

### **1. Development Logging**

```typescript
// src/utils/logger.ts
class Logger {
  private isDev = __DEV__;

  info(message: string, data?: any): void {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, data);
    }
  }

  error(message: string, error?: Error): void {
    if (this.isDev) {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, send to crash reporting service
  }

  medical(action: string, patientData?: any): void {
    // HIPAA-compliant logging for medical actions
    console.log(`[MEDICAL] ${action}`, {
      timestamp: new Date().toISOString(),
      // Never log sensitive patient data
    });
  }
}

export const logger = new Logger();
```

---

**Este guia fornece as bases para um desenvolvimento consistente e seguro do aplicativo ViveSaude Lábios. Sempre priorize a segurança dos dados médicos e siga as práticas de compliance estabelecidas.**