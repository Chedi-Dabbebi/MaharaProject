// Domain type definitions for the Android Flaw application

export interface Task {
  id: string;
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
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
  weekly_time_budget_minutes?: number;
}

export type Difficulty = 'facile' | 'moyen' | 'difficile';

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
