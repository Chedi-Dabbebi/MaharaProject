import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Icon, IconName } from '../components/ui/Icon';
import { LevelBadge } from '../components/ui/LevelBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useTheme } from '../context/ThemeContext';
import { skills } from '../data/skills';

export function StatsScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const weeklyData = [
    { day: 'Lun', completion: 80 },
    { day: 'Mar', completion: 60 },
    { day: 'Mer', completion: 100 },
    { day: 'Jeu', completion: 40 },
    { day: 'Ven', completion: 90 },
    { day: 'Sam', completion: 70 },
    { day: 'Dim', completion: 50 },
  ];

  const totalXP = skills.reduce((sum, skill) => sum + skill.xp, 0);
  const longestStreak = Math.max(...skills.map((s) => s.streak));
  const totalLevel = skills.reduce((sum, skill) => sum + skill.level, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Statistiques</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Suivez votre progression</Text>
        </View>

        {/* Total XP Card */}
        <View style={[styles.xpCard, { backgroundColor: '#E23E57' }]}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP Total</Text>
            <View style={styles.sparkleContainer}>
              <Icon name="sparkle" size={20} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.xpValue}>{totalXP.toLocaleString()}</Text>
          <Text style={styles.xpSubtext}>Niveau global: {totalLevel}</Text>
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
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Jours de suite</Text>
          </View>

          {/* Achievements Card */}
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: 'rgba(245, 158, 11, 0.15)' }
              ]}
            >
              <Icon name="trophy" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Succès débloqués</Text>
          </View>
        </View>

        {/* Weekly Completion */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Complétion hebdomadaire</Text>
          <View style={styles.barChart}>
            {weeklyData.map((item, index) => (
              <View key={item.day} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${item.completion}%`,
                        backgroundColor: item.completion >= 70 ? '#E23E57' : isDark ? '#88304E' : '#CBD5E1',
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
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Maîtrise des compétences</Text>
          <View style={styles.skillsList}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillRow}>
                <View style={styles.skillInfo}>
                  <Icon name={getIconName(skill.icon)} size={16} color={isDark ? '#F8FAFC' : colors.textPrimary} />
                  <Text style={[styles.skillName, { color: colors.textPrimary }]}>{skill.name}</Text>
                </View>
                <View style={styles.skillProgress}>
                  <ProgressBar progress={skill.progress} color={skill.color} height={8} />
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

const getIconName = (iconName: string): IconName => {
  const iconMap: Record<string, IconName> = {
    music: 'music',
    camera: 'camera',
    dumbbell: 'fitness',
    translate: 'language',
  };
  return iconMap[iconName] || 'star';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
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
    borderColor: 'rgba(226, 62, 87, 0.5)',
    shadowColor: '#E23E57',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
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
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
});
