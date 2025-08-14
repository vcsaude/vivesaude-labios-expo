☒ Implementar sistema de cores da identidade visual (#0066CC, #1a1a2e, #FFFFFF) em Assets.xcassets
     ☒ Configurar tipografia SF Pro Display/Text e SF Symbols 4.0 no projeto
     ☒ Criar estrutura de Models do Core Data para exames, resultados e sistema de moedas
     ☒ Implementar ViewModels base seguindo padrão MVVM + Combine para gerenciamento de estado
     ☒ Criar ContentView principal com TabView inferior (Upload, Resultados, Análise, Perfil)
     ☒ Implementar tela de Onboarding com 3 slides e navegação swipe horizontal
     ☒ Criar SplashScreen com animação do logotipo e transição fade de 1.5 segundos
     ☒ Implementar tela de Upload com sheet modal para câmera, galeria e arquivos
     ☒ Implementar ProgressView circular para processamento OCR com feedback háptico
     ☒ Criar tela de Resultados com NavigationStack e lista agrupada por data
     ☒ Implementar autenticação biométrica (Face ID/Touch ID) para segurança
     ☒ Configurar CI/CD pipeline para builds automatizados e distribuição TestFlight
     ☒ Migrar projeto SwiftUI para Expo React Native
     ☒ Configurar EAS Build para builds iOS na nuvem
     ☒ Implementar design system ViveSaude em React Native
     ☒ Criar documentação completa do projeto (README, setup, comandos)
     ☒ Organizar estrutura de pastas e arquitetura Clean Architecture
     ☒ Preparar repositório para deploy no GitHub
     ☒ Configurar CI/CD pipeline enterprise com segurança e compliance
     ☒ Criar templates de Issues e Pull Requests profissionais
     ☒ Implementar variáveis de ambiente completas e segurança
     ☒ Criar documentação de segurança e políticas de compliance
     ☒ Configurar package.json profissional com scripts completos
     ☐ Implementar cards expandíveis para exames com tabela editável de parâmetros
     ☐ Criar componente de preview de PDF com opções de recorte e ajuste
     ☐ Criar funcionalidade de exportação de resultados em CSV/PDF
     ☐ Implementar tela de Análise com seletor de profundidade e cards visuais para cada tier
     ☐ Criar sistema de moedas com badge, sheet de compras e integração StoreKit 2
     ☐ Implementar tela de Perfil com configurações, histórico de transações e opções de privacidade
     ☐ Configurar Core Data models para persistência local com CloudKit sync
     ☐ Criar serviços de networking para comunicação com backend Next.js/FastAPI
     ☐ Implementar criptografia end-to-end (AES-256) para dados sensíveis
     ☐ Configurar conformidade LGPD/HIPAA com políticas de privacidade e termos de uso
     ☐ Implementar recursos de acessibilidade (VoiceOver, Dynamic Type, alto contraste)
     ☐ Criar integração com Apple Health para sincronização de dados de saúde
     ☐ Implementar sistema de notificações para lembretes de exames e alertas críticos
     ☐ Configurar atalhos de Siri para funções principais do app
     ☐ Criar gráficos de evolução temporal usando Charts framework
     ☐ Implementar funcionalidade de compartilhamento seguro com médicos
     ☐ Configurar backup automático no iCloud com sincronização cross-device
     ☐ Criar sistema de logs auditáveis para conformidade e debugging
     ☐ Implementar testes unitários para ViewModels e serviços críticos
     ☐ Configurar testes de UI automatizados para fluxos principais do usuário
     ☐ Criar documentação técnica do projeto e guia de contribuição
     ☐ Realizar testes de performance e otimização para targets de sucesso definidos
     ☐ Preparar assets finais, ícones do app e screenshots para App Store
---------------------------------------------------------------------------------------------------------------
  🏗️ Arquitetura de Pastas e Componentes

  src/
  ├── 📱 screens/                     # Telas principais da aplicação
  │   ├── auth/
  │   │   ├── LoginScreen.tsx         # Tela de login
  │   │   ├── RegisterScreen.tsx      # Cadastro de usuário
  │   │   ├── ForgotPasswordScreen.tsx # Recuperação de senha
  │   │   └── BiometricSetupScreen.tsx # Configuração biométrica
  │   ├── main/
  │   │   ├── DashboardScreen.tsx     # Dashboard principal
  │   │   ├── UploadScreen.tsx        # Upload de exames (existente)
  │   │   ├── ExamDetailScreen.tsx    # Detalhes do exame
  │   │   ├── ExamAnalysisScreen.tsx  # Análise/crop de parâmetros
  │   │   └── HistoryScreen.tsx       # Histórico de exames
  │   ├── profile/
  │   │   ├── ProfileScreen.tsx       # Perfil do usuário
  │   │   ├── SettingsScreen.tsx      # Configurações
  │   │   └── HelpScreen.tsx          # Ajuda e suporte
  │   └── onboarding/
  │       ├── WelcomeScreen.tsx       # Tela de boas-vindas
  │       └── TutorialScreen.tsx      # Tutorial do app
  ├── 🧩 components/                  # Componentes reutilizáveis
  │   ├── ui/                         # Componentes base UI
  │   │   ├── Button.tsx
  │   │   ├── Input.tsx
  │   │   ├── Card.tsx
  │   │   ├── Modal.tsx
  │   │   ├── LoadingSpinner.tsx
  │   │   ├── Toast.tsx
  │   │   ├── Avatar.tsx
  │   │   └── ProgressBar.tsx
  │   ├── forms/                      # Componentes de formulário
  │   │   ├── AuthForm.tsx
  │   │   ├── ProfileForm.tsx
  │   │   └── SettingsForm.tsx
  │   ├── exam/                       # Componentes específicos de exames
  │   │   ├── ExamCard.tsx
  │   │   ├── ParameterList.tsx
  │   │   ├── CropSelector.tsx
  │   │   ├── ExamViewer.tsx
  │   │   └── ExportMenu.tsx
  │   ├── charts/                     # Gráficos e visualizações
  │   │   ├── ParameterChart.tsx
  │   │   ├── TrendChart.tsx
  │   │   └── ComparisonChart.tsx
  │   └── layout/                     # Layout e estrutura
  │       ├── Header.tsx
  │       ├── TabBar.tsx
  │       └── SafeContainer.tsx
  ├── 🧭 navigation/                  # Sistema de navegação
  │   ├── AppNavigator.tsx           # Navegador principal
  │   ├── AuthNavigator.tsx          # Fluxo de autenticação
  │   ├── MainTabNavigator.tsx       # Tabs principais
  │   └── types.ts                   # Types para navegação
  ├── 🗄️ store/                       # Estado global (Zustand)
  │   ├── authStore.ts               # Estado de autenticação
  │   ├── examStore.ts               # Estado dos exames
  │   ├── userStore.ts               # Estado do usuário
  │   └── settingsStore.ts           # Configurações do app
  ├── 🔌 services/                    # Integração com APIs
  │   ├── api/
  │   │   ├── authApi.ts
  │   │   ├── examApi.ts
  │   │   ├── userApi.ts
  │   │   └── uploadApi.ts
  │   ├── analytics.ts (existente)
  │   ├── auth.ts (existente)
  │   ├── exams.ts (existente)
  │   └── notifications.ts
  ├── 🔧 hooks/                       # Custom hooks
  │   ├── useAuth.ts
  │   ├── useExams.ts
  │   ├── useUpload.ts
  │   ├── useBiometric.ts
  │   └── useNotifications.ts
  ├── 📊 types/                       # TypeScript definitions
  │   ├── api.ts
  │   ├── exam.ts (existente)
  │   ├── user.ts
  │   ├── navigation.ts
  │   └── common.ts
  ├── 🛠️ utils/                       # Utilitários
  │   ├── format.ts (existente)
  │   ├── validation.ts
  │   ├── dateHelpers.ts
  │   ├── fileHelpers.ts
  │   └── constants.ts
  ├── 🎨 theme/                       # Design system
  │   ├── colors.ts
  │   ├── typography.ts
  │   ├── spacing.ts
  │   └── components.ts
  └── 🌐 i18n/ (existente)           # Internacionalização
      ├── index.ts
      ├── pt-BR.json
      └── en-US.json

  ---
  📱 Detalhamento dos Componentes por Funcionalidade

  🔐 1. FLUXO DE AUTENTICAÇÃO

  LoginScreen.tsx

  Pré-requisitos:
  - @react-navigation/stack (navegação)
  - expo-local-authentication (biometria)
  - @react-native-async-storage/async-storage (persistência)

  Dependências de Componentes:
  - Input.tsx (email/senha)
  - Button.tsx (botão login)
  - LoadingSpinner.tsx (estado loading)
  - Toast.tsx (feedback de erro)

  Elementos Visuais:
  - Logo/branding
  - Campos de entrada (email, senha)
  - Botão principal "Entrar"
  - Link "Esqueci minha senha"
  - Opção login biométrico
  - Link para cadastro

  Integrações:
  - authStore.login() - Zustand
  - authApi.authenticate() - API
  - useBiometric() - Hook customizado

  ---
  RegisterScreen.tsx

  Pré-requisitos:
  - Validação de formulário (Yup/Zod)
  - expo-camera (foto perfil - opcional)

  Dependências de Componentes:
  - AuthForm.tsx (formulário completo)
  - Avatar.tsx (foto perfil)
  - ProgressBar.tsx (etapas cadastro)

  Elementos Visuais:
  - Stepper/wizard de cadastro (3 etapas)
  - Campos: nome, email, senha, confirmação
  - Upload de foto (opcional)
  - Checkbox termos e condições
  - Botão "Criar conta"

  Integrações:
  - authStore.register() - Estado
  - authApi.createAccount() - API
  - validation.userSchema - Validação

  ---
  🏠 2. FLUXO PRINCIPAL

  DashboardScreen.tsx

  Pré-requisitos:
  - @tanstack/react-query (cache)
  - react-native-charts-wrapper (gráficos)

  Dependências de Componentes:
  - ExamCard.tsx (exames recentes)
  - ParameterChart.tsx (tendências)
  - Header.tsx (cabeçalho)
  - Button.tsx (ações rápidas)

  Elementos Visuais:
  - Saudação personalizada
  - Cards de estatísticas (total exames, último upload)
  - Lista de exames recentes (3-5 items)
  - Gráfico de tendências de parâmetros
  - Botões de ação rápida (upload, histórico)
  - Notificações/alertas

  Integrações:
  - examStore.getRecentExams() - Estado
  - examApi.getDashboardData() - API
  - useExams() - Hook customizado

  ---
  ExamDetailScreen.tsx

  Pré-requisitos:
  - react-native-pdf (visualização PDF)
  - react-native-share (compartilhamento)

  Dependências de Componentes:
  - ExamViewer.tsx (PDF viewer)
  - ParameterList.tsx (lista parâmetros)
  - ExportMenu.tsx (opções export)
  - Modal.tsx (confirmações)

  Elementos Visuais:
  - Header com título do exame
  - Tabs: "Parâmetros" | "PDF Original"
  - Lista de parâmetros com valores/referências
  - Indicadores visuais (normal/alterado)
  - Botões de ação (compartilhar, exportar)
  - Histórico de análises

  Integrações:
  - examStore.getExamById(id) - Estado
  - examApi.getExamDetails(id) - API
  - examsService.exportCsv() - Serviço

  ---
  ExamAnalysisScreen.tsx

  Pré-requisitos:
  - react-native-image-crop-picker (crop)
  - Processamento OCR/IA (backend)

  Dependências de Componentes:
  - CropSelector.tsx (seleção área)
  - ParameterList.tsx (resultados)
  - LoadingSpinner.tsx (processamento)
  - Button.tsx (ações)

  Elementos Visuais:
  - Visualizador de PDF com zoom
  - Ferramenta de crop/seleção
  - Preview da área selecionada
  - Resultados da análise IA
  - Botões confirmar/refazer
  - Indicador de progresso

  Integrações:
  - examStore.analyzeArea() - Estado
  - examApi.analyzeCrop() - API
  - CropSelector - Componente complexo

  ---
  📊 3. COMPONENTES DE VISUALIZAÇÃO

  ParameterChart.tsx

  Pré-requisitos:
  - react-native-chart-kit ou victory-native
  - Dados históricos de parâmetros

  Dependências de Componentes:
  - Nenhuma (componente base)

  Elementos Visuais:
  - Gráfico de linha/área
  - Legendas e eixos
  - Indicadores de referência
  - Tooltip ao toque
  - Seletor de período

  Integrações:
  - Props: data, parameter, timeRange
  - formatters para valores

  ---
  ExamCard.tsx

  Pré-requisitos:
  - Navegação para detalhes
  - Formatação de datas

  Dependências de Componentes:
  - Card.tsx (container)
  - Avatar.tsx (ícone status)

  Elementos Visuais:
  - Card com sombra/elevação
  - Título do exame
  - Data de realização
  - Status (processado/pendente)
  - Laboratório (se disponível)
  - Ícone indicador

  Integrações:
  - Props: exam object
  - onPress navigation
  - formatDate() utility

  ---
  🔧 4. COMPONENTES DE INFRAESTRUTURA

  Button.tsx

  Pré-requisitos:
  - Sistema de design consistente
  - Acessibilidade

  Dependências de Componentes:
  - LoadingSpinner.tsx (estado loading)

  Elementos Visuais:
  - Variantes: primary, secondary, outline, text
  - Estados: normal, pressed, disabled, loading
  - Tamanhos: small, medium, large
  - Ícones (opcional)

  Integrações:
  - Props tipadas com TypeScript
  - Theme system integration

  ---
  Input.tsx

  Pré-requisitos:
  - Validação de formulário
  - Acessibilidade

  Dependências de Componentes:
  - Ícones de estado (erro/sucesso)

  Elementos Visuais:
  - Label e placeholder
  - Bordas/estados visuais
  - Mensagens de erro
  - Ícones de ação (mostrar/ocultar senha)
  - Suporte a multiline

  Integrações:
  - Integration com form libraries
  - Validation feedback

  ---
  🔌 5. INTEGRAÇÕES E SERVIÇOS

  examApi.ts

  Pré-requisitos:
  - HTTP client configurado
  - Autenticação JWT
  - Upload multipart

  Funcionalidades:
  - uploadExam(file) - Upload PDF
  - getExams() - Lista exames
  - getExamById(id) - Detalhes
  - analyzeExam(id, crop) - Análise IA
  - exportExam(id, format) - Export

  Integrações:
  - http.ts service
  - Error handling
  - Progress tracking

  ---
  examStore.ts (Zustand)

  Pré-requisitos:
  - Zustand configured
  - Persistence middleware

  Estado:
  interface ExamStore {
    exams: Exam[]
    currentExam: Exam | null
    loading: boolean
    uploadProgress: number
  }

  Ações:
  - fetchExams() - Carregar lista
  - uploadExam(file) - Upload
  - setCurrentExam(exam) - Seleção
  - updateExam(id, data) - Atualização

  ---
  🎯 Prioridades de Desenvolvimento

  Fase 1 - MVP Core (2-3 sprints)

  1. Navegação básica (AppNavigator.tsx)
  2. Components UI base (Button, Input, Card)
  3. Upload melhorado (expandir UploadScreen.tsx)
  4. Lista de exames (HistoryScreen.tsx)
  5. Detalhes básicos (ExamDetailScreen.tsx)

  Fase 2 - Funcionalidades Core (3-4 sprints)

  1. Autenticação completa (Login/Register)
  2. Dashboard com estatísticas
  3. Análise com crop (ExamAnalysisScreen.tsx)
  4. Export melhorado (CSV/PDF)
  5. Estado global (Zustand stores)

  Fase 3 - UX Avançada (2-3 sprints)

  1. Gráficos e charts (ParameterChart.tsx)
  2. Biometria (BiometricSetupScreen.tsx)
  3. Notificações push
  4. Perfil e configurações
  5. Onboarding tutorial

  Fase 4 - Polish (2 sprints)

  1. Testes automatizados
  2. Acessibilidade completa
  3. Performance otimizations
  4. Design system refinement
  5. Deploy e monitoring

  ---
  🔗 Dependências Técnicas Críticas

  Backend APIs Necessárias:

  - POST /auth/login - Autenticação
  - GET /exams - Lista exames
  - POST /exams/upload - Upload PDF
  - POST /exams/{id}/analyze - Análise OCR/IA
  - GET /exams/{id}/export - Export dados

  Expo Modules Adicionais:

  - expo-document-picker ✅ (já instalado)
  - expo-file-system ✅ (já instalado)
  - expo-sharing ✅ (já instalado)
  - expo-local-authentication ✅ (já instalado)
  - expo-notifications ✅ (já instalado)

  Bibliotecas UI/UX:

  - Chart library (react-native-chart-kit/victory-native)
  - Image manipulation (react-native-image-crop-picker)
  - Form validation (react-hook-form + zod)
  - Date handling (date-fns)

  Esta estrutura fornece uma base sólida e escalável para desenvolvimento do ViveSaude Lábios completo, com clara separação de responsabilidades e
  roadmap de implementação.

