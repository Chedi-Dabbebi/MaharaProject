import { generatePlanWithAI } from './aiPlanService';
import { skills } from '../data/skills';

describe('aiPlanService', () => {
  test('returns null when PLAN_API_URL is not configured', async () => {
    const result = await generatePlanWithAI({
      skill: skills[0],
      difficulty: 'moyen',
    });
    expect(result).toBeNull();
  });
});
