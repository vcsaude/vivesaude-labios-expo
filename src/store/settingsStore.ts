import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  // App behavior
  autoSync: boolean;
  offline: boolean;
  cacheExpiry: number; // in hours
  maxFileSize: number; // in MB
  
  // UI/UX settings
  showOnboarding: boolean;
  showTips: boolean;
  animationsEnabled: boolean;
  hapticsEnabled: boolean;
  
  // Security settings
  sessionTimeout: number; // in minutes
  autoLock: boolean;
  requireBiometricForSensitiveData: boolean;
  
  // Data management
  autoDeleteOldExams: boolean;
  examRetentionDays: number;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Advanced settings
  debugMode: boolean;
  crashReporting: boolean;
  performanceMonitoring: boolean;
  betaFeatures: boolean;
}

interface SettingsState {
  // State
  settings: AppSettings;
  isLoading: boolean;
  lastSyncAt: string | null;
  
  // Actions
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  
  // Sync actions
  syncSettings: () => Promise<void>;
  
  // Import/Export
  exportSettings: () => Promise<string>;
  importSettings: (filePath: string) => Promise<void>;
  
  // Validation
  validateSettings: (settings: Partial<AppSettings>) => { valid: boolean; errors: string[] };
  
  // Getters
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K];
  getSettingsGroup: (group: 'security' | 'ui' | 'data' | 'advanced') => Partial<AppSettings>;
}

const defaultSettings: AppSettings = {
  // App behavior
  autoSync: true,
  offline: false,
  cacheExpiry: 24, // 24 hours
  maxFileSize: 50, // 50MB
  
  // UI/UX settings
  showOnboarding: true,
  showTips: true,
  animationsEnabled: true,
  hapticsEnabled: true,
  
  // Security settings
  sessionTimeout: 30, // 30 minutes
  autoLock: true,
  requireBiometricForSensitiveData: false,
  
  // Data management
  autoDeleteOldExams: false,
  examRetentionDays: 365, // 1 year
  backupEnabled: true,
  backupFrequency: 'weekly',
  
  // Advanced settings
  debugMode: false,
  crashReporting: true,
  performanceMonitoring: true,
  betaFeatures: false,
};

// Mock API functions
const settingsApi = {
  updateSettings: async (settings: Partial<AppSettings>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return settings;
  },
  
  syncSettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return defaultSettings; // Mock server settings
  },
  
  exportSettings: async (settings: AppSettings) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'file://path/to/settings_export.json';
  },
  
  importSettings: async (filePath: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return defaultSettings; // Mock imported settings
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: defaultSettings,
      isLoading: false,
      lastSyncAt: null,

      // Update single setting
      updateSetting: async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        try {
          const updatedSettings = { [key]: value };
          
          // Validate the setting
          const validation = get().validateSettings(updatedSettings);
          if (!validation.valid) {
            throw new Error(`Settings validation failed: ${validation.errors.join(', ')}`);
          }
          
          await settingsApi.updateSettings(updatedSettings);
          
          set(state => ({
            settings: {
              ...state.settings,
              [key]: value,
            },
          }));
        } catch (error) {
          throw error;
        }
      },

      // Update multiple settings
      updateSettings: async (settingsUpdate: Partial<AppSettings>) => {
        set({ isLoading: true });
        
        try {
          // Validate all settings
          const validation = get().validateSettings(settingsUpdate);
          if (!validation.valid) {
            throw new Error(`Settings validation failed: ${validation.errors.join(', ')}`);
          }
          
          await settingsApi.updateSettings(settingsUpdate);
          
          set(state => ({
            settings: {
              ...state.settings,
              ...settingsUpdate,
            },
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Reset settings to default
      resetSettings: async () => {
        set({ isLoading: true });
        
        try {
          await settingsApi.updateSettings(defaultSettings);
          
          set({
            settings: defaultSettings,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Sync settings with server
      syncSettings: async () => {
        set({ isLoading: true });
        
        try {
          const serverSettings = await settingsApi.syncSettings();
          
          set({
            settings: {
              ...get().settings,
              ...serverSettings,
            },
            lastSyncAt: new Date().toISOString(),
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Export settings
      exportSettings: async () => {
        try {
          const filePath = await settingsApi.exportSettings(get().settings);
          return filePath;
        } catch (error) {
          throw error;
        }
      },

      // Import settings
      importSettings: async (filePath: string) => {
        set({ isLoading: true });
        
        try {
          const importedSettings = await settingsApi.importSettings(filePath);
          
          // Validate imported settings
          const validation = get().validateSettings(importedSettings);
          if (!validation.valid) {
            throw new Error(`Imported settings validation failed: ${validation.errors.join(', ')}`);
          }
          
          set({
            settings: {
              ...defaultSettings,
              ...importedSettings,
            },
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Validate settings
      validateSettings: (settings: Partial<AppSettings>) => {
        const errors: string[] = [];
        
        // Validate numeric ranges
        if (settings.cacheExpiry !== undefined && (settings.cacheExpiry < 1 || settings.cacheExpiry > 168)) {
          errors.push('Cache expiry must be between 1 and 168 hours');
        }
        
        if (settings.maxFileSize !== undefined && (settings.maxFileSize < 1 || settings.maxFileSize > 500)) {
          errors.push('Max file size must be between 1 and 500 MB');
        }
        
        if (settings.sessionTimeout !== undefined && (settings.sessionTimeout < 5 || settings.sessionTimeout > 480)) {
          errors.push('Session timeout must be between 5 and 480 minutes');
        }
        
        if (settings.examRetentionDays !== undefined && (settings.examRetentionDays < 30 || settings.examRetentionDays > 3650)) {
          errors.push('Exam retention must be between 30 and 3650 days');
        }
        
        // Validate enum values
        if (settings.backupFrequency !== undefined && !['daily', 'weekly', 'monthly'].includes(settings.backupFrequency)) {
          errors.push('Backup frequency must be daily, weekly, or monthly');
        }
        
        return {
          valid: errors.length === 0,
          errors,
        };
      },

      // Get single setting
      getSetting: <K extends keyof AppSettings>(key: K) => {
        return get().settings[key];
      },

      // Get settings group
      getSettingsGroup: (group: 'security' | 'ui' | 'data' | 'advanced') => {
        const { settings } = get();
        
        switch (group) {
          case 'security':
            return {
              sessionTimeout: settings.sessionTimeout,
              autoLock: settings.autoLock,
              requireBiometricForSensitiveData: settings.requireBiometricForSensitiveData,
            };
          
          case 'ui':
            return {
              showOnboarding: settings.showOnboarding,
              showTips: settings.showTips,
              animationsEnabled: settings.animationsEnabled,
              hapticsEnabled: settings.hapticsEnabled,
            };
          
          case 'data':
            return {
              autoSync: settings.autoSync,
              offline: settings.offline,
              cacheExpiry: settings.cacheExpiry,
              maxFileSize: settings.maxFileSize,
              autoDeleteOldExams: settings.autoDeleteOldExams,
              examRetentionDays: settings.examRetentionDays,
              backupEnabled: settings.backupEnabled,
              backupFrequency: settings.backupFrequency,
            };
          
          case 'advanced':
            return {
              debugMode: settings.debugMode,
              crashReporting: settings.crashReporting,
              performanceMonitoring: settings.performanceMonitoring,
              betaFeatures: settings.betaFeatures,
            };
          
          default:
            return {};
        }
      },
    }),
    {
      name: 'vivesaude-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hooks for specific setting groups
export const useSecuritySettings = () => {
  const store = useSettingsStore();
  return {
    ...store.getSettingsGroup('security'),
    updateSetting: store.updateSetting,
    isLoading: store.isLoading,
  };
};

export const useUISettings = () => {
  const store = useSettingsStore();
  return {
    ...store.getSettingsGroup('ui'),
    updateSetting: store.updateSetting,
    isLoading: store.isLoading,
  };
};

export const useDataSettings = () => {
  const store = useSettingsStore();
  return {
    ...store.getSettingsGroup('data'),
    updateSetting: store.updateSetting,
    isLoading: store.isLoading,
  };
};

export const useAdvancedSettings = () => {
  const store = useSettingsStore();
  return {
    ...store.getSettingsGroup('advanced'),
    updateSetting: store.updateSetting,
    isLoading: store.isLoading,
  };
};