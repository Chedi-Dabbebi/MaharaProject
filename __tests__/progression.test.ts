import { recalculateSkill, toggleTaskForSkill } from '../src/logic/progression';
import { skills } from '../src/data/skills';

describe('progression logic', () => {
  test('recalculateSkill derives xp/progress/level from tasks', () => {
    const sample = skills[0];
    const result = recalculateSkill(sample);
    const completedXp = sample.tasks.filter((t) => t.completed).reduce((s, t) => s + t.xp, 0);
    const maxXp = sample.tasks.reduce((s, t) => s + t.xp, 0);

    expect(result.xp).toBe(completedXp);
    expect(result.maxXp).toBe(maxXp);
    expect(result.progress).toBe(Math.min(100, Math.round((completedXp / maxXp) * 100)));
    expect(result.level).toBeGreaterThanOrEqual(1);
  });

  test('toggleTaskForSkill flips one task and updates derived fields', () => {
    const sample = recalculateSkill(skills[1]);
    const target = sample.tasks.find((t) => !t.completed);
    expect(target).toBeDefined();
    const updated = toggleTaskForSkill(sample, target!.id);

    const prevTask = sample.tasks.find((t) => t.id === target!.id)!;
    const nextTask = updated.tasks.find((t) => t.id === target!.id)!;
    expect(nextTask.completed).toBe(!prevTask.completed);
    expect(updated.xp).not.toBe(sample.xp);
  });
});
