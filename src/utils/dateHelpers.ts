/**
 * Date formatting utilities for ViveSaude L�bios
 */

/**
 * Format a date to a localized Brazilian format
 */
export const formatDate = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Data inv�lida';
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return 'Data inv�lida';
  }
};

/**
 * Format a date to include time
 */
export const formatDateTime = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return 'Data inv�lida';
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Data inv�lida';
  }
};

/**
 * Format date as relative time (e.g., "2 horas atr�s")
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return 'Data inv�lida';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora mesmo';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minuto atr�s' : `${diffInMinutes} minutos atr�s`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hora atr�s' : `${diffInHours} horas atr�s`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return diffInDays === 1 ? '1 dia atr�s' : `${diffInDays} dias atr�s`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 semana atr�s' : `${diffInWeeks} semanas atr�s`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 m�s atr�s' : `${diffInMonths} meses atr�s`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? '1 ano atr�s' : `${diffInYears} anos atr�s`;
  } catch (error) {
    return 'Data inv�lida';
  }
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string | Date): boolean => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const today = new Date();
    
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (dateString: string | Date): boolean => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Format date for medical context (more formal)
 */
export const formatMedicalDate = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return 'Data inv�lida';
    }

    const months = [
      'janeiro', 'fevereiro', 'mar�o', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  } catch (error) {
    return 'Data inv�lida';
  }
};

/**
 * Get age from birth date
 */
export const calculateAge = (birthDateString: string | Date): number => {
  try {
    const birthDate = typeof birthDateString === 'string' ? new Date(birthDateString) : birthDateString;
    const today = new Date();
    
    if (isNaN(birthDate.getTime())) {
      return 0;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return Math.max(0, age);
  } catch (error) {
    return 0;
  }
};

/**
 * Format time duration (e.g., for exam processing time)
 */
export const formatDuration = (startDate: string | Date, endDate?: string | Date): string => {
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Dura��o inv�lida';
    }

    const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      const seconds = diffInSeconds % 60;
      return seconds > 0 ? `${diffInMinutes}m ${seconds}s` : `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return minutes > 0 ? `${diffInHours}h ${minutes}m` : `${diffInHours}h`;
  } catch (error) {
    return 'Dura��o inv�lida';
  }
};