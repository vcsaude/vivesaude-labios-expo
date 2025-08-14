import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

export function useAuth() {
  const store = useAuthStore();
  const { showError, showSuccess } = useToast();

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      await store.login(email, password);
      showSuccess('Login realizado com sucesso!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao fazer login');
      throw error;
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      await store.register(name, email, password);
      showSuccess('Conta criada com sucesso!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao criar conta');
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await store.logout();
      showSuccess('Logout realizado com sucesso');
    } catch (error) {
      console.error('Logout error:', error);
      // Don't show error for logout, just log it
    }
  };

  const forgotUserPassword = async (email: string) => {
    try {
      await store.forgotPassword(email);
      showSuccess('Email de recuperação enviado!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro ao enviar email');
      throw error;
    }
  };

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    biometricEnabled: store.biometricEnabled,
    
    // Actions with toast feedback
    login: loginWithCredentials,
    register: registerUser,
    logout: logoutUser,
    forgotPassword: forgotUserPassword,
    
    // Direct store actions
    loginWithBiometric: store.loginWithBiometric,
    enableBiometric: store.enableBiometric,
    disableBiometric: store.disableBiometric,
    updateUser: store.updateUser,
    updatePassword: store.updatePassword,
    resetPassword: store.resetPassword,
    checkAuthStatus: store.checkAuthStatus,
    refreshAuth: store.refreshAuth,
  };
}