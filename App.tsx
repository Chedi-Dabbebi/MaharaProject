import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppStateProvider, useAppState } from './src/context/AppStateContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { SkillDetailScreen } from './src/screens/SkillDetailScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { BottomNavigation } from './src/components/BottomNavigation';

type Screen = 'loading' | 'login' | 'home' | 'skillDetail' | 'plan' | 'stats' | 'profile' | 'settings';

function AppContent() {
  const { theme, colors } = useTheme();
  const { appReady, isAuthenticated, getSkillById, logout } = useAppState();
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  useEffect(() => {
    if (!appReady) {
      setCurrentScreen('loading');
      return;
    }

    if (!isAuthenticated) {
      setCurrentScreen('login');
      return;
    }

    setCurrentScreen((screen) => (screen === 'loading' || screen === 'login' ? 'home' : screen));
  }, [appReady, isAuthenticated]);

  const handleSkillPress = (skillId: string) => {
    setSelectedSkillId(skillId);
    setCurrentScreen('skillDetail');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedSkillId(null);
  };

  const handleLogout = () => {
    void logout();
    setSelectedSkillId(null);
    setCurrentScreen('login');
  };

  const selectedSkill = getSkillById(selectedSkillId);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return <LoadingScreen />;
      case 'login':
        return <LoginScreen onLogin={() => handleNavigate('home')} />;
      case 'home':
        return <HomeScreen onSkillPress={handleSkillPress} />;
      case 'skillDetail':
        return selectedSkill ? (
          <SkillDetailScreen skill={selectedSkill} onBack={handleBack} />
        ) : (
          <HomeScreen onSkillPress={handleSkillPress} />
        );
      case 'plan':
        return <PlanScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'profile':
        return <ProfileScreen onNavigateToSettings={() => setCurrentScreen('settings')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('profile')} onLogout={handleLogout} />;
      default:
        return <HomeScreen onSkillPress={handleSkillPress} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>{renderScreen()}</View>
      {currentScreen !== 'loading' && currentScreen !== 'login' && (
        <BottomNavigation activeScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </View>
  );
}

const App = () => {
  return (
    <ThemeProvider initialTheme="dark">
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;
