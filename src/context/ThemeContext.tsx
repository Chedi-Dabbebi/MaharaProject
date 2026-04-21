import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  border: string;
  divider: string;
  hover: string;
  // Backward compatibility alias keys
  cardBackground: string;
  cardBorder: string;
  textTertiary: string;
  iconDefault: string;
  iconActive: string;
  navBackground: string;
  navBorder: string;
  navActiveBg: string;
  buttonPrimary: string;
  inputBackground: string;
  inputBorder: string;
}

const darkTheme: ThemeColors = {
  background: '#0B0F19',
  surface: '#121826',
  surfaceElevated: '#1E293B',
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  textPrimary: '#E5E7EB',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#4ADE80',
  error: '#F87171',
  warning: '#F59E0B',
  info: '#3B82F6',
  border: 'rgba(255, 255, 255, 0.1)',
  divider: 'rgba(255, 255, 255, 0.1)',
  hover: 'rgba(255, 255, 255, 0.05)',
  // Legacy mappings
  cardBackground: '#121826',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  textTertiary: '#64748B',
  iconDefault: '#94A3B8',
  iconActive: '#6366F1',
  navBackground: '#121826',
  navBorder: 'rgba(255, 255, 255, 0.1)',
  navActiveBg: 'rgba(99, 102, 241, 0.1)',
  buttonPrimary: '#6366F1',
  inputBackground: '#121826',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
};

const lightTheme: ThemeColors = {
  background: '#F6F8FF',
  surface: '#FFFFFF',
  surfaceElevated: '#EEF2FF',
  primary: '#4F46E5',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  border: '#E2E8F0',
  divider: '#EEF2F7',
  hover: '#F1F5FF',
  // Legacy mappings
  cardBackground: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textTertiary: '#94A3B8',
  iconDefault: '#475569',
  iconActive: '#4F46E5',
  navBackground: '#FFFFFF',
  navBorder: '#EEF2F7',
  navActiveBg: '#EEF2FF',
  buttonPrimary: '#4F46E5',
  inputBackground: '#FFFFFF',
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
