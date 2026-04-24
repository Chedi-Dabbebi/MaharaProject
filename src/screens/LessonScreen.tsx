import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import type { LearningContent, QuizResult } from '../types';
import { getSkillContent } from '../services/skillsCatalogService';
import { LessonViewer } from '../components/LessonViewer';
import { Quiz } from '../components/Quiz';

type LessonScreenRouteProp = RouteProp<{
  params: {
    contentId: string;
    skillId: string;
    onComplete?: (completed: boolean, xpEarned: number) => void;
  };
}, 'params'>;

export function LessonScreen() {
  const route = useRoute<LessonScreenRouteProp>();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { contentId, skillId, onComplete } = route.params;

  const [content, setContent] = useState<LearningContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    loadContent();
  }, [contentId, skillId]);

  async function loadContent() {
    setLoading(true);
    try {
      const { lessons, exercises, quizzes, resources } = await getSkillContent(skillId);
      const allContent = [...lessons, ...exercises, ...quizzes, ...resources];
      const foundContent = allContent.find(c => c.id === contentId);

      if (foundContent) {
        setContent(foundContent);

        // Auto-show quiz if content is a quiz
        if (foundContent.contentType === 'quiz' && foundContent.quizData) {
          setShowQuiz(true);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLessonComplete() {
    // Mark content as completed
    if (onComplete) {
      onComplete(true, content?.xpReward || 0);
    }
    navigation.goBack();
  }

  function handleQuizComplete(result: QuizResult) {
    // Mark quiz as completed with score
    if (onComplete) {
      onComplete(true, result.xpEarned);
    }
    navigation.goBack();
  }

  function handleQuizExit() {
    // User exited quiz without completing
    navigation.goBack();
  }

  function handleLessonExit() {
    navigation.goBack();
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <View style={styles.errorContent}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.error + '20' }]}>
              <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 8, height: 48, backgroundColor: colors.error, borderRadius: 4 }} />
                <View style={{ width: 48, height: 8, backgroundColor: colors.error, borderRadius: 4, position: 'absolute' }} />
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <View style={{ width: 60, height: 4, backgroundColor: colors.border, borderRadius: 2 }} />
          </View>
        </View>
      </View>
    );
  }

  if (showQuiz && content.quizData) {
    return (
      <Quiz
        quizData={content.quizData}
        xpReward={content.xpReward}
        onComplete={handleQuizComplete}
        onExit={handleQuizExit}
      />
    );
  }

  return (
    <LessonViewer
      content={content}
      onComplete={handleLessonComplete}
      onExit={handleLessonExit}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
