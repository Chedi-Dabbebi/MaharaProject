import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoadingScreenProps {
  onFinish?: () => void;
}

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const { colors } = useTheme();

  useEffect(() => {
    if (!onFinish) {
      return;
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.buttonPrimary} />
      <Text style={[styles.text, { color: colors.textPrimary }]}>Chargement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
  },
});
