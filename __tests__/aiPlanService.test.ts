import { generatePlanWithAI } from '../src/services/aiPlanService';
import { skills } from '../src/data/skills';

describe('aiPlanService', () => {
  test('returns null when PLAN_API_URL is not configured', async () => {
    const result = await generatePlanWithAI({
      skill: skills[0],
      difficulty: 'moyen',
    });
    expect(result).toBeNull();
  });
});
