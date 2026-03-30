import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { XPBadge } from './ui/XPBadge';

interface TaskItemProps {
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
  onToggle: () => void;
}

export function TaskItem({ title, duration, xp, completed, onToggle }: TaskItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        completed && styles.completed,
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: completed ? '#8B5CF6' : 'transparent',
            borderColor: completed ? '#8B5CF6' : 'rgba(255, 255, 255, 0.3)',
          }
        ]}
      >
        {completed && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            completed && styles.titleCompleted,
          ]}
        >
          {title}
        </Text>
        <View style={styles.durationContainer}>
          <Text style={styles.clockIcon}>⏱</Text>
          <Text style={styles.duration}>{duration}</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  titleCompleted: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  duration: {
    color: '#94A3B8',
    fontSize: 12,
  },
  clockIcon: {
    fontSize: 12,
  },
});
