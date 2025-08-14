# 📱 **Guia Completo de Comandos Expo**

## 🚀 **Instalação e Setup**

### **Instalar Expo CLI e EAS**
```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Instalar EAS CLI (para builds na nuvem)
npm install -g eas-cli

# Verificar versões
expo --version
eas --version
```

### **Criar Projeto**
```bash
# Projeto básico
npx create-expo-app MeuApp

# Com template TypeScript
npx create-expo-app MeuApp --template blank-typescript

# Com template de navegação
npx create-expo-app MeuApp --template tabs

# Templates disponíveis
npx create-expo-app --template
```

## 💻 **Desenvolvimento Local**

### **Servidor de Desenvolvimento**
```bash
# Iniciar servidor
expo start
# ou
npx expo start

# Modo clear cache
expo start --clear

# Tunnel mode (para testar via internet)
expo start --tunnel

# LAN mode (rede local)
expo start --lan

# Modo offline
expo start --offline
```

### **Executar em Plataformas**
```bash
# iOS Simulator
expo start --ios
# ou durante expo start, pressione 'i'

# Android Emulator  
expo start --android
# ou durante expo start, pressione 'a'

# Web Browser
expo start --web
# ou durante expo start, pressione 'w'
```

## 📦 **Gerenciamento de Dependências**

### **Instalar Pacotes**
```bash
# Instalar pacote compatível com Expo
npx expo install nome-do-pacote

# Instalar múltiplos pacotes
npx expo install react-navigation expo-camera expo-location

# Sincronizar versões (após npm install)
npx expo install --fix

# Instalar pacote específico do npm
npm install nome-do-pacote
```

### **Pacotes Essenciais para Healthcare**
```bash
# Navegação
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# Autenticação e Segurança
npx expo install expo-local-authentication expo-crypto expo-secure-store

# Arquivos e Documentos
npx expo install expo-document-picker expo-file-system expo-sharing

# Câmera e Mídia
npx expo install expo-camera expo-image-picker expo-av

# Notificações
npx expo install expo-notifications expo-device

# Estado Global
npm install zustand @tanstack/react-query

# UI Components
npm install react-native-elements react-native-paper
```

## 🏗️ **Build e Deploy (EAS)**

### **Configurar EAS**
```bash
# Login na conta Expo
eas login

# Configurar projeto para EAS
eas build:configure

# Ver configuração atual
eas build:list
```

### **Builds**
```bash
# Build para iOS (na nuvem)
eas build --platform ios

# Build para Android
eas build --platform android

# Build para ambas plataformas
eas build --platform all

# Build preview (para testes)
eas build --platform ios --profile preview

# Build de desenvolvimento
eas build --platform ios --profile development
```

### **Submit para App Stores**
```bash
# Submit para App Store (iOS)
eas submit --platform ios

# Submit para Google Play (Android)
eas submit --platform android

# Submit para ambas
eas submit --platform all
```

## 🔧 **Configuração e Debugging**

### **Configuração**
```bash
# Ver configuração do projeto
expo config

# Validar configuração
expo config --type public

# Ver informações do projeto
expo whoami
```

### **Debugging**
```bash
# Abrir React Developer Tools
expo start --dev-client

# Logs detalhados
expo start --verbose

# Diagnosticar problemas
expo doctor

# Limpar cache
expo start --clear
```

## 📱 **Expo Go (Teste em Dispositivos)**

### **QR Code e Teste**
```bash
# Gerar QR code para teste
expo start

# Enviar link por email/SMS
expo send

# Ver logs do dispositivo
expo logs
```

## 🌐 **Web Development**

### **Comandos Web**
```bash
# Executar no navegador
expo start --web

# Build para produção web
expo export --platform web

# Servir build local
npx serve web-build
```

## 📱 **Expo Dev Client (Desenvolvimento Avançado)**

### **Setup Dev Client**
```bash
# Instalar expo-dev-client
npx expo install expo-dev-client

# Build development client
eas build --profile development --platform ios

# Executar com dev client
expo start --dev-client
```

## 🎯 **Comandos Específicos por Feature**

### **Câmera e Documentos**
```bash
# Configurar permissões de câmera
npx expo install expo-camera expo-image-picker

# Para PDFs
npm install react-native-pdf
```

### **Autenticação Biométrica**
```bash
# Face ID / Touch ID
npx expo install expo-local-authentication

# Armazenamento seguro
npx expo install expo-secure-store
```

### **Notificações Push**
```bash
# Setup notificações
npx expo install expo-notifications expo-device expo-constants

# Registrar para notificações
expo push:android:upload --api-key YOUR_KEY
```

## 🔍 **Utilitários e Helpers**

### **Análise e Otimização**
```bash
# Analisar bundle size
expo export --dump-assetmap

# Ver dependências do projeto
npm ls --depth=0

# Verificar atualizações
expo install --fix
```

### **Desenvolvimento**
```bash
# Gerar ícones automaticamente
expo install @expo/vector-icons

# Fonts customizadas
expo install expo-font

# AsyncStorage
npx expo install @react-native-async-storage/async-storage
```

## 🚀 **Workflow Completo de Desenvolvimento**

### **Setup Inicial (Uma vez)**
```bash
# 1. Instalar ferramentas
npm install -g @expo/cli eas-cli

# 2. Criar projeto
npx create-expo-app vivesaude-labios --template blank-typescript

# 3. Configurar EAS
cd vivesaude-labios
eas login
eas build:configure
```

### **Desenvolvimento Diário**
```bash
# 1. Instalar dependências
npx expo install nova-dependencia

# 2. Iniciar desenvolvimento
expo start

# 3. Testar em dispositivo (pressionar 'i' para iOS, 'a' para Android)

# 4. Build para testes
eas build --platform ios --profile preview
```

### **Deploy para Produção**
```bash
# 1. Build final
eas build --platform all

# 2. Submit para stores
eas submit --platform all

# 3. Gerenciar releases
eas update
```

## 🎯 **Comandos Essenciais do Dia-a-dia**

```bash
# Os 5 comandos mais usados:
expo start                    # Iniciar desenvolvimento
npx expo install pacote      # Instalar dependências
eas build --platform ios     # Build para iOS
expo start --clear           # Limpar cache
expo doctor                  # Diagnosticar problemas
```

## 📋 **Atalhos Durante Desenvolvimento**

**Durante `expo start`:**
- `r` → Reload app
- `m` → Toggle menu
- `d` → Open developer menu
- `i` → Open iOS simulator
- `a` → Open Android emulator
- `w` → Open web browser
- `c` → Clear cache and restart
- `?` → Show help

## 🔗 **Links Úteis**

- [Expo Docs](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Go](https://expo.dev/client)
- [Expo Snack](https://snack.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

---

**Agora você tem todos os comandos para dominar o Expo! 🚀**