import { test, expect } from 'vitest';
import { getAIRecommendations } from '../services/aiService.js';

test('prioritizes transport recommendations for high car usage', () => {
  const recommendations = getAIRecommendations(
    { carDistance: 30, monthlyElectricity: 120, dietType: 'mixed', weeklyWaste: 2 },
    { transport: 162, energy: 45.6, food: 208, waste: 4.33 }
  );

  expect(recommendations.some((item) => item.id === 'carpool')).toBe(true);
  expect(recommendations.some((item) => item.category === 'transport')).toBe(true);
});

test('returns onboarding recommendation when no calculation data exists', () => {
  const recommendations = getAIRecommendations({}, {});

  expect(recommendations[0].id).toBe('calc-first');
  expect(recommendations[0].priorityLevel).toBe('High');
});
