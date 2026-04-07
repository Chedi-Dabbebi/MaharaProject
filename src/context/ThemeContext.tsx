import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  background: string;
  cardBackground: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  iconDefault: string;
  iconActive: string;
  divider: string;
  navBackground: string;
  navBorder: string;
  navActiveBg: string;
  buttonPrimary: string;
  inputBackground: string;
  inputBorder: string;
}

const darkTheme: ThemeColors = {
  background: '#311D3F',
  cardBackground: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  iconDefault: '#94A3B8',
  iconActive: '#E23E57',
  divider: 'rgba(255, 255, 255, 0.1)',
  navBackground: 'rgba(255, 255, 255, 0.05)',
  navBorder: 'rgba(255, 255, 255, 0.1)',
  navActiveBg: 'rgba(226, 62, 87, 0.1)',
  buttonPrimary: '#E23E57',
  inputBackground: 'rgba(255, 255, 255, 0.05)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
};

const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  iconDefault: '#64748B',
  iconActive: '#E23E57',
  divider: '#E2E8F0',
  navBackground: '#FFFFFF',
  navBorder: '#E2E8F0',
  navActiveBg: 'rgba(226, 62, 87, 0.1)',
  buttonPrimary: '#E23E57',
  inputBackground: '#F1F5F9',
  inputBorder: '#E2E8F0',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
}

export function ThemeProvider({ children, initialTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
