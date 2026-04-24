import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { HomeStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton } from '../components/ui/PrimaryButton';

export function QuizScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'QuizScreen'>>();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  
  const quiz = route.params.quiz;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(quiz.totalQuestions).fill(null));

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.totalQuestions - 1;

  const hasAnswered = selectedIndex !== null;
  const isWrong = hasAnswered && selectedIndex !== currentQuestion.correctAnswerIndex;

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = index;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // @ts-ignore
      navigation.replace('QuizResultScreen', { quiz, userAnswers });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedIndex(null);
      setShowCorrectAnswer(false);
    }
  };

  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Text style={{ color: colors.textPrimary, textAlign: 'center' }}>Aucune question trouvée.</Text>
        <PrimaryButton onPress={() => navigation.goBack()}>Retour</PrimaryButton>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: colors.textPrimary }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {currentIndex + 1} / {quiz.totalQuestions}
        </Text>
        <View style={{ width: 40 }} /> {/* Spacer to center progress text */}
      </View>

      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={[styles.skillBadge, { color: colors.primary, backgroundColor: colors.primary + '20' }]}>
            {currentQuestion.skill.toUpperCase()} • {currentQuestion.difficulty.toUpperCase()}
          </Text>
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {currentQuestion.text}
          </Text>
        </View>

        <View style={styles.choicesContainer}>
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;
            const isRevealed = showCorrectAnswer && isCorrectAnswer;
            
            // Determine styles based on state
            let borderColor = colors.border;
            let textColor = colors.textPrimary;
            let feedbackText = null;
            let feedbackColor = '';

            if (hasAnswered) {
              if (isSelected) {
                if (isCorrectAnswer) {
                  borderColor = '#10B981'; // Green
                  textColor = '#10B981';
                  feedbackText = 'Bonne réponse !';
                  feedbackColor = '#10B981';
                } else {
                  borderColor = '#EF4444'; // Red
                  textColor = '#EF4444';
                  feedbackText = 'Mauvaise réponse.';
                  feedbackColor = '#EF4444';
                }
              } else if (isRevealed) {
                borderColor = '#10B981';
                textColor = '#10B981';
              }
            } else if (isSelected) {
              borderColor = colors.primary;
              textColor = colors.primary;
            }

            return (
              <View key={index}>
                <TouchableOpacity
                  style={[
                    styles.choiceButton,
                    { backgroundColor: colors.surface, borderColor },
                    (isSelected || isRevealed) && styles.choiceButtonSelected
                  ]}
                  onPress={() => handleSelect(index)}
                  activeOpacity={hasAnswered ? 1 : 0.7}
                >
                  <View style={[
                    styles.radioIndicator,
                    { borderColor: (isSelected || isRevealed) ? textColor : colors.textMuted },
                    (isSelected || isRevealed) && { backgroundColor: textColor }
                  ]}>
                    {(isSelected || isRevealed) && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[
                    styles.choiceText,
                    { color: (isSelected || isRevealed) ? textColor : colors.textPrimary },
                    (isSelected || isRevealed) && styles.choiceTextSelected
                  ]}>
                    {choice}
                  </Text>
                </TouchableOpacity>
                {feedbackText && (
                  <Text style={[styles.feedbackText, { color: feedbackColor }]}>
                    {feedbackText}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {isWrong && !showCorrectAnswer && (
          <TouchableOpacity 
            style={styles.revealButton} 
            onPress={() => setShowCorrectAnswer(true)}
          >
            <Text style={[styles.revealText, { color: colors.primary }]}>Voir la bonne réponse</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: tabBarHeight + 24 }]}>
        <PrimaryButton 
          onPress={handleNext} 
          disabled={selectedIndex === null}
        >
          {isLastQuestion ? 'Terminer' : 'Suivant'}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  questionContainer: {
    marginBottom: 40,
  },
  skillBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  choicesContainer: {
    gap: 16,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  choiceButtonSelected: {
    borderWidth: 2,
  },
  radioIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  choiceTextSelected: {
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  feedbackText: {
    marginTop: 8,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  revealButton: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(99, 102, 241, 0.1)', // Subtle primary background
  },
  revealText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
