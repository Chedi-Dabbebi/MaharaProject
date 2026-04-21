import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from './ui/Icon';
import { XPBadge } from './ui/XPBadge';
import { useTheme } from '../context/ThemeContext';

interface TaskItemProps {
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
  onToggle: () => void;
}

export function TaskItem({ title, duration, xp, completed, onToggle }: TaskItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
        completed && { opacity: 0.5 },
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: completed ? colors.secondary : 'transparent',
            borderColor: completed ? colors.secondary : colors.textMuted,
          }
        ]}
      >
        {completed && (
          <Icon name="checkmark" size={14} color="#FFFFFF" />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: completed ? colors.textMuted : colors.textPrimary },
            completed && styles.titleCompleted,
          ]}
        >
          {title}
        </Text>
        <View style={styles.durationContainer}>
          <Icon name="time" size={12} color={colors.textSecondary} />
          <Text style={[styles.duration, { color: colors.textSecondary }]}>{duration}</Text>
        </View>
      </View>

      {/* XP Badge */}
      <XPBadge xp={xp} active={!completed} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  completed: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
  },
});
