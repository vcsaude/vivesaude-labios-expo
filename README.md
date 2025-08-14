# 🏥 **ViveSaude Lábios**

> *Aplicação móvel para digitalização e análise inteligente de exames laboratoriais*

[![Expo](https://img.shields.io/badge/Expo-SDK%2050-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-green.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 **Visão Geral**

ViveSaude Lábios é uma aplicação de saúde desenvolvida em React Native com Expo que permite aos usuários digitalizar, armazenar e analisar seus exames laboratoriais através de inteligência artificial. A aplicação oferece análise em múltiplas camadas de profundidade com sistema de moedas virtuais.

### **🎯 Principais Funcionalidades**

- 📄 **Upload de PDFs** - Digitalização de exames laboratoriais
- 🤖 **Análise com IA** - 6 níveis de análise (5-50 moedas)
- 🔒 **Autenticação Biométrica** - Face ID/Touch ID para segurança
- 📊 **Dashboard Inteligente** - Visualização de resultados e tendências
- 💰 **Sistema de Moedas** - Pagamentos in-app para análises
- 🔐 **Compliance LGPD/HIPAA** - Máxima segurança para dados médicos

## 🚀 **Quick Start**

### **Pré-requisitos**
- Node.js 18+ 
- Expo CLI
- iOS Simulator ou dispositivo físico

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/user/vivesaude-labios-expo.git
cd vivesaude-labios-expo

# Instalar dependências
npm install

# Iniciar desenvolvimento
expo start
```

### **Teste Rápido**
1. Escaneie o QR code com Expo Go
2. Ou pressione `i` para iOS Simulator
3. Navegue pelas funcionalidades implementadas

## 🏗️ **Arquitetura**

```
┌─────────────────────────────────────┐
│           Presentation              │ ← React Native + Expo
│        (Screens/Components)         │
├─────────────────────────────────────┤
│            Application              │ ← Zustand + React Query
│         (Stores/Services)           │
├─────────────────────────────────────┤
│             Domain                  │ ← TypeScript Types
│        (Types/Interfaces)           │
├─────────────────────────────────────┤
│           Infrastructure            │ ← APIs + Storage + Utils
│        (APIs/Storage/Utils)         │
└─────────────────────────────────────┘
```

### **Stack Tecnológica**
- **Frontend**: React Native + Expo SDK 50
- **Linguagem**: TypeScript
- **Estado**: Zustand + React Query
- **Navegação**: React Navigation 6
- **UI**: React Native Elements + Custom Design System
- **Build**: EAS Build (nuvem)
- **Deploy**: EAS Submit + App Store Connect

## 📱 **Screenshots**

| Upload | Resultados | Análise | Perfil |
|--------|------------|---------|---------|
| ![Upload](assets/screenshots/upload.png) | ![Results](assets/screenshots/results.png) | ![Analysis](assets/screenshots/analysis.png) | ![Profile](assets/screenshots/profile.png) |

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

# Qualidade
npm run lint          # ESLint
npm run test          # Jest + React Native Testing Library
npm run type-check    # TypeScript check
```

## 📦 **Principais Dependências**

### **Core**
```json
{
  "expo": "~50.0.0",
  "react-native": "0.73.0",
  "typescript": "^5.0.0"
}
```

### **Healthcare Específicas**
```json
{
  "expo-document-picker": "^11.0.0",
  "expo-camera": "^14.0.0",
  "expo-local-authentication": "^13.0.0",
  "expo-crypto": "^12.0.0",
  "expo-secure-store": "^12.0.0"
}
```

### **Estado e Navegação**
```json
{
  "zustand": "^4.4.0",
  "@tanstack/react-query": "^5.0.0",
  "@react-navigation/native": "^6.1.0"
}
```

## 🎨 **Design System**

### **Cores Principais**
```typescript
const colors = {
  primary: '#0066CC',      // Azul ViveSaude
  secondary: '#1a1a2e',    // Cinza escuro
  background: '#FFFFFF',   // Branco
  success: '#10B981',      // Verde (normal)
  warning: '#F59E0B',      // Amarelo (atenção)
  error: '#EF4444',        // Vermelho (crítico)
};
```

### **Tipografia**
- **Display**: SF Pro Display (iOS) / Roboto (Android)
- **Monospace**: SF Mono para valores numéricos
- **Tamanhos**: 12px → 32px (escala harmônica)

## 🔐 **Segurança e Compliance**

### **Recursos de Segurança**
- ✅ Autenticação biométrica obrigatória
- ✅ Criptografia AES-256 para dados sensíveis
- ✅ Armazenamento seguro com Expo SecureStore
- ✅ Transmissão HTTPS com certificate pinning
- ✅ Logs auditáveis para compliance

### **Compliance**
- 🇧🇷 **LGPD** - Lei Geral de Proteção de Dados (Brasil)
- 🇺🇸 **HIPAA** - Health Insurance Portability and Accountability Act
- 🌍 **ISO 27001** - Padrões internacionais de segurança

## 📊 **Features Implementadas**

### **✅ Concluídas**
- [x] Sistema de autenticação biométrica
- [x] Upload e preview de PDFs
- [x] Design system completo
- [x] Navegação por tabs
- [x] Estados de loading e erro
- [x] Splash screen e onboarding

### **🔄 Em Desenvolvimento**
- [ ] Integração com OCR e IA
- [ ] Sistema de moedas virtuais
- [ ] Dashboard de resultados
- [ ] Gráficos de evolução temporal
- [ ] Sincronização com Apple Health

### **📋 Roadmap**
- [ ] Análise preditiva com ML
- [ ] Compartilhamento com médicos
- [ ] Notificações inteligentes
- [ ] Versão para iPad
- [ ] Integração com laboratórios

## 🧪 **Testing**

### **Executar Testes**
```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage

# Testes e2e (futuro)
npm run test:e2e
```

### **Estratégia de Testes**
- **Unit**: Componentes e utils (Jest + RTL)
- **Integration**: Stores e services
- **E2E**: Fluxos críticos (Detox - futuro)

## 📚 **Documentação**

- 📖 [Setup do Projeto](docs/project-setup.md)
- 👨‍💻 [Guia de Desenvolvimento](docs/development-guide.md)  
- 📱 [Comandos Expo](docs/expo-commands.md)
- 🏥 [Healthcare Libraries](docs/healthcare-libs.md)
- 🔐 [Segurança e Compliance](docs/security.md)

## 🤝 **Contribuição**

### **Como Contribuir**
1. Fork do projeto
2. Criar branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -am 'Add nova feature'`
4. Push: `git push origin feature/nova-feature` 
5. Pull Request

### **Padrões de Código**
- ✅ TypeScript obrigatório
- ✅ ESLint + Prettier configurados
- ✅ Conventional Commits
- ✅ Testes para features críticas
- ✅ Documentação atualizada

## 📄 **Licença**

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 👥 **Time**

- **Desenvolvimento**: [Seu Nome](https://github.com/seu-usuario)
- **Design**: ViveSaude Design Team
- **Product**: ViveSaude Product Team

## 📞 **Suporte**

- **Issues**: [GitHub Issues](https://github.com/user/vivesaude-labios-expo/issues)
- **Email**: suporte@vivesaude.com.br
- **Docs**: [Documentação Completa](docs/)

---

<div align="center">

**Feito com ❤️ para revolucionar o acesso a informações de saúde**

[🌐 ViveSaude](https://vivesaude.com.br) • [📱 App Store](https://apps.apple.com/app/vivesaude) • [🤖 Google Play](https://play.google.com/store/apps/vivesaude)

</div>