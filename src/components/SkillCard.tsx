import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from './ui/Icon';
import { ProgressBar } from './ui/ProgressBar';
import { getIconName } from '../utils/iconHelper';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';

interface SkillCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number;
  level: number;
  onPress?: () => void;
}

// Helper to create a lighter version of the color
function lightenColor(color: string, percent: number): string {
  try {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  } catch {
    return color;
  }
}

export function SkillCard({ id, name, icon, color, progress, level, onPress }: SkillCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: colors.surfaceElevated,
          borderColor: `${color}40`,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: color,
            shadowColor: color,
          }
        ]}
      >
        <Icon name={getIconName(icon)} size={32} color="#FFFFFF" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: `${color}25` }
          ]}
        >
          <Text style={[styles.levelText, { color }]}>
            {t('skill_detail_level', { level })}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color={color} height={6} />
        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          {t('skill_card_completed', { progress })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  content: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
