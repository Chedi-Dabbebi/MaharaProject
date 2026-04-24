import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Icon, type IconName } from '../components/ui/Icon';
import type { UserAchievement } from '../types';
import {
  getUserAchievements,
  getAchievementsByCategory,
  getAchievementsSummary,
} from '../services/achievementsService';

type Category = 'all' | 'completion' | 'streak' | 'xp' | 'social';

export function AchievementsScreen() {
  const { colors } = useTheme();

  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [summary, setSummary] = useState({ completed: 0, total: 0, percentage: 0, totalXpEarned: 0 });

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    const [userAchievements, summaryData] = await Promise.all([
      getUserAchievements(),
      getAchievementsSummary(),
    ]);
    setAchievements(userAchievements);
    setSummary(summaryData);
  }

  async function filterByCategory(category: Category) {
    setSelectedCategory(category);

    if (category === 'all') {
      setAchievements(await getUserAchievements());
    } else {
      setAchievements(await getAchievementsByCategory(category));
    }
  }

  function resolveAchievementIcon(category: UserAchievement['achievement']['category']): IconName {
    switch (category) {
      case 'completion':
        return 'trophy';
      case 'streak':
        return 'fire';
      case 'xp':
        return 'star';
      case 'social':
        return 'profile';
      default:
        return 'target';
    }
  }

  function renderCategoryChip(category: Category, label: string, count: number) {
    const isSelected = selectedCategory === category;

    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.cardBackground,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => filterByCategory(category)}
      >
        <Text
          style={[
            styles.categoryChipText,
            {
              color: isSelected ? colors.buttonText : colors.textSecondary,
            },
          ]}
        >
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  }

  function renderAchievementCard({ item }: { item: UserAchievement }) {
    const { achievement, progressCurrent, progressRequired, isCompleted } = item;

    const isLocked = !isCompleted;
    const progress = Math.min(100, Math.round((progressCurrent / progressRequired) * 100));

    return (
      <View
        style={[
          styles.achievementCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: isCompleted ? colors.success + '40' : colors.border,
            opacity: isLocked ? 0.7 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.achievementIconContainer,
            {
              backgroundColor: isCompleted ? colors.success + '20' : colors.cardBackground,
              borderColor: isCompleted ? colors.success : colors.border,
            },
          ]}
        >
          <Icon
            name={resolveAchievementIcon(achievement.category)}
            size={28}
            color={isCompleted ? colors.success : colors.textSecondary}
          />
        </View>

        <View style={styles.achievementContent}>
          <View style={styles.achievementHeader}>
            <Text
              style={[
                styles.achievementName,
                { color: isCompleted ? colors.success : colors.text },
              ]}
              numberOfLines={1}
            >
              {achievement.name}
            </Text>
              {isCompleted && (
                <View style={[styles.completedBadge, { backgroundColor: colors.success + '20' }]}>
                  <Icon name="checkmark" size={12} color={colors.success} />
                </View>
              )}
          </View>

          <Text
            style={[
              styles.achievementDescription,
              { color: colors.textSecondary },
            ]}
            numberOfLines={2}
          >
            {achievement.description}
          </Text>

          <View style={styles.achievementFooter}>
            <View style={styles.xpBadge}>
              <Icon name="trophy" size={14} color={colors.xp} />
              <Text style={[styles.xpText, { color: colors.xp }]}>
                {achievement.xpReward} XP
              </Text>
            </View>

            {!isCompleted && (
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {progressCurrent} / {progressRequired}
              </Text>
            )}
          </View>

          {!isCompleted && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  function renderHeader() {
    const categories = [
      { id: 'all', label: 'Tous', count: achievements.length },
      { id: 'completion', label: 'Progress', count: achievements.filter(a => a.achievement.category === 'completion').length },
      { id: 'streak', label: 'Streaks', count: achievements.filter(a => a.achievement.category === 'streak').length },
      { id: 'xp', label: 'XP', count: achievements.filter(a => a.achievement.category === 'xp').length },
      { id: 'social', label: 'Social', count: achievements.filter(a => a.achievement.category === 'social').length },
    ];

    return (
      <View>
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              Progrès des Succès
            </Text>
            <View style={[styles.percentageBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.percentageText, { color: colors.primary }]}>
                {summary.percentage}%
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: colors.primary }]}>
                {summary.completed}/{summary.total}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: colors.textSecondary }]}>
                Succès débloqués
              </Text>
            </View>

            <View style={[styles.summaryStatDivider, { backgroundColor: colors.border }]} />

            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: colors.xp }]}>
                {summary.totalXpEarned}
              </Text>
              <Text style={[styles.summaryStatLabel, { color: colors.textSecondary }]}>
                XP gagnées
              </Text>
            </View>
          </View>

          <View style={styles.summaryProgress}>
            <View style={[styles.summaryProgressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.summaryProgressFill,
                  {
                    width: `${summary.percentage}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(cat =>
            renderCategoryChip(cat.id as Category, cat.label, cat.count)
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.achievement.id}
        renderItem={renderAchievementCard}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="trophy" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Aucun succès dans cette catégorie
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  summaryStatDivider: {
    width: 1,
    height: 40,
  },
  summaryProgress: {
    marginTop: 8,
  },
  summaryProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  summaryProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContent: {
    gap: 8,
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  achievementIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  achievementDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 8,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
