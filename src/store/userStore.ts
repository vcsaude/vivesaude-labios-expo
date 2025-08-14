import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  notifications: {
    enabled: boolean;
    examResults: boolean;
    appointments: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reduceMotion: boolean;
    voiceOver: boolean;
  };
  privacy: {
    shareAnonymousData: boolean;
    allowAnalytics: boolean;
    biometricAuth: boolean;
  };
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
}

interface UserState {
  // State
  profile: UserProfile | null;
  preferences: UserPreferences;
  isLoading: boolean;
  
  // Actions
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateNotificationSettings: (notifications: Partial<UserPreferences['notifications']>) => Promise<void>;
  updateAccessibilitySettings: (accessibility: Partial<UserPreferences['accessibility']>) => Promise<void>;
  updatePrivacySettings: (privacy: Partial<UserPreferences['privacy']>) => Promise<void>;
  
  // Medical info actions
  addAllergy: (allergy: string) => Promise<void>;
  removeAllergy: (allergy: string) => Promise<void>;
  addMedication: (medication: string) => Promise<void>;
  removeMedication: (medication: string) => Promise<void>;
  addCondition: (condition: string) => Promise<void>;
  removeCondition: (condition: string) => Promise<void>;
  updateEmergencyContact: (contact: UserProfile['medicalInfo']['emergencyContact']) => Promise<void>;
  
  // Utility actions
  resetPreferences: () => void;
  exportUserData: () => Promise<string>;
  deleteUserData: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt-BR',
  notifications: {
    enabled: true,
    examResults: true,
    appointments: true,
    reminders: true,
    marketing: false,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    voiceOver: false,
  },
  privacy: {
    shareAnonymousData: false,
    allowAnalytics: true,
    biometricAuth: false,
  },
};

// Mock API functions
const userApi = {
  updateProfile: async (profileData: Partial<UserProfile>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return profileData;
  },
  
  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return preferences;
  },
  
  exportUserData: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'file://path/to/user_data_export.json';
  },
  
  deleteUserData: async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Mock data deletion process
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      preferences: defaultPreferences,
      isLoading: false,

      // Update profile
      updateProfile: async (profileData: Partial<UserProfile>) => {
        set({ isLoading: true });
        
        try {
          const updatedData = await userApi.updateProfile(profileData);
          
          set(state => ({
            profile: state.profile ? { ...state.profile, ...updatedData } : updatedData as UserProfile,
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Update preferences
      updatePreferences: async (preferencesUpdate: Partial<UserPreferences>) => {
        try {
          await userApi.updatePreferences(preferencesUpdate);
          
          set(state => ({
            preferences: {
              ...state.preferences,
              ...preferencesUpdate,
            },
          }));
        } catch (error) {
          throw error;
        }
      },

      // Update notification settings
      updateNotificationSettings: async (notifications: Partial<UserPreferences['notifications']>) => {
        try {
          const updatedPreferences = {
            notifications: {
              ...get().preferences.notifications,
              ...notifications,
            },
          };
          
          await get().updatePreferences(updatedPreferences);
        } catch (error) {
          throw error;
        }
      },

      // Update accessibility settings
      updateAccessibilitySettings: async (accessibility: Partial<UserPreferences['accessibility']>) => {
        try {
          const updatedPreferences = {
            accessibility: {
              ...get().preferences.accessibility,
              ...accessibility,
            },
          };
          
          await get().updatePreferences(updatedPreferences);
        } catch (error) {
          throw error;
        }
      },

      // Update privacy settings
      updatePrivacySettings: async (privacy: Partial<UserPreferences['privacy']>) => {
        try {
          const updatedPreferences = {
            privacy: {
              ...get().preferences.privacy,
              ...privacy,
            },
          };
          
          await get().updatePreferences(updatedPreferences);
        } catch (error) {
          throw error;
        }
      },

      // Add allergy
      addAllergy: async (allergy: string) => {
        const { profile } = get();
        
        if (!profile) {
          throw new Error('Perfil não encontrado');
        }
        
        const currentAllergies = profile.medicalInfo?.allergies || [];
        
        if (currentAllergies.includes(allergy)) {
          return; // Already exists
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            allergies: [...currentAllergies, allergy],
          },
        });
      },

      // Remove allergy
      removeAllergy: async (allergy: string) => {
        const { profile } = get();
        
        if (!profile?.medicalInfo?.allergies) {
          return;
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            allergies: profile.medicalInfo.allergies.filter(a => a !== allergy),
          },
        });
      },

      // Add medication
      addMedication: async (medication: string) => {
        const { profile } = get();
        
        if (!profile) {
          throw new Error('Perfil não encontrado');
        }
        
        const currentMedications = profile.medicalInfo?.medications || [];
        
        if (currentMedications.includes(medication)) {
          return; // Already exists
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            medications: [...currentMedications, medication],
          },
        });
      },

      // Remove medication
      removeMedication: async (medication: string) => {
        const { profile } = get();
        
        if (!profile?.medicalInfo?.medications) {
          return;
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            medications: profile.medicalInfo.medications.filter(m => m !== medication),
          },
        });
      },

      // Add condition
      addCondition: async (condition: string) => {
        const { profile } = get();
        
        if (!profile) {
          throw new Error('Perfil não encontrado');
        }
        
        const currentConditions = profile.medicalInfo?.conditions || [];
        
        if (currentConditions.includes(condition)) {
          return; // Already exists
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            conditions: [...currentConditions, condition],
          },
        });
      },

      // Remove condition
      removeCondition: async (condition: string) => {
        const { profile } = get();
        
        if (!profile?.medicalInfo?.conditions) {
          return;
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            conditions: profile.medicalInfo.conditions.filter(c => c !== condition),
          },
        });
      },

      // Update emergency contact
      updateEmergencyContact: async (contact: UserProfile['medicalInfo']['emergencyContact']) => {
        const { profile } = get();
        
        if (!profile) {
          throw new Error('Perfil não encontrado');
        }
        
        await get().updateProfile({
          medicalInfo: {
            ...profile.medicalInfo,
            emergencyContact: contact,
          },
        });
      },

      // Reset preferences
      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      // Export user data
      exportUserData: async () => {
        try {
          const filePath = await userApi.exportUserData();
          return filePath;
        } catch (error) {
          throw error;
        }
      },

      // Delete user data
      deleteUserData: async () => {
        set({ isLoading: true });
        
        try {
          await userApi.deleteUserData();
          
          // Clear all user data
          set({
            profile: null,
            preferences: defaultPreferences,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'vivesaude-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);