export type QuizSkill = 'music' | 'photography' | 'fitness' | 'programming';
export type QuizDifficulty = 'facile' | 'moyen' | 'difficile';

export interface QuizQuestion {
  id: string;
  text: string;
  choices: [string, string, string, string];
  correctAnswerIndex: number;
  skill: QuizSkill;
  difficulty: QuizDifficulty;
  taskId: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  totalQuestions: number;
}
