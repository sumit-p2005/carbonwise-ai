import { test, expect } from 'vitest';
import db from '../services/dbService.js';

test('database service initializes with default challenges', async () => {
  await db.init();
  const challenges = await db.getChallenges();
  expect(challenges.length).toBeGreaterThan(0);
  expect(challenges[0].id).toBe('reusable-bottle');
});

test('creates and queries users safely', async () => {
  const email = `test-${Math.random()}@example.com`;
  const user = await db.createUser({
    name: 'Test Tester',
    email,
    password: 'hashedpassword'
  });

  expect(user.id).toBeDefined();
  expect(user.name).toBe('Test Tester');
  expect(user.email).toBe(email);
  expect(user.ecoScore).toBe(100);

  const found = await db.findUserById(user.id);
  expect(found.id).toBe(user.id);

  const foundByEmail = await db.findUserByEmail(email);
  expect(foundByEmail.id).toBe(user.id);
});

test('updates user score correctly', async () => {
  const email = `test-score-${Math.random()}@example.com`;
  const user = await db.createUser({
    name: 'Score Tester',
    email,
    password: 'hashedpassword'
  });

  const updated = await db.updateUserScore(user.id, 25);
  expect(updated.ecoScore).toBe(125);

  const check = await db.findUserById(user.id);
  expect(check.ecoScore).toBe(125);
});

test('saves carbon calculation logs', async () => {
  const userId = 'user-calc-test-123';
  const calcData = {
    inputs: { carDistance: 10, monthlyElectricity: 150, dietType: 'vegetarian', weeklyWaste: 2 },
    breakdown: { transport: 54, energy: 57, food: 125, waste: 4.33 },
    totalMonthly: 240.33,
    totalYearly: 2883.96,
    score: 84
  };

  const record = await db.saveCarbonCalculation(userId, calcData);
  expect(record.id).toBeDefined();
  expect(record.userId).toBe(userId);
  expect(record.totalMonthly).toBe(240.33);

  const history = await db.getCarbonHistory(userId);
  expect(history.length).toBe(1);
  expect(history[0].id).toBe(record.id);
});
