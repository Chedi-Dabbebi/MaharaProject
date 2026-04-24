import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Icon } from './ui/Icon';
import type { QuizData, QuizQuestion, QuizResult } from '../types';

interface QuizProps {
  quizData: QuizData;
  xpReward: number;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export function Quiz({ quizData, xpReward, onComplete, onExit }: QuizProps) {
  const { colors } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  function handleSelectAnswer(index: number) {
    if (showResult) return;
    setSelectedAnswer(index);
  }

  function handleSubmitAnswer() {
    if (selectedAnswer === null) return;

    setIsSubmitting(true);
    setShowResult(true);

    // Store the answer
    setAnswers([...answers, selectedAnswer]);

    // Move to next question after delay
    setTimeout(() => {
      if (isLastQuestion) {
        // Quiz complete
        const score = calculateScore([...answers, selectedAnswer]);
        const xpEarned = Math.round((score / quizData.questions.length) * xpReward);
        onComplete({
          score,
          totalQuestions: quizData.questions.length,
          percentage: Math.round((score / quizData.questions.length) * 100),
          xpEarned,
          answers: [...answers, selectedAnswer],
        });
      } else {
        // Next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
      setIsSubmitting(false);
    }, 1500);
  }

  function calculateScore(userAnswers: number[]): number {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData.questions[index].correct ? 1 : 0);
    }, 0);
  }

  function getOptionStyle(index: number): any {
    const baseStyle = {
      backgroundColor: colors.cardBackground,
      borderColor: colors.border,
    };

    if (!showResult) {
      return {
        ...baseStyle,
        backgroundColor: selectedAnswer === index ? colors.primary + '20' : colors.cardBackground,
        borderColor: selectedAnswer === index ? colors.primary : colors.border,
      };
    }

    // Show correct/incorrect after submission
    if (index === currentQuestion.correct) {
      return {
        ...baseStyle,
        backgroundColor: colors.success + '20',
        borderColor: colors.success,
      };
    }

    if (selectedAnswer === index && index !== currentQuestion.correct) {
      return {
        ...baseStyle,
        backgroundColor: colors.error + '20',
        borderColor: colors.error,
      };
    }

    return baseStyle;
  }

  function renderQuestion() {
    return (
      <View style={styles.questionContainer}>
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

        <Text style={[styles.questionCounter, { color: colors.textSecondary }]}>
          Question {currentQuestionIndex + 1} / {quizData.questions.length}
        </Text>

        <Text style={[styles.questionText, { color: colors.text }]}>
          {currentQuestion.question}
        </Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                getOptionStyle(index),
                isSubmitting && styles.optionDisabled,
              ]}
              onPress={() => handleSelectAnswer(index)}
              disabled={showResult || isSubmitting}
            >
              <View
                style={[
                  styles.optionIndicator,
                  {
                    backgroundColor:
                      selectedAnswer === index ? colors.primary : colors.border,
                  },
                ]}
              >
                {showResult && index === currentQuestion.correct && (
                  <Icon name="check" size={16} color={colors.success} />
                )}
                {showResult &&
                  selectedAnswer === index &&
                  index !== currentQuestion.correct && (
                    <Icon name="close" size={16} color={colors.error} />
                  )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  { color: colors.text },
                  selectedAnswer === index && {
                    color: colors.primary,
                    fontWeight: '600',
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function renderResults() {
    const score = calculateScore(answers);
    const percentage = Math.round((score / quizData.questions.length) * 100);
    const xpEarned = Math.round((percentage / 100) * xpReward);

    return (
      <View style={styles.resultsContainer}>
        <View
          style={[
            styles.scoreCircle,
            {
              borderColor:
                percentage >= 80 ? colors.success : percentage >= 50 ? colors.warning : colors.error,
            },
          ]}
        >
          <Text
            style={[
              styles.scoreText,
              {
                color:
                  percentage >= 80
                    ? colors.success
                    : percentage >= 50
                    ? colors.warning
                    : colors.error,
              },
            ]}
          >
            {percentage}%
          </Text>
        </View>

        <Text style={[styles.resultsTitle, { color: colors.text }]}>Quiz Terminé!</Text>

        <Text style={[styles.resultsScore, { color: colors.textSecondary }]}>
          {score} / {quizData.questions.length} réponses correctes
        </Text>

        <View style={styles.xpContainer}>
          <Icon name="emoji-events" size={24} color={colors.xp} />
          <Text style={[styles.xpText, { color: colors.xp }]}>+{xpEarned} XP</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isSubmitting ? (
        <View style={styles.submittingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.submittingText, { color: colors.textSecondary }]}>
            {showResult ? 'Vérification...' : 'Enregistrement...'}
          </Text>
        </View>
      ) : (
        <>
          {renderQuestion()}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.exitButton, { borderColor: colors.border }]}
              onPress={onExit}
              disabled={isSubmitting}
            >
              <Icon name="close" size={20} color={colors.textSecondary} />
              <Text style={[styles.exitText, { color: colors.textSecondary }]}>
                Quitter
              </Text>
            </TouchableOpacity>

            {!showResult ? (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor:
                      selectedAnswer === null ? colors.border : colors.primary,
                  },
                ]}
                onPress={handleSubmitAnswer}
                disabled={selectedAnswer === null || isSubmitting}
              >
                <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>
                  {isLastQuestion ? 'Terminer' : 'Valider'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.submitButtonPlaceholder} />
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submittingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittingText: {
    marginTop: 16,
    fontSize: 16,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  questionCounter: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 8,
  },
  exitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonPlaceholder: {
    flex: 2,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 16,
    marginBottom: 24,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpText: {
    fontSize: 24,
    fontWeight: '700',
  },
});
