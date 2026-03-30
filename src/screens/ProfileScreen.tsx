import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LevelBadge } from '../components/ui/LevelBadge';
import { skills } from '../data/skills';

export function ProfileScreen() {
  const totalXP = skills.reduce((sum, skill) => sum + skill.xp, 0);
  const totalLevel = skills.reduce((sum, skill) => sum + skill.level, 0);

  const achievements = [
    { id: 1, name: 'Premier pas', description: 'Compléter votre première tâche', earned: true, color: '#FFD700' },
    { id: 2, name: 'Persévérant', description: '7 jours de suite', earned: true, color: '#FF5733' },
    { id: 3, name: 'Expert', description: 'Atteindre le niveau 5', earned: true, color: '#8B5CF6' },
    { id: 4, name: 'Polyvalent', description: 'Pratiquer 4 compétences', earned: true, color: '#10B981' },
    { id: 5, name: 'Marathonien', description: '30 jours de suite', earned: false, color: '#4CAF50' },
    { id: 6, name: 'Maître', description: 'Atteindre le niveau 10', earned: false, color: '#3B82F6' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Settings */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: '#E23E57',
                }
              ]}
            >
              <Text style={styles.avatarText}>JD</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Jean Dupont</Text>
              <Text style={styles.profileEmail}>jean.dupont@email.com</Text>
            </View>

            <LevelBadge level={totalLevel} size="lg" />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{skills.length}</Text>
              <Text style={styles.statLabel}>Compétences</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {achievements.filter((a) => a.earned).length}
              </Text>
              <Text style={styles.statLabel}>Succès</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🏆</Text>
            <Text style={styles.cardTitle}>Succès</Text>
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
                      : 'rgba(255, 255, 255, 0.02)',
                    borderColor: achievement.earned
                      ? 'rgba(139, 92, 246, 0.3)'
                      : 'rgba(255, 255, 255, 0.05)',
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
                        : 'rgba(255, 255, 255, 0.05)',
                    }
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>
                    {achievement.earned ? '🏅' : '🔒'}
                  </Text>
                </View>
                <Text style={styles.achievementName} numberOfLines={2}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Paramètres du compte</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.dividerHorizontal} />

          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Notifications</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.dividerHorizontal} />

          <View style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Mode sombre</Text>
            <View
              style={[
                styles.toggle,
                { backgroundColor: '#E23E57' }
              ]}
            >
              <View style={styles.toggleKnob} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#311D3F',
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
    color: '#F8FAFC',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingsIcon: {
    fontSize: 24,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#F8FAFC',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
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
    color: '#F8FAFC',
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#F8FAFC',
  },
  chevron: {
    fontSize: 24,
    color: '#94A3B8',
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    transform: [{ translateX: 12 }],
  },
});
