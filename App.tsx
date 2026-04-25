import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { SkillsProvider } from './src/context/SkillsContext';
import { SessionProvider } from './src/context/SessionContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';

function AppContent() {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = React.useState(true);
  
  if (showSplash) {
    return <AnimatedSplashScreen onAnimationEnd={() => setShowSplash(false)} />;
  }

  return (
    <>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider initialTheme="dark">
        <AuthProvider>
          <SkillsProvider>
            <SessionProvider>
              <AppContent />
            </SessionProvider>
          </SkillsProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
