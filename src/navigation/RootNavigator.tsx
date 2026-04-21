import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../screens/LoadingScreen';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { OnboardingNavigator } from './OnboardingNavigator';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function RootNavigator() {
  const { appReady, isAuthenticated, onboardingComplete } = useAuth();

  if (!appReady) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <AuthStack />
      </ErrorBoundary>
    );
  }

  if (!onboardingComplete) {
    return (
      <ErrorBoundary>
        <OnboardingNavigator />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppTabs />
    </ErrorBoundary>
  );
}
