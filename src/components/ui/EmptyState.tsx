import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Geometric illustration */}
      <View style={styles.illustrationContainer}>
        <View style={[styles.outerCircle, { borderColor: colors.border }]}>
          <View style={[styles.innerCircle, { backgroundColor: colors.surfaceElevated }]}>
            <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.4 }]} />
          </View>
        </View>
        <View style={[styles.smallDot, { backgroundColor: colors.primary, opacity: 0.3 }]} />
        <View style={[styles.smallDot2, { backgroundColor: colors.secondary, opacity: 0.25 }]} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  outerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  smallDot: {
    position: 'absolute',
    top: 8,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  smallDot2: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
