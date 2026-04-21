import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const { colors } = useTheme();

  const sizeConfig = {
    sm: { width: 40, height: 40, fontSize: 12 },
    md: { width: 48, height: 48, fontSize: 14 },
    lg: { width: 64, height: 64, fontSize: 16 },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: config.width,
          height: config.height,
          backgroundColor: colors.secondary,
          shadowColor: colors.secondary,
        }
      ]}
    >
      <Text style={[styles.text, { fontSize: config.fontSize, color: '#ffffff' }]}>
        {level}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  text: {
    fontWeight: 'bold',
  },
});
