import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Icon } from '../components/ui/Icon';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useTheme } from '../context/ThemeContext';
import { getIconName } from '../utils/iconHelper';
import { useSkills } from '../hooks/useSkills';
import { useTranslation } from '../i18n';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

export function StatsScreen() {
  const { colors, theme } = useTheme();
  const { skills, totalXP, totalLevel, longestStreak, totalCompletedTasks, totalTasks, isLoading, loadError, reload } = useSkills();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const weeklyData = [
    { day: t('common_mon'), completion: 80 },
    { day: t('common_tue'), completion: 60 },
    { day: t('common_wed'), completion: 100 },
    { day: t('common_thu'), completion: 40 },
    { day: t('common_fri'), completion: 90 },
    { day: t('common_sat'), completion: 70 },
    { day: t('common_sun'), completion: 50 },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingState message={t('stats_loading')} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message={loadError} onRetry={reload} />
      </View>
    );
  }

  if (totalCompletedTasks === 0 && totalXP === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title={t('stats_empty_title')}
          subtitle={t('stats_empty_subtitle')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('stats_title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('stats_subtitle')}</Text>
        </View>

        {/* Total XP Card */}
        <View style={[styles.xpCard, { backgroundColor: colors.primary }]}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>{t('stats_total_xp')}</Text>
            <View style={styles.sparkleContainer}>
              <Icon name="sparkle" size={20} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.xpValue}>{totalXP.toLocaleString()}</Text>
          <Text style={styles.xpSubtext}>{t('stats_global_level', { level: totalLevel })}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Streak Card */}
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: 'rgba(245, 158, 11, 0.15)' }
              ]}
            >
              <Icon name="fire" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{longestStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats_streak_days')}</Text>
          </View>

          {/* Achievements Card */}
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: 'rgba(139, 92, 246, 0.15)' }
              ]}
            >
              <Icon name="trophy" size={20} color="#8B5CF6" />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{totalCompletedTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats_achievements_unlocked')}</Text>
          </View>
        </View>

        {/* Weekly Completion */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            {t('stats_weekly_completion', { completed: totalCompletedTasks, total: totalTasks })}
          </Text>
          <View style={styles.barChart}>
            {weeklyData.map((item) => (
              <View key={item.day} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${item.completion}%`,
                        backgroundColor: item.completion >= 70 ? colors.primary : colors.textMuted,
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Skills Progress */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('stats_skill_mastery')}</Text>
          <View style={styles.skillsList}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillRow}>
                <View style={styles.skillInfo}>
                  <Icon name={getIconName(skill.icon)} size={16} color={isDark ? '#E5E7EB' : colors.textPrimary} />
                  <Text style={[styles.skillName, { color: colors.textPrimary }]}>{skill.name}</Text>
                </View>
                <View style={styles.skillProgress}>
                  <View style={styles.progressBarWrapper}>
                    <ProgressBar progress={skill.progress} color={skill.color} height={8} />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>{skill.progress}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  xpCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 12,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sparkleContainer: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderRadius: 10,
    padding: 4,
  },
  xpValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  xpSubtext: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    gap: 8,
  },
  barWrapper: {
    width: 24,
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  skillsList: {
    gap: 16,
  },
  skillRow: {
    gap: 12,
  },
  skillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 44,
    flexShrink: 0,
    textAlign: 'right',
  },
});
