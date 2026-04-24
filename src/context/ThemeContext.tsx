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
  background: '#090C10',
  surface: '#0F141C',
  surfaceElevated: '#161D29',
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  border: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.06)',
  hover: 'rgba(255, 255, 255, 0.04)',
  // Legacy mappings
  cardBackground: '#0F141C',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  textTertiary: '#64748B',
  iconDefault: '#94A3B8',
  iconActive: '#6366F1',
  navBackground: '#0F141C',
  navBorder: 'rgba(255, 255, 255, 0.06)',
  navActiveBg: 'rgba(99, 102, 241, 0.12)',
  buttonPrimary: '#6366F1',
  inputBackground: '#0F141C',
  inputBorder: 'rgba(255, 255, 255, 0.08)',
};

const lightTheme: ThemeColors = {
  background: '#F1F5F9', // Softer grey base
  surface: '#F8FAFC',    // Paper-like surface (off-white)
  surfaceElevated: '#FFFFFF', // Pure white only for high elevation
  primary: '#6366F1',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  hover: '#EDF2F7',
  // Legacy mappings
  cardBackground: '#F8FAFC',
  cardBorder: '#E2E8F0',
  textTertiary: '#64748B',
  iconDefault: '#475569',
  iconActive: '#6366F1',
  navBackground: '#F8FAFC',
  navBorder: '#CBD5E1', // Slightly more defined border for navigation
  navActiveBg: '#E0E7FF',
  buttonPrimary: '#6366F1',
  inputBackground: '#F8FAFC',
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
