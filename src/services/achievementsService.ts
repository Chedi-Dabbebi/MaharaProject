// Achievements Service - Track and unlock achievements
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Achievement, UserAchievement } from '../types';

const ACHIEVEMENTS_KEY = '@android_flaw:achievements';
const USER_ACHIEVEMENTS_KEY = '@android_flaw:user_achievements';

// Default achievements catalog
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Completion achievements
  {
    id: 'first_session',
    name: 'Premiers Pas',
    description: 'Complétez votre première session',
    icon: 'flag',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 1,
    xpReward: 50,
    isHidden: false,
  },
  {
    id: 'dedicated_learner',
    name: 'Débutant Déterminé',
    description: 'Complétez 5 sessions',
    icon: 'local-fire-department',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 5,
    xpReward: 100,
    isHidden: false,
  },
  {
    id: 'apprentice',
    name: 'Apprenti',
    description: 'Complétez 10 sessions',
    icon: 'school',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 10,
    xpReward: 200,
    isHidden: false,
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Complétez 25 sessions',
    icon: 'emoji-events',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 25,
    xpReward: 500,
    isHidden: false,
  },
  {
    id: 'master',
    name: 'Maître',
    description: 'Complétez 50 sessions',
    icon: 'workspace-premium',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 50,
    xpReward: 1000,
    isHidden: false,
  },
  // Streak achievements
  {
    id: 'streak_3',
    name: 'Streak 3 Jours',
    description: 'Maintenez une streak de 3 jours',
    icon: 'local-fire-department',
    category: 'streak',
    requirementType: 'days',
    requirementValue: 3,
    xpReward: 75,
    isHidden: false,
  },
  {
    id: 'streak_7',
    name: 'Streak 7 Jours',
    description: 'Maintenez une streak d\'une semaine',
    icon: 'whatshot',
    category: 'streak',
    requirementType: 'days',
    requirementValue: 7,
    xpReward: 150,
    isHidden: false,
  },
  {
    id: 'streak_30',
    name: 'Streak 30 Jours',
    description: 'Maintenez une streak d\'un mois',
    icon: 'emoji-fire',
    category: 'streak',
    requirementType: 'days',
    requirementValue: 30,
    xpReward: 500,
    isHidden: false,
  },
  // XP achievements
  {
    id: 'xp_novice',
    name: 'XP Novice',
    description: 'Gagnez 500 XP totaux',
    icon: 'star',
    category: 'xp',
    requirementType: 'total_xp',
    requirementValue: 500,
    xpReward: 100,
    isHidden: false,
  },
  {
    id: 'xp_collector',
    name: 'XP Collecteur',
    description: 'Gagnez 2000 XP totaux',
    icon: 'grade',
    category: 'xp',
    requirementType: 'total_xp',
    requirementValue: 2000,
    xpReward: 250,
    isHidden: false,
  },
  {
    id: 'xp_master',
    name: 'XP Maître',
    description: 'Gagnez 5000 XP totaux',
    icon: 'rewards',
    category: 'xp',
    requirementType: 'total_xp',
    requirementValue: 5000,
    xpReward: 500,
    isHidden: false,
  },
  // Social/Multi-skill achievements
  {
    id: 'multi_skill_3',
    name: 'Multi-Skill',
    description: 'Apprenez 3 compétences simultanément',
    icon: 'diversity-3',
    category: 'social',
    requirementType: 'count',
    requirementValue: 3,
    xpReward: 150,
    isHidden: false,
  },
  {
    id: 'polyglotte',
    name: 'Polyglotte',
    description: 'Apprenez 5 compétences simultanément',
    icon: 'language',
    category: 'social',
    requirementType: 'count',
    requirementValue: 5,
    xpReward: 300,
    isHidden: false,
  },
  // Special achievements
  {
    id: 'speedster',
    name: 'Rapide',
    description: 'Complétez une session en moins de 10 min',
    icon: 'bolt',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 1,
    xpReward: 50,
    isHidden: false,
  },
  {
    id: 'enduring',
    name: 'Endurant',
    description: 'Complétez une session de 60+ minutes',
    icon: 'timer',
    category: 'completion',
    requirementType: 'count',
    requirementValue: 1,
    xpReward: 100,
    isHidden: false,
  },
];

export interface AchievementProgress {
  totalSessions: number;
  currentStreak: number;
  totalXp: number;
  activeSkills: number;
  hasQuickSession: boolean;
  hasLongSession: boolean;
}

/**
 * Get all available achievements
 */
export async function getAchievementsCatalog(): Promise<Achievement[]> {
  try {
    const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading achievements catalog:', error);
  }

  // Save and return default achievements
  await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(DEFAULT_ACHIEVEMENTS));
  return DEFAULT_ACHIEVEMENTS;
}

/**
 * Get user's achievement progress
 */
export async function getUserAchievements(): Promise<UserAchievement[]> {
  try {
    const stored = await AsyncStorage.getItem(USER_ACHIEVEMENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user achievements:', error);
  }

  // Initialize with all achievements at 0 progress
  const catalog = await getAchievementsCatalog();
  const initialUserAchievements: UserAchievement[] = catalog.map(achievement => ({
    achievement,
    progressCurrent: 0,
    progressRequired: achievement.requirementValue,
    isCompleted: false,
  }));

  await AsyncStorage.setItem(USER_ACHIEVEMENTS_KEY, JSON.stringify(initialUserAchievements));
  return initialUserAchievements;
}

/**
 * Update achievement progress based on user activity
 */
export async function updateAchievementProgress(progress: AchievementProgress): Promise<UserAchievement[]> {
  const catalog = await getAchievementsCatalog();
  const userAchievements = await getUserAchievements();

  let updated = false;
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = userAchievements.map(userAchievement => {
    if (userAchievement.isCompleted) {
      return userAchievement;
    }

    let newProgress = userAchievement.progressCurrent;
    const { achievement } = userAchievement;

    // Calculate progress based on achievement type
    switch (achievement.requirementType) {
      case 'count':
        if (achievement.category === 'completion') {
          newProgress = progress.totalSessions;
        } else if (achievement.category === 'social') {
          newProgress = progress.activeSkills;
        } else if (achievement.id === 'speedster') {
          newProgress = progress.hasQuickSession ? 1 : 0;
        } else if (achievement.id === 'enduring') {
          newProgress = progress.hasLongSession ? 1 : 0;
        }
        break;

      case 'days':
        newProgress = progress.currentStreak;
        break;

      case 'total_xp':
        newProgress = progress.totalXp;
        break;
    }

    // Check if achievement is now unlocked
    if (newProgress >= achievement.requirementValue && !userAchievement.isCompleted) {
      newlyUnlocked.push(achievement);
      updated = true;
      return {
        ...userAchievement,
        progressCurrent: newProgress,
        isCompleted: true,
        unlockedAt: new Date(),
      };
    }

    // Update progress if changed
    if (newProgress !== userAchievement.progressCurrent) {
      updated = true;
      return {
        ...userAchievement,
        progressCurrent: newProgress,
      };
    }

    return userAchievement;
  });

  if (updated) {
    await AsyncStorage.setItem(USER_ACHIEVEMENTS_KEY, JSON.stringify(updatedAchievements));
  }

  return updatedAchievements;
}

/**
 * Record a completed session and update achievements
 */
export async function recordSessionCompletion(
  durationMinutes: number,
  xpEarned: number,
  currentStreak: number,
  activeSkillsCount: number
): Promise<{ newlyUnlocked: Achievement[]; totalProgress: UserAchievement[] }> {
  // Get current progress state
  const userAchievements = await getUserAchievements();

  // Calculate aggregate stats
  const totalSessions = userAchievements.find(a => a.achievement.id === 'first_session')?.progressCurrent || 0;
  const totalXp = userAchievements.find(a => a.achievement.id === 'xp_novice')?.progressCurrent || 0;

  const newProgress: AchievementProgress = {
    totalSessions: totalSessions + 1,
    currentStreak: currentStreak,
    totalXp: totalXp + xpEarned,
    activeSkills: activeSkillsCount,
    hasQuickSession: durationMinutes < 10,
    hasLongSession: durationMinutes >= 60,
  };

  const updatedAchievements = await updateAchievementProgress(newProgress);

  // Find newly unlocked achievements
  const newlyUnlocked = updatedAchievements
    .filter(ua => ua.isCompleted && ua.unlockedAt)
    .filter(ua => {
      const now = new Date();
      const unlockedTime = ua.unlockedAt ? new Date(ua.unlockedAt).getTime() : 0;
      return now.getTime() - unlockedTime < 5000; // Unlocked in last 5 seconds
    })
    .map(ua => ua.achievement);

  return {
    newlyUnlocked,
    totalProgress: updatedAchievements,
  };
}

/**
 * Get achievement by ID
 */
export async function getAchievementById(id: string): Promise<Achievement | null> {
  const catalog = await getAchievementsCatalog();
  return catalog.find(a => a.id === id) || null;
}

/**
 * Get achievements by category
 */
export async function getAchievementsByCategory(
  category: Achievement['category']
): Promise<UserAchievement[]> {
  const userAchievements = await getUserAchievements();
  return userAchievements.filter(ua => ua.achievement.category === category);
}

/**
 * Get completed vs total achievements
 */
export async function getAchievementsSummary(): Promise<{
  completed: number;
  total: number;
  percentage: number;
  totalXpEarned: number;
}> {
  const userAchievements = await getUserAchievements();
  const completed = userAchievements.filter(ua => ua.isCompleted).length;
  const total = userAchievements.length;
  const totalXpEarned = userAchievements
    .filter(ua => ua.isCompleted)
    .reduce((sum, ua) => sum + ua.achievement.xpReward, 0);

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    totalXpEarned,
  };
}

/**
 * Reset all achievement progress (for testing/debug)
 */
export async function resetAchievements(): Promise<void> {
  await AsyncStorage.removeItem(USER_ACHIEVEMENTS_KEY);
  await getUserAchievements(); // Re-initialize
}
