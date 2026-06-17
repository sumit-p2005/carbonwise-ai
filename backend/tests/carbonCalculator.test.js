import { test, expect } from 'vitest';
import { calculateCarbonFootprint, validateCarbonInputs } from '../services/carbonCalculator.js';

test('calculates a monthly carbon footprint with category breakdowns', () => {
  const result = calculateCarbonFootprint({
    carDistance: 5,
    busDistance: 2,
    trainDistance: 0,
    bikeDistance: 1,
    walkingDistance: 1,
    monthlyElectricity: 180,
    dietType: 'mixed',
    weeklyWaste: 4
  });

  expect(result.breakdown.transport).toBe(32.34);
  expect(result.breakdown.energy).toBe(68.4);
  expect(result.breakdown.food).toBe(208);
  expect(result.breakdown.waste).toBe(8.66);
  expect(result.totalMonthly).toBe(317.4);
  expect(result.totalYearly).toBe(3808.8);
  expect(result.score).toBe(79);
});

test('rejects unsupported diet types', () => {
  const validation = validateCarbonInputs({ dietType: 'unknown' });

  expect(validation.valid).toBe(false);
  expect(validation.message).toBe('Invalid diet type');
});

test('rejects negative numeric inputs', () => {
  expect(() => calculateCarbonFootprint({ carDistance: -1 })).toThrow(/carDistance must be a non-negative number/);
});
