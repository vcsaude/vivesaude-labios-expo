import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';

// Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import BiometricSetupScreen from '../screens/auth/BiometricSetupScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const screenOptions = {
  headerShown: false,
  cardStyleInterpolator: ({ current }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="BiometricSetup"
        component={BiometricSetupScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}