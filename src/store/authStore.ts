import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  
  // Biometric actions
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  
  // User actions
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Recovery actions
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Mock API functions (replace with real API calls)
const authApi = {
  login: async (email: string, password: string) => {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'admin@vivesaude.com' && password === '123456') {
      return {
        user: {
          id: '1',
          email: 'admin@vivesaude.com',
          name: 'Admin User',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };
    }
    
    throw new Error('Credenciais inválidas');
  },
  
  register: async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    };
  },
  
  refreshToken: async (refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token',
    };
  },
  
  updateUser: async (userData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return userData;
  },
  
  updatePassword: async (currentPassword: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock validation would happen here
  },
  
  forgotPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock sending recovery email
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock password reset
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      biometricEnabled: false,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.login(email, password);
          
          // Store tokens securely
          await SecureStore.setItemAsync('authToken', response.token);
          await SecureStore.setItemAsync('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register action
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.register(name, email, password);
          
          // Store tokens securely
          await SecureStore.setItemAsync('authToken', response.token);
          await SecureStore.setItemAsync('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Clear secure storage
          await SecureStore.deleteItemAsync('authToken');
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('biometricCredentials');
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            biometricEnabled: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Force reset even if SecureStore fails
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            biometricEnabled: false,
          });
        }
      },

      // Refresh authentication
      refreshAuth: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        try {
          const response = await authApi.refreshToken(refreshToken);
          
          // Update tokens
          await SecureStore.setItemAsync('authToken', response.token);
          await SecureStore.setItemAsync('refreshToken', response.refreshToken);
          
          set({
            token: response.token,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          // If refresh fails, logout user
          await get().logout();
          throw error;
        }
      },

      // Check authentication status
      checkAuthStatus: async () => {
        set({ isLoading: true });
        
        try {
          const token = await SecureStore.getItemAsync('authToken');
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          const biometricCredentials = await SecureStore.getItemAsync('biometricCredentials');
          
          if (token && refreshToken) {
            // Try to refresh token to validate it
            try {
              await get().refreshAuth();
              
              set({
                isAuthenticated: true,
                biometricEnabled: !!biometricCredentials,
                isLoading: false,
              });
            } catch (error) {
              // Token invalid, clear everything
              await get().logout();
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth status check error:', error);
          set({ isLoading: false });
        }
      },

      // Enable biometric authentication
      enableBiometric: async () => {
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          
          if (!hasHardware || !isEnrolled) {
            throw new Error('Autenticação biométrica não disponível');
          }
          
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Confirme sua identidade para habilitar autenticação biométrica',
            cancelLabel: 'Cancelar',
            fallbackLabel: 'Usar senha',
          });
          
          if (result.success) {
            const { user, token, refreshToken } = get();
            
            // Store credentials for biometric login
            const credentials = JSON.stringify({
              email: user?.email,
              userId: user?.id,
              token,
              refreshToken,
            });
            
            await SecureStore.setItemAsync('biometricCredentials', credentials);
            
            set({ biometricEnabled: true });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Biometric setup error:', error);
          throw error;
        }
      },

      // Disable biometric authentication
      disableBiometric: async () => {
        try {
          await SecureStore.deleteItemAsync('biometricCredentials');
          set({ biometricEnabled: false });
        } catch (error) {
          console.error('Biometric disable error:', error);
          throw error;
        }
      },

      // Login with biometric
      loginWithBiometric: async () => {
        set({ isLoading: true });
        
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          
          if (!hasHardware || !isEnrolled) {
            throw new Error('Autenticação biométrica não disponível');
          }
          
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Use sua biometria para fazer login',
            cancelLabel: 'Cancelar',
            fallbackLabel: 'Usar senha',
          });
          
          if (result.success) {
            const credentialsJson = await SecureStore.getItemAsync('biometricCredentials');
            
            if (!credentialsJson) {
              throw new Error('Credenciais biométricas não encontradas');
            }
            
            const credentials = JSON.parse(credentialsJson);
            
            set({
              user: {
                id: credentials.userId,
                email: credentials.email,
                name: credentials.name || credentials.email,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              },
              token: credentials.token,
              refreshToken: credentials.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              biometricEnabled: true,
            });
            
            // Try to refresh the token
            try {
              await get().refreshAuth();
            } catch (error) {
              console.warn('Token refresh failed, but biometric login succeeded');
            }
          } else {
            set({ isLoading: false });
            throw new Error('Autenticação biométrica cancelada');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Update user
      updateUser: async (userData: Partial<User>) => {
        const { user } = get();
        
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        try {
          const updatedData = await authApi.updateUser(userData);
          
          set({
            user: {
              ...user,
              ...updatedData,
            },
          });
        } catch (error) {
          throw error;
        }
      },

      // Update password
      updatePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await authApi.updatePassword(currentPassword, newPassword);
        } catch (error) {
          throw error;
        }
      },

      // Forgot password
      forgotPassword: async (email: string) => {
        try {
          await authApi.forgotPassword(email);
        } catch (error) {
          throw error;
        }
      },

      // Reset password
      resetPassword: async (token: string, newPassword: string) => {
        try {
          await authApi.resetPassword(token, newPassword);
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'vivesaude-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        biometricEnabled: state.biometricEnabled,
        // Don't persist tokens in AsyncStorage for security
      }),
    }
  )
);