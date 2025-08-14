import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Auth Stack Types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  BiometricSetup: undefined;
};

// Main Tab Types
export type MainTabParamList = {
  Dashboard: undefined;
  Upload: undefined;
  History: undefined;
  Profile: undefined;
};

// Stack Types for each tab
export type DashboardStackParamList = {
  DashboardScreen: undefined;
  ExamDetail: { examId: string };
  ExamAnalysis: { examId: string };
};

export type UploadStackParamList = {
  UploadScreen: undefined;
  ExamAnalysis: { examId: string };
};

export type HistoryStackParamList = {
  HistoryScreen: undefined;
  ExamDetail: { examId: string };
  ExamAnalysis: { examId: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  Settings: undefined;
  Help: undefined;
  Tutorial: undefined;
};

// Root Stack Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Global modals/overlays
  ExamDetail: { examId: string };
  ExamAnalysis: { examId: string };
};

// Navigation props for screens
export type AuthScreenNavigationProp<T extends keyof AuthStackParamList> = StackNavigationProp<
  AuthStackParamList,
  T
>;

export type MainScreenNavigationProp<T extends keyof MainTabParamList> = StackNavigationProp<
  MainTabParamList,
  T
>;

export type RootScreenNavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  T
>;

// Route props for screens
export type AuthScreenRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type MainScreenRouteProp<T extends keyof MainTabParamList> = RouteProp<MainTabParamList, T>;
export type RootScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Combined navigation/route props for convenience
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: AuthScreenNavigationProp<T>;
  route: AuthScreenRouteProp<T>;
};

export type MainScreenProps<T extends keyof MainTabParamList> = {
  navigation: MainScreenNavigationProp<T>;
  route: MainScreenRouteProp<T>;
};

export type RootScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootScreenNavigationProp<T>;
  route: RootScreenRouteProp<T>;
};

// Specific screen props
export type ExamDetailScreenProps = {
  navigation: any;
  route: RouteProp<{ ExamDetail: { examId: string } }, 'ExamDetail'>;
};

export type ExamAnalysisScreenProps = {
  navigation: any;
  route: RouteProp<{ ExamAnalysis: { examId: string } }, 'ExamAnalysis'>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}