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
import { useAppState } from '../context/AppStateContext';

interface ProfileScreenProps {
  onNavigateToSettings: () => void;
}

export function ProfileScreen({ onNavigateToSettings }: ProfileScreenProps) {
  const { colors, theme } = useTheme();
  const { user, skills, totalXP, totalLevel, totalCompletedTasks } = useAppState();
  const isDark = theme === 'dark';

  const achievements = [
    { id: 1, name: 'Premier pas', description: 'Compléter votre première tâche', earned: totalCompletedTasks >= 1, color: '#FFD700' },
    { id: 2, name: 'Persévérant', description: '7 jours de suite', earned: skills.some((skill) => skill.streak >= 7), color: '#FF5733' },
    { id: 3, name: 'Expert', description: 'Atteindre le niveau 5', earned: totalLevel >= 5, color: '#8B5CF6' },
    { id: 4, name: 'Polyvalent', description: 'Pratiquer 4 compétences', earned: skills.length >= 4, color: '#10B981' },
    { id: 5, name: 'Marathonien', description: '30 jours de suite', earned: skills.some((skill) => skill.streak >= 30), color: '#4CAF50' },
    { id: 6, name: 'Maître', description: 'Atteindre le niveau 10', earned: totalLevel >= 10, color: '#3B82F6' },
  ];

  const profile = user ?? {
    name: 'Utilisateur',
    email: 'inconnu',
    initials: 'U',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Settings */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profil</Text>
          <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.cardBackground }]} onPress={onNavigateToSettings}>
            <Icon name="settings" size={24} color={colors.iconDefault} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.buttonPrimary,
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
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total XP</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider}]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{skills.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Compétences</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider}]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {achievements.filter((a) => a.earned).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Succès</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <Icon name="trophy" size={20} color={isDark ? '#F8FAFC' : colors.textPrimary} />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Succès</Text>
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
                    <Icon name="lock" size={20} color={isDark ? '#64748B' : '#94A3B8'} />
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
            <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Paramètres du compte</Text>
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.dividerHorizontal, { backgroundColor: colors.divider}]} />

          <TouchableOpacity style={styles.settingsItem} onPress={onNavigateToSettings}>
            <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Notifications</Text>
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.dividerHorizontal, { backgroundColor: colors.divider}]} />

          <TouchableOpacity style={styles.settingsItem} onPress={onNavigateToSettings}>
            <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Mode sombre</Text>
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
    shadowColor: '#E23E57',
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
