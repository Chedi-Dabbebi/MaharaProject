import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Icon } from '../components/ui/Icon';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { getIconName } from '../utils/iconHelper';
import { useAppState } from '../context/AppStateContext';
import { Difficulty, GeneratedPlan } from '../logic/planGenerator';
import { generatePlanWithAI } from '../services/aiPlanService';

export function PlanScreen() {
  const { colors, theme } = useTheme();
  const { skills, createPlan, saveDraftPlan, acceptPlan } = useAppState();
  const isDark = theme === 'dark';
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(skills[0]?.id ?? null);
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? null;

  if (!selectedSkill) {
    return null;
  }

  const planToShow = generatedPlan ?? createPlan(selectedSkill.id, difficulty);
  const weeklyTime = planToShow?.weeklyTime ?? '0 min';
  const sessionsPerWeek = planToShow?.sessionsPerWeek ?? 0;
  const plannedSessions = planToShow?.sessions ?? [];

  const handleRegenerate = async () => {
    const aiPlan = await generatePlanWithAI({
      skill: selectedSkill,
      difficulty,
    });
    const nextPlan = aiPlan ?? createPlan(selectedSkill.id, difficulty);
    if (!nextPlan) {
      setStatusMessage('Impossible de generer un plan pour cette competence.');
      return;
    }
    setGeneratedPlan(nextPlan);
    await saveDraftPlan(nextPlan, aiPlan ? 'ai' : 'fallback');
    setStatusMessage(aiPlan ? 'Plan IA généré.' : 'Plan régénéré (fallback local).');
  };

  const handleValidate = () => {
    const plan = generatedPlan ?? createPlan(selectedSkill.id, difficulty);
    if (!plan) {
      setStatusMessage('Aucun plan a valider.');
      return;
    }
    acceptPlan(plan);
    setStatusMessage('Plan valide et enregistre.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Générateur de Plan</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Créez un plan d'entraînement personnalisé
          </Text>
        </View>

        {/* Skill Selection */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>Compétence</Text>
          <View style={styles.skillGrid}>
            {skills.map((skill) => {
              const isSelected = selectedSkill.id === skill.id;
              return (
                <TouchableOpacity
                  key={skill.id}
                  onPress={() => {
                    setSelectedSkillId(skill.id);
                    setGeneratedPlan(null);
                    setStatusMessage('');
                  }}
                  style={[
                    styles.skillButton,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(226, 62, 87, 0.15)'
                        : isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: isSelected ? '#E23E57' : colors.cardBorder,
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.skillIconContainer,
                      { backgroundColor: `${skill.color}20` }
                    ]}
                  >
                    <Icon name={getIconName(skill.icon)} size={16} color={isDark ? '#F8FAFC' : colors.textPrimary} />
                  </View>
                  <Text style={[styles.skillName, { color: colors.textPrimary }]}>{skill.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>Difficulté</Text>
          <View style={styles.difficultyContainer}>
            {(['facile', 'moyen', 'difficile'] as Difficulty[]).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => {
                  setDifficulty(level);
                  setGeneratedPlan(null);
                  setStatusMessage('');
                }}
                style={[
                  styles.difficultyButton,
                  {
                    backgroundColor:
                      difficulty === level
                        ? '#E23E57'
                        : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  }
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: difficulty === level ? '#ffffff' : colors.textSecondary }
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generated Plan Summary */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.planHeader}>
            <Icon name="sparkle" size={20} color={isDark ? '#F8FAFC' : colors.textPrimary} />
            <Text style={[styles.planTitle, { color: colors.textPrimary }]}>Plan Généré</Text>
          </View>

          <View style={styles.planContent}>
            <View style={[styles.planItem, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <View style={[styles.planIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Icon name="target" size={20} color="#3B82F6" />
              </View>
              <View style={styles.planTextContainer}>
                <Text style={[styles.planLabel, { color: colors.textSecondary }]}>Séances par semaine</Text>
                <Text style={[styles.planValue, { color: colors.textPrimary }]}>{sessionsPerWeek} séances</Text>
              </View>
            </View>

            <View style={[styles.planItem, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <View style={[styles.planIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <Icon name="time" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.planTextContainer}>
                <Text style={[styles.planLabel, { color: colors.textSecondary }]}>Temps hebdomadaire estimé</Text>
                <Text style={[styles.planValue, { color: colors.textPrimary }]}>{weeklyTime}</Text>
              </View>
            </View>

            <View style={[styles.planDescription, { borderTopColor: colors.divider }]}>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                Votre plan personnalisé pour{' '}
                <Text style={[styles.highlight, { color: colors.textPrimary }]}>{selectedSkill.name}</Text> inclut des
                exercices progressifs adaptés à votre niveau ({selectedSkill.level}) et à
                la difficulté sélectionnée.
              </Text>
            </View>

            <View style={[styles.planDescription, { borderTopColor: colors.divider }]}>
              <Text style={[styles.planLabel, { color: colors.textSecondary }]}>Séances planifiées</Text>
              {plannedSessions.length > 0 ? (
                plannedSessions.map((session, index) => (
                  <View
                    key={`${session.taskId}-${session.dayLabel}-${index}`}
                    style={[
                      styles.sessionRow,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        borderColor: colors.cardBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.sessionDay, { color: colors.textSecondary }]}>{session.dayLabel}</Text>
                    <View style={styles.sessionContent}>
                      <Text style={[styles.sessionTitle, { color: colors.textPrimary }]}>{session.taskTitle}</Text>
                      <Text style={[styles.sessionMeta, { color: colors.textSecondary }]}>
                        {session.duration} • {session.xp} XP
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.sessionMeta, { color: colors.textSecondary }]}>
                  Génère un plan pour voir les tâches proposées.
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.regenerateButton, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: '#8B5CF6' }]}
            onPress={handleRegenerate}
          >
            <Text style={[styles.regenerateText, { color: '#8B5CF6' }]}>Régénérer</Text>
          </TouchableOpacity>
          <View style={styles.validateButtonContainer}>
            <PrimaryButton fullWidth onPress={handleValidate}>
              Valider
            </PrimaryButton>
          </View>
        </View>
        {statusMessage ? (
          <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>{statusMessage}</Text>
        ) : null}
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
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  skillIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  planContent: {
    gap: 16,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  planIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  planLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  planValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  planDescription: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 40,
  },
  regenerateButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenerateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  validateButtonContainer: {
    flex: 1,
  },
  statusMessage: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 32,
    textAlign: 'center',
  },
  sessionRow: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionDay: {
    width: 34,
    fontSize: 12,
    fontWeight: '700',
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionMeta: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});
