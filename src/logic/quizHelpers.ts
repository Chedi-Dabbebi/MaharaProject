import type { Skill } from '../types';
import type { Quiz, QuizQuestion, QuizSkill, QuizDifficulty } from '../types/quiz';
import { getQuestionsBySkillAndDifficulty, quizQuestions } from '../data/questions';

/**
 * Connects to the existing system that tracks completed tasks and
 * returns the list of completed task identifiers for a given skill and difficulty.
 * 
 * @param trackedSkills The current state of skills array containing task completion status
 * @param quizSkill The skill category to look for (e.g., 'music', 'programming')
 * @param difficulty The difficulty level to look for
 * @returns An array of unique task identifiers (taskIds) that are completed
 */
export function getCompletedTaskIdsForQuiz(
  trackedSkills: Skill[],
  quizSkill: QuizSkill,
  difficulty: QuizDifficulty
): string[] {
  // 1. Get all questions that match the requested skill and difficulty.
  // This serves as our source of truth for which tasks belong to which difficulty.
  const relevantQuestions = getQuestionsBySkillAndDifficulty(quizSkill, difficulty);
  
  // 2. Extract unique task identifiers from these questions.
  const uniqueTaskIds = Array.from(new Set(relevantQuestions.map(q => q.taskId)));
  
  // 3. Find the corresponding skill object in the tracked state.
  // We map the english QuizSkill enum to the french names used in the skills.ts data.
  const skillNameMap: Record<QuizSkill, string> = {
    'music': 'Musique',
    'photography': 'Photographie',
    'fitness': 'Fitness',
    'programming': 'Programmation'
  };
  
  const targetSkillName = skillNameMap[quizSkill];
  const targetSkill = trackedSkills.find(s => s.name === targetSkillName);
  
  if (!targetSkill) {
    return [];
  }

  // 4. Filter the unique task IDs to only include those that are marked as completed in the tracked state.
  const completedTaskIds = uniqueTaskIds.filter(taskId => {
    const trackedTask = targetSkill.tasks.find(t => t.id === taskId);
    return trackedTask !== undefined && trackedTask.completed === true;
  });

  return completedTaskIds;
}

/**
 * Retrieves all quiz questions linked to a specific list of task identifiers.
 * Each task contributes exactly 5 questions.
 * 
 * @param taskIds Array of task identifiers (e.g., ['m1', 'm2'])
 * @returns Array of all questions linked to the provided tasks, without randomization or limits.
 */
export function getQuestionsForTaskIds(taskIds: string[]): QuizQuestion[] {
  return quizQuestions.filter(q => taskIds.includes(q.taskId));
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Generates a 10-question quiz from a pool of available questions.
 * 
 * Rules:
 * - Each task must contribute at least 2 questions
 * - Total quiz size = 10 questions
 * - No duplicate questions
 * 
 * @param availableQuestions The pool of questions to select from
 * @returns A Quiz object containing exactly 10 questions (or max available)
 */
export function generateQuiz(availableQuestions: QuizQuestion[]): Quiz {
  // 1. Group questions by task
  const questionsByTask = new Map<string, QuizQuestion[]>();
  for (const q of availableQuestions) {
    const list = questionsByTask.get(q.taskId) || [];
    list.push(q);
    questionsByTask.set(q.taskId, list);
  }

  const selectedQuestions: QuizQuestion[] = [];
  const remainingQuestions: QuizQuestion[] = [];

  // 2. From each task, randomly pick 2 questions
  for (const questions of questionsByTask.values()) {
    const shuffled = shuffleArray(questions);
    
    // Pick up to 2 questions for this task
    const picked = shuffled.slice(0, 2);
    selectedQuestions.push(...picked);
    
    // Add the rest to remaining pool
    remainingQuestions.push(...shuffled.slice(2));
  }

  // Handle edge case: if there are more than 5 tasks, picking 2 from each yields > 10 questions.
  // We truncate to exactly 10 to ensure we respect "Total quiz size = 10".
  if (selectedQuestions.length > 10) {
    selectedQuestions.length = 10;
  }

  // 4. If total < 10, randomly pick more from remaining questions
  if (selectedQuestions.length < 10 && remainingQuestions.length > 0) {
    const shuffledRemaining = shuffleArray(remainingQuestions);
    const needed = 10 - selectedQuestions.length;
    const additional = shuffledRemaining.slice(0, needed);
    selectedQuestions.push(...additional);
  }

  // 5. Shuffle final result
  const finalQuestions = shuffleArray(selectedQuestions);

  return {
    id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    questions: finalQuestions,
    totalQuestions: finalQuestions.length,
  };
}

/**
 * Calculates the final score for a given quiz based on the user's selected answers.
 * 
 * @param quiz The quiz object containing the questions
 * @param userAnswers An array of numbers where each number represents the index of the choice selected by the user. The order matches the quiz.questions array.
 * @returns An object containing the raw score, the total number of questions, and a formatted string (e.g., "7/10")
 */
export function calculateQuizScore(quiz: Quiz, userAnswers: (number | null)[]): { score: number; total: number; formatted: string; rawScore: number } {
  let rawScore = 0;
  
  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    const userAnswer = userAnswers[i];
    
    if (userAnswer === question.correctAnswerIndex) {
      rawScore++;
    }
  }
  
  // Scale the score to be out of 10
  const score = Math.round((rawScore / quiz.totalQuestions) * 10);
  
  return {
    rawScore,
    score,
    total: 10,
    formatted: `${score}/10`,
  };
}

/**
 * Tracks user mistakes during a quiz and maps them to their respective tasks.
 * 
 * @param quiz The quiz object containing the questions
 * @param userAnswers An array of numbers representing the user's selected answers
 * @returns A record mapping task identifiers (taskId) to the number of incorrect answers (errors) for that task
 */
export function analyzeQuizMistakes(quiz: Quiz, userAnswers: (number | null)[]): Record<string, number> {
  const mistakesByTask: Record<string, number> = {};

  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    const userAnswer = userAnswers[i];

    // If answer is incorrect or omitted, increment error counter for this task
    if (userAnswer !== question.correctAnswerIndex) {
      if (!mistakesByTask[question.taskId]) {
        mistakesByTask[question.taskId] = 0;
      }
      mistakesByTask[question.taskId]++;
    }
  }

  return mistakesByTask;
}

/**
 * Identifies the task with the highest number of incorrect answers based on the error tracking data.
 * 
 * @param mistakesByTask A record mapping task identifiers to their number of errors
 * @returns The taskId with the most errors, or null if there are no errors
 */
export function getMostFailedTaskId(mistakesByTask: Record<string, number>): string | null {
  let mostFailedTaskId: string | null = null;
  let maxErrors = -1;

  for (const [taskId, errors] of Object.entries(mistakesByTask)) {
    if (errors > maxErrors) {
      maxErrors = errors;
      mostFailedTaskId = taskId;
    }
  }

  return mostFailedTaskId;
}

/**
 * Retrieves the title/name of a task using its unique identifier.
 * 
 * @param trackedSkills The current state of the skills array containing all tasks
 * @param taskId The identifier of the task to find
 * @returns The title of the task, or null if not found
 */
export function getTaskTitleById(trackedSkills: Skill[], taskId: string): string | null {
  for (const skill of trackedSkills) {
    const task = skill.tasks.find(t => t.id === taskId);
    if (task) {
      return task.title;
    }
  }
  return null;
}

/**
 * Evaluates the final score and returns descriptive grade details.
 * 
 * Grading scale:
 * - 0–4: "Faible" (Red, 😞)
 * - 5–6: "Passable" (Yellow-Orange, 😐)
 * - 7–8: "Bien" (Light Green, 👍)
 * - 9–10: "Excellent" (Dark Green, 🏆)
 * 
 * @param score The number of correct answers (expected to be out of 10)
 * @returns An object containing the grade label, color, and emoji
 */
export function getGradeDetails(score: number): { label: string; color: string; emoji: string } {
  if (score >= 9) {
    return { label: "Excellent", color: "#059669", emoji: "🏆" }; // Dark green
  } else if (score >= 7) {
    return { label: "Bien", color: "#10B981", emoji: "👍" }; // Light green
  } else if (score >= 5) {
    return { label: "Passable", color: "#F59E0B", emoji: "😐" }; // Yellow-orange
  } else {
    return { label: "Faible", color: "#EF4444", emoji: "😞" }; // Red
  }
}

/**
 * Generates a short personalized feedback message based on the weakest task description.
 * 
 * @param weakestTaskTitle The title/description of the task that had the most errors (can be null if perfect score)
 * @returns A short sentence encouraging improvement
 */
export function generateFeedbackMessage(weakestTaskTitle: string | null): string {
  if (!weakestTaskTitle) {
    return "Félicitations, vous maîtrisez parfaitement ces notions !";
  }
  
  // Clean up the title if needed (e.g., lowercase the first letter to fit in the sentence)
  const formattedTitle = weakestTaskTitle.charAt(0).toLowerCase() + weakestTaskTitle.slice(1);
  
  return `Concentrez-vous davantage sur : ${formattedTitle}.`;
}

/**
 * Generates a short motivational message based on the score.
 * 
 * @param score The number of correct answers
 * @returns A short motivational sentence
 */
export function getMotivationalMessage(score: number): string {
  if (score >= 8) {
    return "Incroyable ! Vous maîtrisez le sujet.";
  } else if (score >= 5) {
    return "Bon travail ! Continuez sur cette lancée.";
  } else {
    return "Ne vous découragez pas, la pratique fait la perfection !";
  }
}
