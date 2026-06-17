import { test, expect } from 'vitest';
import { register, login } from '../controllers/authController.js';
import { calculateCarbon } from '../controllers/carbonController.js';
import db from '../services/dbService.js';

// Mock Response Helper
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

test('register controller inserts user and signs JWT', async () => {
  const email = `api-test-${Math.random()}@example.com`;
  const req = {
    body: {
      name: 'API Tester',
      email,
      password: 'password123'
    }
  };
  
  const res = mockResponse();
  await register(req, res);

  expect(res.statusCode).toBe(201);
  expect(res.body.token).toBeDefined();
  expect(res.body.user.name).toBe('API Tester');
});

test('login controller validates credentials', async () => {
  const email = `api-login-${Math.random()}@example.com`;
  // Create user directly
  const reqRegister = {
    body: {
      name: 'Login Tester',
      email,
      password: 'password123'
    }
  };
  const resRegister = mockResponse();
  await register(reqRegister, resRegister);

  // Attempt login
  const reqLogin = {
    body: {
      email,
      password: 'password123'
    }
  };
  const resLogin = mockResponse();
  await login(reqLogin, resLogin);

  expect(resLogin.statusCode).toBe(200);
  expect(resLogin.body.token).toBeDefined();
});

test('carbon calculate controller computes and stores footprints', async () => {
  const email = `api-calc-${Math.random()}@example.com`;
  const user = await db.createUser({
    name: 'Calc User',
    email,
    password: 'hashedpassword'
  });

  const req = {
    user: { id: user.id },
    body: {
      carDistance: 10,
      busDistance: 5,
      trainDistance: 0,
      bikeDistance: 2,
      walkingDistance: 1,
      monthlyElectricity: 200,
      dietType: 'vegetarian',
      weeklyWaste: 3
    }
  };

  const res = mockResponse();
  await calculateCarbon(req, res);

  expect(res.statusCode).toBe(201);
  expect(res.body.record.totalMonthly).toBeGreaterThan(0);
  expect(res.body.ecoScore).toBeGreaterThan(0);
});
