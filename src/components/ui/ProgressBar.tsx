import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color, height = 8 }: ProgressBarProps) {
  const { colors } = useTheme();
  const barColor = color ?? colors.secondary;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: 'rgba(255, 255, 255, 0.1)' }
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 9999,
  },
});
