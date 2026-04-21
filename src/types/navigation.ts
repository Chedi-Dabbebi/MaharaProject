import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  EmailVerification: { email: string };
};

export type OnboardingStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingLanguage: undefined;
  OnboardingSetup: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  SkillDetail: { skillId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  EditProfile: undefined;
};

export type AppTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  PlanTab: undefined;
  StatsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppTabsParamList, AuthStackParamList, HomeStackParamList, ProfileStackParamList, OnboardingStackParamList {}
  }
}
