import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, DashboardStackParamList, UploadStackParamList, HistoryStackParamList, ProfileStackParamList } from './types';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import UploadScreen from '../screens/UploadScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ExamDetailScreen from '../screens/main/ExamDetailScreen';
import ExamAnalysisScreen from '../screens/main/ExamAnalysisScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpScreen from '../screens/profile/HelpScreen';
import TutorialScreen from '../screens/onboarding/TutorialScreen';

// Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// Stack Navigators for each tab
const DashboardStack = createStackNavigator<DashboardStackParamList>();
const UploadStack = createStackNavigator<UploadStackParamList>();
const HistoryStack = createStackNavigator<HistoryStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const colors = {
  primary: '#1a1a2e',
  secondary: '#64748b',
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: '#1a1a2e',
  textSecondary: '#64748b',
};

const screenOptions = {
  headerShown: false,
  cardStyleInterpolator: ({ current }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};

// Dashboard Stack
function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={screenOptions}
    >
      <DashboardStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
      />
      <DashboardStack.Screen
        name="ExamDetail"
        component={ExamDetailScreen}
      />
      <DashboardStack.Screen
        name="ExamAnalysis"
        component={ExamAnalysisScreen}
      />
    </DashboardStack.Navigator>
  );
}

// Upload Stack
function UploadStackNavigator() {
  return (
    <UploadStack.Navigator
      initialRouteName="UploadScreen"
      screenOptions={screenOptions}
    >
      <UploadStack.Screen
        name="UploadScreen"
        component={UploadScreen}
      />
      <UploadStack.Screen
        name="ExamAnalysis"
        component={ExamAnalysisScreen}
      />
    </UploadStack.Navigator>
  );
}

// History Stack
function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator
      initialRouteName="HistoryScreen"
      screenOptions={screenOptions}
    >
      <HistoryStack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
      />
      <HistoryStack.Screen
        name="ExamDetail"
        component={ExamDetailScreen}
      />
      <HistoryStack.Screen
        name="ExamAnalysis"
        component={ExamAnalysisScreen}
      />
    </HistoryStack.Navigator>
  );
}

// Profile Stack
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={screenOptions}
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <ProfileStack.Screen
        name="Help"
        component={HelpScreen}
      />
      <ProfileStack.Screen
        name="Tutorial"
        component={TutorialScreen}
      />
    </ProfileStack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadStackNavigator}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

