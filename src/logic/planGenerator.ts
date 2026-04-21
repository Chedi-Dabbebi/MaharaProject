import type { Skill, Difficulty, PlannedSession, GeneratedPlan } from '../types';

const baseSessions: Record<Difficulty, number> = {
  facile: 3,
  moyen: 5,
  difficile: 7,
};

const baseMinutes: Record<Difficulty, number> = {
  facile: 150,
  moyen: 240,
  difficile: 360,
};

function toReadableTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins} min`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${mins.toString().padStart(2, '0')}`;
}

function parseMinutes(duration: string): number {
  const normalized = duration.toLowerCase();
  const hourMatch = normalized.match(/(\d+)\s*h/);
  const minMatch = normalized.match(/(\d+)\s*min/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minMatch ? Number(minMatch[1]) : 0;
  if (!hours && !minutes) {
    const direct = Number(normalized.replace(/\D/g, ''));
    return Number.isFinite(direct) ? direct : 0;
  }
  return hours * 60 + minutes;
}

function preferredXp(taskXp: number, difficulty: Difficulty): number {
  if (difficulty === 'facile') {
    return taskXp;
  }
  if (difficulty === 'moyen') {
    return Math.abs(taskXp - 60);
  }
  return -taskXp;
}

export function generatePlan(skill: Skill, difficulty: Difficulty): GeneratedPlan {
  const progressModifier = skill.progress < 40 ? 1 : 0;
  const sessionsPerWeek = baseSessions[difficulty] + progressModifier;
  const targetWeeklyMinutes = baseMinutes[difficulty] + progressModifier * 30;

  const orderedTasks = [...skill.tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }
    const aScore = preferredXp(a.xp, difficulty);
    const bScore = preferredXp(b.xp, difficulty);
    return bScore - aScore;
  });

  const uniqueRecommendedTasks = orderedTasks.slice(
    0,
    Math.min(sessionsPerWeek, orderedTasks.length),
  );
  const recommendedTaskIds = uniqueRecommendedTasks.map((task) => task.id);

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const sessions: PlannedSession[] = [];
  let totalMinutes = 0;
  for (let index = 0; index < sessionsPerWeek; index += 1) {
    const task = uniqueRecommendedTasks[index % uniqueRecommendedTasks.length];
    sessions.push({
      dayLabel: weekDays[index % weekDays.length],
      taskId: task.id,
      taskTitle: task.title,
      duration: task.duration,
      xp: task.xp,
    });
    totalMinutes += parseMinutes(task.duration);
  }

  const weeklyMinutes = totalMinutes > 0 ? totalMinutes : targetWeeklyMinutes;

  const completionCount = uniqueRecommendedTasks.filter((task) => task.completed).length;
  const completedHint =
    completionCount > 0
      ? `${completionCount} tâche(s) de révision et ${uniqueRecommendedTasks.length - completionCount} nouvelle(s).`
      : `${uniqueRecommendedTasks.length} nouvelles tâches recommandées.`;

  return {
    skillId: skill.id,
    difficulty,
    sessionsPerWeek,
    weeklyTime: toReadableTime(weeklyMinutes),
    recommendedTaskIds,
    sessions,
    summary: `Plan ${difficulty}: ${sessionsPerWeek} séances pour ${skill.name} (${toReadableTime(weeklyMinutes)}). ${completedHint}`,
  };
}
