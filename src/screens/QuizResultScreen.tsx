import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import type { HomeStackParamList } from '../types/navigation';
import { useSkills } from '../hooks/useSkills';
import {
  calculateQuizScore,
  analyzeQuizMistakes,
  getMostFailedTaskId,
  getTaskTitleById,
  getGradeDetails,
  generateFeedbackMessage,
  getMotivationalMessage
} from '../logic/quizHelpers';
import { Icon } from '../components/ui/Icon';

export function QuizResultScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'QuizResultScreen'>>();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const { skills } = useSkills();
  const isDark = theme === 'dark';

  const { quiz, userAnswers } = route.params;

  const result = useMemo(() => {
    const scoreData = calculateQuizScore(quiz, userAnswers);
    const mistakes = analyzeQuizMistakes(quiz, userAnswers);
    const weakestTaskId = getMostFailedTaskId(mistakes);
    const weakestTaskTitle = weakestTaskId ? getTaskTitleById(skills, weakestTaskId) : null;
    const gradeDetails = getGradeDetails(scoreData.score);
    const feedback = generateFeedbackMessage(weakestTaskTitle);
    const motivation = getMotivationalMessage(scoreData.score);

    return { ...scoreData, gradeDetails, feedback, motivation };
  }, [quiz, userAnswers, skills]);

  const handleRetry = () => {
    // @ts-ignore
    navigation.replace('QuizScreen', { quiz });
  };

  const handleFinish = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.content}>
        <Icon name="trophy" size={80} color={colors.primary} />
        
        <Text style={[styles.title, { color: colors.textPrimary }]}>Résultats du Quiz</Text>
        <Text style={[styles.motivation, { color: colors.textSecondary }]}>{result.motivation}</Text>

        <View style={[styles.scoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.scoreValue, { color: colors.primary }]}>{result.formatted}</Text>
          <Text style={[styles.percentage, { color: result.gradeDetails.color }]}>
            {`${result.gradeDetails.label} ${result.gradeDetails.emoji}`}
          </Text>
        </View>

        <View style={[styles.feedbackBox, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.feedbackText, { color: colors.textPrimary }]}>{result.feedback}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.retryButton, { borderColor: colors.primary }]} onPress={handleRetry}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Recommencer le quiz</Text>
        </TouchableOpacity>
        <PrimaryButton onPress={handleFinish}>Terminer</PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  motivation: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  scoreCard: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 32,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    marginBottom: 8,
  },
  percentage: {
    fontSize: 20,
    fontWeight: '600',
  },
  feedbackBox: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    gap: 16,
  },
  retryButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  retryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
