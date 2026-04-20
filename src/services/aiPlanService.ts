import { Difficulty, GeneratedPlan } from '../logic/planGenerator';
import { Skill } from '../data/skills';

const runtimeEnv =
  typeof process !== 'undefined' && process.env
    ? process.env
    : ({} as Record<string, string | undefined>);

const PLAN_API_URL = runtimeEnv.PLAN_API_URL ?? '';

interface GenerateAIPlanInput {
  skill: Skill;
  difficulty: Difficulty;
  weeklyTimeBudgetMinutes?: number;
}

export async function generatePlanWithAI(
  input: GenerateAIPlanInput,
): Promise<GeneratedPlan | null> {
  if (!PLAN_API_URL) {
    return null;
  }

  try {
    const response = await fetch(`${PLAN_API_URL.replace(/\/$/, '')}/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillId: input.skill.id,
        skillName: input.skill.name,
        difficulty: input.difficulty,
        level: input.skill.level,
        progress: input.skill.progress,
        weeklyTimeBudgetMinutes: input.weeklyTimeBudgetMinutes ?? 240,
        tasks: input.skill.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          duration: task.duration,
          xp: task.xp,
          completed: task.completed,
        })),
      }),
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as Partial<GeneratedPlan>;
    if (
      !json ||
      typeof json.skillId !== 'string' ||
      typeof json.difficulty !== 'string' ||
      typeof json.sessionsPerWeek !== 'number' ||
      typeof json.weeklyTime !== 'string' ||
      !Array.isArray(json.recommendedTaskIds)
    ) {
      return null;
    }

    const taskById = new Map(input.skill.tasks.map((task) => [task.id, task]));
    const skillId = json.skillId;
    const parsedDifficulty = json.difficulty;
    const sessionsPerWeek = json.sessionsPerWeek;
    const weeklyTime = json.weeklyTime;
    const recommendedTaskIds = json.recommendedTaskIds;
    if (
      typeof skillId !== 'string' ||
      (parsedDifficulty !== 'facile' && parsedDifficulty !== 'moyen' && parsedDifficulty !== 'difficile') ||
      typeof sessionsPerWeek !== 'number' ||
      typeof weeklyTime !== 'string' ||
      !Array.isArray(recommendedTaskIds)
    ) {
      return null;
    }

    const sessions =
      Array.isArray(json.sessions) && json.sessions.length > 0
        ? json.sessions
        : recommendedTaskIds
            .map((taskId, index) => {
              const task = taskById.get(taskId);
              if (!task) {
                return null;
              }
              return {
                dayLabel: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index % 7],
                taskId: task.id,
                taskTitle: task.title,
                duration: task.duration,
                xp: task.xp,
              };
            })
            .filter((session): session is NonNullable<typeof session> => Boolean(session));

    return {
      skillId,
      difficulty: parsedDifficulty,
      sessionsPerWeek,
      weeklyTime,
      recommendedTaskIds,
      sessions,
      summary: json.summary ?? `Plan ${parsedDifficulty}`,
    };
  } catch {
    return null;
  }
}
