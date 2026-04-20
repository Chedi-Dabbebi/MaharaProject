import { generatePlan } from '../src/logic/planGenerator';
import { skills } from '../src/data/skills';

describe('plan generator', () => {
  test('returns consistent plan shape and values', () => {
    const skill = skills[0];
    const plan = generatePlan(skill, 'moyen');

    expect(plan.skillId).toBe(skill.id);
    expect(plan.difficulty).toBe('moyen');
    expect(plan.sessionsPerWeek).toBeGreaterThan(0);
    expect(plan.weeklyTime.length).toBeGreaterThan(0);
    expect(plan.recommendedTaskIds.length).toBeGreaterThan(0);
    expect(plan.sessions.length).toBe(plan.sessionsPerWeek);
    expect(plan.sessions[0]).toHaveProperty('taskTitle');
    expect(plan.sessions.every((session) => plan.recommendedTaskIds.includes(session.taskId))).toBe(true);
    expect(plan.summary).toContain(skill.name);
  });

  test('harder difficulty should not produce fewer sessions than easier one', () => {
    const skill = skills[2];
    const easyPlan = generatePlan(skill, 'facile');
    const hardPlan = generatePlan(skill, 'difficile');

    expect(hardPlan.sessionsPerWeek).toBeGreaterThanOrEqual(easyPlan.sessionsPerWeek);
  });
});
