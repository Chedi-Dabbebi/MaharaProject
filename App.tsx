import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SkillDetailScreen } from './src/screens/SkillDetailScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { BottomNavigation } from './src/components/BottomNavigation';
import { skills } from './src/data/skills';

type Screen = 'loading' | 'login' | 'home' | 'skillDetail' | 'plan' | 'stats' | 'profile';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

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

  const selectedSkill = skills.find((s) => s.id === selectedSkillId);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return <LoadingScreen onFinish={() => handleNavigate('login')} />;
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
        return <ProfileScreen />;
      default:
        return <HomeScreen onSkillPress={handleSkillPress} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      {currentScreen !== 'loading' && currentScreen !== 'login' && (
        <BottomNavigation activeScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#311D3F',
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;
