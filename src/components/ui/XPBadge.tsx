import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md';
  active?: boolean;
}

export function XPBadge({ xp, size = 'sm', active = false }: XPBadgeProps) {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.container,
        sizeStyles[size],
        { backgroundColor: `${colors.secondary}33`, borderColor: `${colors.secondary}4D` },
        active && styles.active,
      ]}
    >
      <Text style={styles.icon}>✨</Text>
      <Text style={[styles.text, { color: colors.primary }]}>{xp} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  text: {
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 14,
  },
  active: {
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
});
