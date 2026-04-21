import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Simple X icon using Views */}
      <View style={[styles.iconWrapper, { backgroundColor: `${colors.error}1A` }]}>
        <View style={[styles.xLine1, { backgroundColor: colors.error }]} />
        <View style={[styles.xLine2, { backgroundColor: colors.error }]} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t('error_state_title')}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message ?? t('error_state_default')}
      </Text>

      {onRetry ? (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>{t('error_retry')}</Text>
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
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  xLine1: {
    position: 'absolute',
    width: 32,
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    position: 'absolute',
    width: 32,
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
