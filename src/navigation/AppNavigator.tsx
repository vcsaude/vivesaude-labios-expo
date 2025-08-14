import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Modal Screens
import ExamDetailScreen from '../screens/main/ExamDetailScreen';
import ExamAnalysisScreen from '../screens/main/ExamAnalysisScreen';

// Components
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Hooks and stores
import { useAuthStore } from '../store/authStore';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  // Para teste rápido, vamos pular autenticação e ir direto para o app principal
  const isAuthenticated = true; // Força autenticado para mostrar o menu
  
  // Opcional: descomentar para usar autenticação real
  // const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  // const [isInitializing, setIsInitializing] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        {isAuthenticated ? (
          <>
            {/* Main App Stack */}
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{
                animationEnabled: false,
              }}
            />
            
            {/* Global Modal Screens */}
            <Stack.Screen
              name="ExamDetail"
              component={ExamDetailScreen}
              options={{
                presentation: 'modal',
                animationEnabled: true,
                cardStyleInterpolator: ({ current }) => ({
                  cardStyle: {
                    transform: [
                      {
                        translateY: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [600, 0],
                        }),
                      },
                    ],
                  },
                }),
              }}
            />
            
            <Stack.Screen
              name="ExamAnalysis"
              component={ExamAnalysisScreen}
              options={{
                presentation: 'modal',
                animationEnabled: true,
                cardStyleInterpolator: ({ current }) => ({
                  cardStyle: {
                    transform: [
                      {
                        translateY: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [600, 0],
                        }),
                      },
                    ],
                  },
                }),
              }}
            />
          </>
        ) : (
          <>
            {/* Authentication Stack */}
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Custom hook for navigation state persistence (optional)
export function useNavigationPersistence() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        // Here you could restore navigation state from AsyncStorage
        // For now, we'll just set it as ready
        setIsReady(true);
      } catch (e) {
        console.error('Failed to restore navigation state:', e);
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  return { isReady, initialState };
}