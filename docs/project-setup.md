# 🏥 **ViveSaude Lábios - Setup do Projeto**

## 📋 **Visão Geral**

ViveSaude Lábios é uma aplicação de saúde desenvolvida em React Native com Expo para digitalização e análise inteligente de exames laboratoriais através de processamento de PDFs com IA.

## 🎯 **Características Principais**

- **Plataforma**: React Native + Expo
- **Linguagem**: TypeScript
- **Arquitetura**: Clean Architecture + Redux/Zustand
- **Build**: EAS Build (nuvem)
- **Deployment**: EAS Submit + App Store Connect

## 🚀 **Setup Inicial**

### **1. Pré-requisitos**
```bash
# Node.js (recomendado: v18+)
node --version

# npm ou yarn
npm --version

# Git
git --version
```

### **2. Instalação Global**
```bash
# Instalar ferramentas Expo
npm install -g @expo/cli eas-cli

# Verificar instalação
expo --version
eas --version
```

### **3. Clone e Setup**
```bash
# Clone do repositório
git clone https://github.com/user/vivesaude-labios-expo.git
cd vivesaude-labios-expo

# Instalar dependências
npm install

# Sincronizar versões Expo
npx expo install --fix
```

## 📦 **Dependências do Projeto**

### **Core**
- `expo` - Framework principal
- `react-native` - Runtime mobile
- `typescript` - Tipagem estática
- `@expo/config-plugins` - Configurações nativas

### **Navegação**
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

### **Healthcare Específicas**
- `expo-document-picker` - Seleção de PDFs
- `expo-camera` - Scanner de documentos
- `expo-local-authentication` - Face ID/Touch ID
- `expo-file-system` - Manipulação de arquivos
- `expo-crypto` - Criptografia AES-256
- `expo-secure-store` - Armazenamento seguro

### **Estado e Dados**
- `zustand` - Gerenciamento de estado
- `@tanstack/react-query` - Cache e sincronização
- `@react-native-async-storage/async-storage` - Persistência

### **UI/UX**
- `react-native-elements` - Componentes base
- `@expo/vector-icons` - Ícones
- `expo-font` - Fontes customizadas
- `expo-haptics` - Feedback tátil

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm start              # Iniciar Expo dev server
npm run ios           # iOS Simulator
npm run android       # Android Emulator  
npm run web           # Web Browser

# Build e Deploy
npm run build:ios     # Build iOS (EAS)
npm run build:android # Build Android (EAS)
npm run submit       # Submit para stores

# Utilitários
npm run doctor       # Diagnosticar problemas
npm run clean        # Limpar cache
```

## 🏗️ **Estrutura do Projeto**

```
vivesaude-labios-expo/
├── docs/                    # Documentação
│   ├── expo-commands.md
│   ├── project-setup.md
│   └── development-guide.md
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── screens/            # Telas da aplicação
│   ├── navigation/         # Configuração de navegação
│   ├── services/           # APIs e integrações
│   ├── stores/             # Gerenciamento de estado
│   ├── utils/              # Utilitários e helpers
│   ├── types/              # TypeScript definitions
│   └── constants/          # Constantes e configurações
├── assets/                 # Imagens, fontes, ícones
├── app.config.js          # Configuração do Expo
├── eas.json              # Configuração EAS Build
├── package.json
└── README.md
```

## 🎨 **Design System**

### **Cores Principais**
```typescript
const colors = {
  primary: '#0066CC',      // Azul principal
  secondary: '#1a1a2e',    // Cinza escuro
  background: '#FFFFFF',   // Branco
  text: '#1a1a2e',        // Texto principal
  success: '#10B981',      // Verde (resultados normais)
  warning: '#F59E0B',      // Amarelo (atenção)
  error: '#EF4444',        // Vermelho (crítico)
};
```

### **Tipografia**
```typescript
const fonts = {
  regular: 'SF Pro Display',
  medium: 'SF Pro Display Medium', 
  bold: 'SF Pro Display Bold',
  mono: 'SF Pro Text Monospaced',
};
```

## 🔐 **Configurações de Segurança**

### **Permissões Necessárias**
- Camera: Scanner de documentos
- Photo Library: Seleção de PDFs
- Face ID: Autenticação biométrica
- Notifications: Alertas médicos

### **Compliance**
- LGPD (Brasil) compliance
- HIPAA guidelines (internacional)
- Criptografia AES-256 para dados sensíveis
- Audit logs para todas as operações

## 🚀 **Desenvolvimento**

### **Iniciar Desenvolvimento**
```bash
# Iniciar servidor
expo start

# Testar em dispositivo
# Pressionar 'i' para iOS
# Pressionar 'a' para Android
# Pressionar 'w' para Web

# Com cache limpo
expo start --clear
```

### **Build para Teste**
```bash
# Configurar EAS (primeira vez)
eas login
eas build:configure

# Build preview para testes
eas build --platform ios --profile preview
```

## 📱 **Deployment**

### **Build de Produção**
```bash
# Build para iOS
eas build --platform ios --profile production

# Build para Android
eas build --platform android --profile production

# Build para ambas plataformas
eas build --platform all --profile production
```

### **Submit para Stores**
```bash
# App Store (iOS)
eas submit --platform ios

# Google Play (Android)
eas submit --platform android
```

## 🔍 **Troubleshooting**

### **Problemas Comuns**
```bash
# Cache corrompido
expo start --clear

# Dependências desatualizadas
npx expo install --fix

# Problemas de configuração
expo doctor

# Reset completo
rm -rf node_modules
npm install
expo start --clear
```

### **Logs e Debug**
```bash
# Logs detalhados
expo start --verbose

# Logs do dispositivo
expo logs

# React Developer Tools
expo start --dev-client
```

## 📚 **Recursos Adicionais**

- **Documentação Expo**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **React Navigation**: https://reactnavigation.org/
- **Healthcare Libraries**: Ver `docs/healthcare-libs.md`

## 🤝 **Contribuição**

1. Fork do projeto
2. Criar branch para feature (`git checkout -b feature/nova-feature`)
3. Commit das mudanças (`git commit -am 'Add nova feature'`)
4. Push para branch (`git push origin feature/nova-feature`)
5. Criar Pull Request

## 📄 **Licença**

Este projeto está sob licença MIT. Ver arquivo `LICENSE` para detalhes.

---

**Para mais informações, consulte a documentação completa em `/docs/`**