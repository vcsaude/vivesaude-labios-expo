/**
 * Validation utilities for ViveSaude Lábios
 * Medical-grade validation patterns
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation with medical domain priorities
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  // Check for medical domain preferences
  const medicalDomains = ['vivesaude.com', 'gmail.com', 'hotmail.com', 'outlook.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain && medicalDomains.includes(domain)) {
    return { isValid: true };
  }

  return { isValid: true };
};

// Password validation for healthcare security standards
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Senha muito longa (máximo 128 caracteres)' };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUppercase) {
    return { isValid: false, error: 'Senha deve conter pelo menos uma letra maiúscula' };
  }

  if (!hasLowercase) {
    return { isValid: false, error: 'Senha deve conter pelo menos uma letra minúscula' };
  }

  if (!hasNumber) {
    return { isValid: false, error: 'Senha deve conter pelo menos um número' };
  }

  if (!hasSpecialChar) {
    return { isValid: false, error: 'Senha deve conter pelo menos um caractere especial' };
  }

  // Common weak passwords check
  const weakPasswords = [
    'password', '123456789', 'qwertyuio', 'abc123456',
    'password123', '123456abc', 'vivesaude123'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'Esta senha é muito comum. Escolha uma senha mais segura' };
  }

  return { isValid: true };
};

// Password confirmation validation
export const validatePasswordConfirm = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Confirmação de senha é obrigatória' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Senhas não coincidem' };
  }

  return { isValid: true };
};

// Name validation for medical professionals
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Nome muito longo (máximo 100 caracteres)' };
  }

  // Check for at least first and last name
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2) {
    return { isValid: false, error: 'Por favor, informe nome e sobrenome' };
  }

  // Basic name format validation
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos' };
  }

  return { isValid: true };
};

// Phone validation (optional but recommended for medical apps)
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true }; // Optional field
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Brazilian phone number validation
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { isValid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
  }

  // Check for valid area codes (Brazil)
  const areaCode = cleanPhone.substring(0, 2);
  const validAreaCodes = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
    '21', '22', '24', // RJ
    '27', '28', // ES
    '31', '32', '33', '34', '35', '37', '38', // MG
    '41', '42', '43', '44', '45', '46', // PR
    '47', '48', '49', // SC
    '51', '53', '54', '55', // RS
    '61', // DF
    '62', '64', // GO
    '65', '66', // MT
    '67', // MS
    '68', // AC
    '69', // RO
    '71', '73', '74', '75', '77', // BA
    '79', // SE
    '81', '87', // PE
    '82', // AL
    '83', // PB
    '84', // RN
    '85', '88', // CE
    '86', '89', // PI
    '91', '93', '94', // PA
    '92', '97', // AM
    '95', // RR
    '96', // AP
    '98', '99', // MA
  ];

  if (!validAreaCodes.includes(areaCode)) {
    return { isValid: false, error: 'Código de área inválido' };
  }

  return { isValid: true };
};

// Medical license validation (CRM, CRO, etc.)
export const validateMedicalLicense = (license: string, type: 'CRM' | 'CRO' | 'CRF' | 'OTHER' = 'CRM'): ValidationResult => {
  if (!license) {
    return { isValid: true }; // Optional field
  }

  // Remove spaces and special characters
  const cleanLicense = license.replace(/\D/g, '');

  switch (type) {
    case 'CRM':
      if (cleanLicense.length < 4 || cleanLicense.length > 6) {
        return { isValid: false, error: 'CRM deve ter entre 4 e 6 dígitos' };
      }
      break;
    case 'CRO':
      if (cleanLicense.length < 4 || cleanLicense.length > 7) {
        return { isValid: false, error: 'CRO deve ter entre 4 e 7 dígitos' };
      }
      break;
    case 'CRF':
      if (cleanLicense.length < 4 || cleanLicense.length > 6) {
        return { isValid: false, error: 'CRF deve ter entre 4 e 6 dígitos' };
      }
      break;
    default:
      if (cleanLicense.length < 4 || cleanLicense.length > 10) {
        return { isValid: false, error: 'Número de registro inválido' };
      }
  }

  return { isValid: true };
};

// Form validation utilities
export const validateForm = (fields: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(rules).forEach(([fieldName, validator]) => {
    const result = validator(fields[fieldName]);
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Password strength calculator
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
} => {
  if (!password) {
    return { score: 0, label: 'Muito fraca', color: '#ef4444', suggestions: [] };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 8) score += 25;
  else suggestions.push('Use pelo menos 8 caracteres');

  if (password.length >= 12) score += 10;

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  else suggestions.push('Adicione letras minúsculas');

  if (/[A-Z]/.test(password)) score += 15;
  else suggestions.push('Adicione letras maiúsculas');

  if (/\d/.test(password)) score += 15;
  else suggestions.push('Adicione números');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20;
  else suggestions.push('Adicione símbolos especiais');

  // Avoid common patterns
  if (!/(.)\1{2,}/.test(password)) score += 5; // No repeated chars
  if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 5; // No sequences

  let label = 'Muito fraca';
  let color = '#ef4444';

  if (score >= 90) {
    label = 'Muito forte';
    color = '#10b981';
  } else if (score >= 70) {
    label = 'Forte';
    color = '#16a34a';
  } else if (score >= 50) {
    label = 'Moderada';
    color = '#f59e0b';
  } else if (score >= 25) {
    label = 'Fraca';
    color = '#f97316';
  }

  return { score, label, color, suggestions };
};