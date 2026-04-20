import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LevelBadge } from '../components/ui/LevelBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TaskItem } from '../components/TaskItem';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Skill } from '../data/skills';
import { getIconEmoji } from '../utils/iconHelper';
import { useAppState } from '../context/AppStateContext';

interface SkillDetailScreenProps {
  skill: Skill;
  onBack: () => void;
}

export function SkillDetailScreen({ skill, onBack }: SkillDetailScreenProps) {
  const {
    toggleTaskCompletion,
    activeSessions,
    acceptedPlans,
    startSession,
    completeSession,
  } = useAppState();
  const [sessionMessage, setSessionMessage] = useState('');
  const hasActiveSession = Boolean(activeSessions[skill.id]);
  const plannedTaskOrder = acceptedPlans[skill.id]?.recommendedTaskIds ?? [];
  const plannedTasks = plannedTaskOrder
    .map((taskId) => skill.tasks.find((task) => task.id === taskId))
    .filter((task): task is NonNullable<typeof task> => Boolean(task));
  const tasksToDisplay = plannedTasks.length > 0 ? plannedTasks : skill.tasks;

  const handleSessionPress = () => {
    const result = hasActiveSession ? completeSession(skill.id) : startSession(skill.id);
    setSessionMessage(result.message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: `rgba(255,255,255,0.02)` }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${skill.color}20`,
                borderColor: `${skill.color}40`,
              }
            ]}
          >
            <Text style={{ fontSize: 32 }}>{getIconEmoji(skill.icon)}</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>{skill.name}</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {skill.streak} jours</Text>
            </View>
          </View>

          <LevelBadge level={skill.level} size="md" />
        </View>

        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>Progression XP</Text>
            <Text style={styles.xpValue}>
              {skill.xp} / {skill.maxXp} XP
            </Text>
          </View>
          <ProgressBar
            progress={(skill.xp / skill.maxXp) * 100}
            color={skill.color}
            height={10}
          />
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tâches de la semaine</Text>

        <View style={styles.tasksContainer}>
          {tasksToDisplay.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              duration={task.duration}
              xp={task.xp}
              completed={task.completed}
              onToggle={() => toggleTaskCompletion(skill.id, task.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <PrimaryButton onPress={handleSessionPress}>
          {hasActiveSession ? 'Terminer la séance' : 'Commencer la séance'}
        </PrimaryButton>
        {sessionMessage ? <Text style={styles.sessionMessage}>{sessionMessage}</Text> : null}
      </View>
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#F8FAFC',
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
    color: '#F8FAFC',
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
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  xpValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  tasksContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 120,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  sessionMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
