import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Icon } from '../components/ui/Icon';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getIconName } from '../utils/iconHelper';
import { useSkills } from '../hooks/useSkills';
import { useSession } from '../hooks/useSession';
import { useTranslation } from '../i18n';
import type { Difficulty, GeneratedPlan } from '../types';
import { generatePlan } from '../logic/planGenerator';
import { generatePlanWithAI } from '../services/aiPlanService';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

export function PlanScreen() {
  const { colors, theme } = useTheme();
  const { skills, isLoading, loadError, reload } = useSkills();
  const { createPlan, saveDraftPlan, acceptPlan } = useSession();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(skills[0]?.id ?? null);
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? null;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingState message={t('plan_loading')} />
      </View>
    );
  }

  if (loadError || planError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message={loadError ?? planError ?? undefined} onRetry={() => { setPlanError(null); void reload(); }} />
      </View>
    );
  }

  if (!selectedSkill) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title={t('plan_empty_title')}
          subtitle={t('plan_empty_subtitle')}
        />
      </View>
    );
  }

  const planToShow = generatedPlan;
  const weeklyTime = planToShow?.weeklyTime ?? '0 min';
  const sessionsPerWeek = planToShow?.sessionsPerWeek ?? 0;
  const plannedSessions = planToShow?.sessions ?? [];

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setPlanError(null);
    try {
      const aiPlan = await generatePlanWithAI({ skill: selectedSkill, difficulty });
      const nextPlan = aiPlan ?? createPlan(selectedSkill.id, difficulty);
      if (!nextPlan) {
        setStatusMessage(t('msg_no_plan_generated'));
        return;
      }
      setGeneratedPlan(nextPlan);
      await saveDraftPlan(nextPlan, aiPlan ? 'ai' : 'fallback');
      setStatusMessage(aiPlan ? t('msg_plan_ai_generated') : t('msg_plan_fallback_generated'));
    } catch {
      setPlanError(t('error_state_default'));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleValidate = () => {
    if (!generatedPlan) {
      setStatusMessage(t('msg_generate_before_validate'));
      return;
    }
    acceptPlan(generatedPlan);
    setStatusMessage(t('msg_plan_validated'));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('plan_title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('plan_subtitle')}
          </Text>
        </View>

        {/* Skill Selection */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{t('plan_skill_label')}</Text>
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
                        ? `${colors.primary}26`
                        : colors.surfaceElevated,
                      borderColor: isSelected ? colors.primary : colors.border,
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.skillIconContainer,
                      { backgroundColor: `${skill.color}20` }
                    ]}
                  >
                    <Icon name={getIconName(skill.icon)} size={16} color={isDark ? '#E5E7EB' : colors.textPrimary} />
                  </View>
                  <Text style={[styles.skillName, { color: colors.textPrimary }]}>{skill.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{t('plan_difficulty_label')}</Text>
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
                        ? colors.primary
                        : colors.surfaceElevated,
                  }
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: difficulty === level ? '#ffffff' : colors.textSecondary }
                  ]}
                >
                  {t(`difficulty_${level}` as any)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generated Plan Summary */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.planHeader}>
            <Icon name="sparkle" size={20} color={isDark ? '#E5E7EB' : colors.textPrimary} />
            <Text style={[styles.planTitle, { color: colors.textPrimary }]}>{t('plan_generated_title')}</Text>
          </View>

          <View style={styles.planContent}>
            <View style={[styles.planItem, { backgroundColor: `${colors.info}1A`, borderColor: `${colors.info}33` }]}>
              <View style={[styles.planIconBox, { backgroundColor: `${colors.info}33` }]}>
                <Icon name="target" size={20} color={colors.info} />
              </View>
              <View style={styles.planTextContainer}>
                <Text style={[styles.planLabel, { color: colors.textSecondary }]}>{t('plan_sessions_per_week')}</Text>
                <Text style={[styles.planValue, { color: colors.textPrimary }]}>{t('plan_sessions_amount', { amount: sessionsPerWeek })}</Text>
              </View>
            </View>

            <View style={[styles.planItem, { backgroundColor: `${colors.accent}1A`, borderColor: `${colors.accent}33` }]}>
              <View style={[styles.planIconBox, { backgroundColor: `${colors.accent}33` }]}>
                <Icon name="time" size={20} color={colors.accent} />
              </View>
              <View style={styles.planTextContainer}>
                <Text style={[styles.planLabel, { color: colors.textSecondary }]}>{t('plan_weekly_time')}</Text>
                <Text style={[styles.planValue, { color: colors.textPrimary }]}>{weeklyTime}</Text>
              </View>
            </View>

            <View style={[styles.planDescription, { borderTopColor: colors.divider }]}>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                {t('plan_description_prefix')}
                <Text style={[styles.highlight, { color: colors.textPrimary }]}>{selectedSkill.name}</Text>
                {t('plan_description_suffix', { level: selectedSkill.level })}
              </Text>
            </View>

            <View style={[styles.planDescription, { borderTopColor: colors.divider }]}>
              <Text style={[styles.planLabel, { color: colors.textSecondary }]}>{t('plan_planned_sessions')}</Text>
              {plannedSessions.length > 0 ? (
                plannedSessions.map((session, index) => (
                  <View
                    key={`${session.taskId}-${session.dayLabel}-${index}`}
                    style={[
                      styles.sessionRow,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
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
                  {t('plan_no_sessions')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.regenerateButton, { backgroundColor: `${colors.accent}1A`, borderColor: colors.accent, opacity: isRegenerating ? 0.6 : 1 }]}
            onPress={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text style={[styles.regenerateText, { color: colors.accent }]}>{t('plan_regenerate')}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.validateButtonContainer}>
            <PrimaryButton fullWidth onPress={handleValidate}>
              {t('plan_validate')}
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
