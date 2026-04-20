import { Skill } from '../data/skills';

function computeProgress(completedXp: number, totalXp: number): number {
  if (totalXp <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((completedXp / totalXp) * 100));
}

function computeLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 150) + 1);
}

export function recalculateSkill(skill: Skill): Skill {
  const completedTasks = skill.tasks.filter((task) => task.completed);
  const completedXp = completedTasks.reduce((sum, task) => sum + task.xp, 0);
  const totalTaskXp = skill.tasks.reduce((sum, task) => sum + task.xp, 0);

  return {
    ...skill,
    xp: completedXp,
    maxXp: Math.max(totalTaskXp, 1),
    progress: computeProgress(completedXp, totalTaskXp),
    level: computeLevel(completedXp),
    streak: completedTasks.length,
  };
}

export function toggleTaskForSkill(skill: Skill, taskId: string): Skill {
  const updatedTasks = skill.tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task,
  );

  return recalculateSkill({
    ...skill,
    tasks: updatedTasks,
  });
}

export function recalculateAllSkills(skills: Skill[]): Skill[] {
  return skills.map(recalculateSkill);
}
