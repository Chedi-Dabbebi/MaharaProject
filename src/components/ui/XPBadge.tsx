import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md';
  active?: boolean;
}

export function XPBadge({ xp, size = 'sm', active = false }: XPBadgeProps) {
  const sizeStyles = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.container,
        sizeStyles[size],
        active && styles.active,
      ]}
    >
      <Text style={styles.icon}>{active ? '✨' : '✨'}</Text>
      <Text style={styles.text}>{xp} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  text: {
    color: '#C4B5FD',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 14,
  },
  active: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
});
