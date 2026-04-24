import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { LevelBadge } from '../components/ui/LevelBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TaskItem } from '../components/TaskItem';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Icon } from '../components/ui/Icon';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { getIconName } from '../utils/iconHelper';
import { useSkills } from '../hooks/useSkills';
import { useSession } from '../hooks/useSession';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../types/navigation';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { getQuestionsForTaskIds, generateQuiz } from '../logic/quizHelpers';

export function SkillDetailScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'SkillDetail'>>();
  const navigation = useNavigation();
  const { toggleTaskCompletion, getSkillById, isLoading, skills } = useSkills();
  const skill = getSkillById(route.params.skillId);
  const { colors, theme } = useTheme();

  const { activeSessions, acceptedPlans } = useSession();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  if (isLoading && !skill) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingState message={t('skill_detail_loading')} />
      </View>
    );
  }

  if (!skill) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message={t('skill_detail_not_found')} />
      </View>
    );
  }

  const onBack = () => navigation.goBack();
  const hasActiveSession = Boolean(activeSessions[skill.id]);
  const hasValidatedPlan = Boolean(acceptedPlans[skill.id]);
  const plannedTaskOrder = acceptedPlans[skill.id]?.recommendedTaskIds ?? [];
  const plannedTasks = plannedTaskOrder
    .map((taskId) => skill.tasks.find((task) => task.id === taskId))
    .filter((task): task is NonNullable<typeof task> => Boolean(task));
  const tasksToDisplay = hasValidatedPlan ? (plannedTasks.length > 0 ? plannedTasks : skill.tasks) : [];

  const allTasksCompleted = tasksToDisplay.length > 0 && tasksToDisplay.every(task => task.completed);
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (allTasksCompleted) {
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      bounceValue.setValue(0);
    }
  }, [allTasksCompleted, bounceValue]);

  const handleQuizPress = () => {
    try {
      if (!skill) return;

      // The quiz button is only visible when ALL plan tasks are completed.
      // So tasksToDisplay are guaranteed to all be completed at this point.
      const taskIds = tasksToDisplay.map(t => t.id);

      console.log('DEBUG [Quiz System] - Number of completed tasks:', taskIds.length);
      console.log('DEBUG [Quiz System] - Task IDs used:', taskIds);

      // Get all questions linked to these task IDs
      const questions = getQuestionsForTaskIds(taskIds);
      console.log('DEBUG [Quiz System] - Number of questions retrieved:', questions.length);

      // Generate the 10-question quiz
      const quiz = generateQuiz(questions);
      console.log('DEBUG [Quiz System] - Number of questions in final quiz:', quiz.questions.length);

      if (quiz && quiz.questions.length > 0) {
        // @ts-ignore
        navigation.navigate('QuizScreen', { quiz });
      }
    } catch (e) {
      console.warn('Failed to start quiz safely:', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary,
                borderColor: 'rgba(255,255,255,0.2)',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }
            ]}
          >
            <Icon name={getIconName(skill.icon)} size={32} color="#FFFFFF" />
          </View>

          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{skill.name}</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{t('skill_detail_streak', { streak: skill.streak })}</Text>
            </View>
          </View>

          <LevelBadge level={skill.level} size="md" />
        </View>

        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={[styles.xpLabel, { color: colors.textSecondary }]}>{t('skill_detail_progress')}</Text>
            <Text style={[styles.xpValue, { color: colors.textPrimary }]}>
              {skill.xp} / {skill.maxXp} XP
            </Text>
          </View>
          <ProgressBar
            progress={(skill.xp / skill.maxXp) * 100}
            color={colors.primary}
            height={10}
          />
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('skill_detail_tasks_week')}</Text>

        <View style={[styles.tasksContainer, { paddingBottom: tabBarHeight + 100 }]}>
          {tasksToDisplay.length > 0 ? (
            tasksToDisplay.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                duration={task.duration}
                xp={task.xp}
                completed={task.completed}
                prompt={task.prompt}
                items={task.items}
                onToggle={() => toggleTaskCompletion(skill.id, task.id)}
              />
            ))
          ) : (
            <Text style={[styles.emptyTasksMessage, { color: colors.textSecondary }]}>
              {t('skill_detail_plan_required')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {allTasksCompleted && (
        <Animated.View 
          style={[
            styles.fabContainer, 
            { 
              bottom: tabBarHeight + 24,
              transform: [
                { scale: bounceValue },
                { translateY: bounceValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }
              ],
              opacity: bounceValue,
            }
          ]}
        >
          <PrimaryButton onPress={handleQuizPress}>
            {t('skill_detail_btn_quiz')}
          </PrimaryButton>
        </Animated.View>
      )}
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
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 28,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignSelf: 'flex-start',
  },
  streakText: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpContainer: {
    marginTop: 8,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  tasksContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyTasksMessage: {
    fontSize: 13,
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  sessionMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
});
