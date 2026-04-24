// Domain type definitions for the Android Flaw application

export type Difficulty = 'facile' | 'moyen' | 'difficile';

export interface TaskIdentifier {
  id: string;
  skill: string;
  difficulty: Difficulty;
}

export interface Task {
  id: string;
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
  prompt?: string;
  items?: string[];
  reference?: TaskIdentifier;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  tasks: Task[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar_url?: string;
  weekly_time_budget_minutes?: number;
}

export interface PlannedSession {
  dayLabel: string;
  taskId: string;
  taskTitle: string;
  duration: string;
  xp: number;
}

export interface GeneratedPlan {
  skillId: string;
  difficulty: Difficulty;
  sessionsPerWeek: number;
  weeklyTime: string;
  recommendedTaskIds: string[];
  sessions: PlannedSession[];
  summary: string;
}

export * from './quiz';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'streak' | 'xp' | 'social';
  requirementType: 'count' | 'days' | 'total_xp';
  requirementValue: number;
  xpReward: number;
  isHidden: boolean;
}

export interface UserAchievement {
  achievement: Achievement;
  progressCurrent: number;
  progressRequired: number;
  isCompleted: boolean;
  unlockedAt?: Date;
}

// Legacy types used by older components (LessonScreen, Quiz)
export interface QuizData {
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  xpEarned: number;
  answers: number[];
}

export interface LearningContent {
  id: string;
  contentType: 'lesson' | 'exercise' | 'quiz' | 'resource';
  title: string;
  xpReward: number;
  quizData?: QuizData;
}
