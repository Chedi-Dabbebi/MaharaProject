import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Icon } from '../components/ui/Icon';
import { LevelBadge } from '../components/ui/LevelBadge';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useSkills } from '../hooks/useSkills';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export function ProfileScreen() {
  const { colors, theme } = useTheme();
  const { user, appReady } = useAuth();
  const { skills, totalXP, totalLevel, totalCompletedTasks, isLoading, loadError, reload } = useSkills();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const onNavigateToSettings = () => navigation.navigate('Settings');
  const onNavigateToEdit = () => navigation.navigate('EditProfile');

  if (!appReady || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingState message={t('profile_loading')} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ErrorState message={loadError} onRetry={reload} />
      </View>
    );
  }

  const achievements = [
    { id: 1, name: t('ach_first_step'), description: t('ach_first_step_desc'), earned: totalCompletedTasks >= 1, color: colors.warning },
    { id: 2, name: t('ach_persistent'), description: t('ach_persistent_desc'), earned: skills.some((skill) => skill.streak >= 7), color: '#FF5733' },
    { id: 3, name: t('ach_expert'), description: t('ach_expert_desc'), earned: totalLevel >= 5, color: colors.secondary },
    { id: 4, name: t('ach_versatile'), description: t('ach_versatile_desc'), earned: skills.length >= 4, color: colors.success },
    { id: 5, name: t('ach_marathoner'), description: t('ach_marathoner_desc'), earned: skills.some((skill) => skill.streak >= 30), color: '#4CAF50' },
    { id: 6, name: t('ach_master'), description: t('ach_master_desc'), earned: totalLevel >= 10, color: colors.info },
  ];

  const profile = user ?? {
    name: t('common_user'),
    email: t('common_unknown'),
    initials: 'U',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Settings + Edit */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('profile_title')}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              onPress={onNavigateToEdit}
            >
              <Text style={[styles.editButtonText, { color: colors.buttonPrimary }]}>{t('profile_edit_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.cardBackground }]} onPress={onNavigateToSettings}>
              <Icon name="settings" size={24} color={colors.iconDefault} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                }
              ]}
            >
              <Text style={styles.avatarText}>{profile.initials}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{profile.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{profile.email}</Text>
            </View>

            <LevelBadge level={totalLevel} size="lg" />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{totalXP}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile_total_xp')}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{totalCompletedTasks}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile_sessions')}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <View style={styles.statItem}>
              {user?.weekly_time_budget_minutes ? (
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {user.weekly_time_budget_minutes >= 60
                    ? `${Math.round(user.weekly_time_budget_minutes / 60)}h`
                    : `${user.weekly_time_budget_minutes}m`}
                </Text>
              ) : (
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>–</Text>
              )}
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile_weekly_budget')}</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <Icon name="trophy" size={20} color={colors.textPrimary} />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('profile_achievements')}</Text>
          </View>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  {
                    backgroundColor: achievement.earned
                      ? 'rgba(139, 92, 246, 0.1)'
                      : isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    borderColor: achievement.earned
                      ? 'rgba(139, 92, 246, 0.3)'
                      : colors.cardBorder,
                    opacity: achievement.earned ? 1 : 0.4,
                  }
                ]}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    {
                      backgroundColor: achievement.earned
                        ? `${achievement.color}30`
                        : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    }
                  ]}
                >
                  {achievement.earned ? (
                    <Icon name="trophy" size={20} color={achievement.color} />
                  ) : (
                    <Icon name="lock" size={20} color={colors.textMuted} />
                  )}
                </View>
                <Text style={[styles.achievementName, { color: colors.textPrimary }]} numberOfLines={2}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Settings */}
        <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <TouchableOpacity style={styles.settingsItem} onPress={onNavigateToSettings}>
            <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>{t('profile_settings')}</Text>
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.dividerHorizontal, { backgroundColor: colors.divider}]} />

          <TouchableOpacity style={styles.settingsItem} onPress={onNavigateToSettings}>
            <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>{t('profile_notifications')}</Text>
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.dividerHorizontal, { backgroundColor: colors.divider}]} />

          <TouchableOpacity style={styles.settingsItem} onPress={onNavigateToSettings}>
            <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>{t('profile_dark_mode')}</Text>
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingsItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 24,
  },
  dividerHorizontal: {
    height: 1,
    marginHorizontal: 20,
  },
});
