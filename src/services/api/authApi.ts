import { http } from '../http';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
    lastLoginAt: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegisterResponse extends LoginResponse {}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

class AuthApi {
  /**
   * Authenticate user with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.email === 'admin@vivesaude.com' && data.password === '123456') {
        return {
          user: {
            id: '1',
            email: 'admin@vivesaude.com',
            name: 'Admin User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            createdAt: '2024-01-01T00:00:00Z',
            lastLoginAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600, // 1 hour
        };
      }
      
      throw new Error('Credenciais inválidas');
    }

    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Register new user account
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('Senhas não coincidem');
    }

    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        user: {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      };
    }

    return http<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        token: 'new-mock-jwt-token-' + Date.now(),
        refreshToken: 'new-mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      };
    }

    return http<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock: Forgot password email sent to', data.email);
      return;
    }

    await http<void>('/auth/forgot-password', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Reset password with token from email
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('Senhas não coincidem');
    }

    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock: Password reset for token', data.token);
      return;
    }

    await http<void>('/auth/reset-password', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Change user password (requires authentication)
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Senhas não coincidem');
    }

    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock: Password changed');
      return;
    }

    await http<void>('/auth/change-password', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<LoginResponse['user']> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: '1',
        email: data.email || 'admin@vivesaude.com',
        name: data.name || 'Admin User',
        avatar: data.avatar,
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString(),
      };
    }

    return http<LoginResponse['user']>('/auth/profile', {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<LoginResponse['user']> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        id: '1',
        email: 'admin@vivesaude.com',
        name: 'Admin User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString(),
      };
    }

    return http<LoginResponse['user']>('/auth/profile');
  }

  /**
   * Logout (revoke tokens)
   */
  async logout(): Promise<void> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Mock: User logged out');
      return;
    }

    await http<void>('/auth/logout', {
      method: 'POST',
    });
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Email verified with token', token);
      return;
    }

    await http<void>('/auth/verify-email', {
      method: 'POST',
      body: { token },
    });
  }

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<void> {
    // Mock implementation for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Verification email resent');
      return;
    }

    await http<void>('/auth/resend-verification', {
      method: 'POST',
    });
  }
}

export const authApi = new AuthApi();