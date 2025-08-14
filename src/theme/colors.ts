/**
 * Design System - Color Palette
 * ViveSaude Lábios Color System
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary Colors
  secondary: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },

  // Health/Medical Theme
  health: {
    success: '#10b981', // Green for healthy values
    warning: '#f59e0b', // Amber for borderline values
    danger: '#ef4444',  // Red for abnormal values
    info: '#3b82f6',    // Blue for informational
  },

  // Semantic Colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    overlay: 'rgba(0, 0, 0, 0.5)',
    card: '#ffffff',
  },

  // Text Colors
  text: {
    primary: '#1a1a2e',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
    disabled: '#cbd5e1',
  },

  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
    focus: '#0ea5e9',
  },

  // Chart Colors (for medical data visualization)
  chart: {
    primary: '#0ea5e9',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444',
    grid: '#e2e8f0',
    axis: '#94a3b8',
  },
} as const;

// Theme variants
export const lightTheme = {
  ...colors,
  isDark: false,
} as const;

export const darkTheme = {
  ...colors,
  // Override colors for dark theme
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    overlay: 'rgba(0, 0, 0, 0.8)',
    card: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
    disabled: '#64748b',
  },
  isDark: true,
} as const;

export type Theme = typeof lightTheme;
export type ColorKey = keyof typeof colors;