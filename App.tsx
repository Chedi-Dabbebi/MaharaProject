import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { SkillsProvider } from './src/context/SkillsContext';
import { SessionProvider } from './src/context/SessionContext';
import { LanguageProvider } from './src/context/LanguageContext';

function AppContent() {
  const { theme } = useTheme();
  
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
