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
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: isDark ? `${colors.primary}10` : colors.surfaceElevated,
          borderColor: isDark ? `${colors.primary}25` : colors.border,
          borderWidth: 1.5,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Background Ambient Icon Watermark */}
      <View style={styles.ambientIconContainer}>
        <Icon 
          name={getIconName(icon)} 
          size={110} 
          color={isDark ? `${colors.primary}20` : 'rgba(0,0,0,0.08)'} 
        />
      </View>

      {/* Header: Small precise icon + Level Badge */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.smallIconWrapper,
            { 
              backgroundColor: isDark ? colors.primary : colors.primary, 
              shadowColor: colors.primary,
              borderWidth: 1.5,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
            }
          ]}
        >
          <Icon name={getIconName(icon)} size={20} color="#FFFFFF" />
        </View>
        <View style={[styles.levelBadge, { backgroundColor: isDark ? `${colors.primary}20` : `${colors.primary}10` }]}>
          <Text style={[styles.levelText, { color: colors.primary }]}>
            {t('skill_detail_level', { level })}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={2}>
          {name}
        </Text>
      </View>

      {/* Progress Footer */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {t('skill_card_completed', { progress })}
          </Text>
        </View>
        <ProgressBar progress={progress} color={colors.primary} height={4} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  ambientIconContainer: {
    position: 'absolute',
    right: -25,
    bottom: -15,
    zIndex: -1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  smallIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
