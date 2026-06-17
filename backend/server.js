import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { auth } from './middleware/auth.js';
import { register, login, getProfile } from './controllers/authController.js';
import { calculateCarbon, getHistory } from './controllers/carbonController.js';
import { getChallenges, completeChallenge } from './controllers/challengeController.js';
import { getReportData } from './controllers/reportController.js';
import { getAIRecommendations, generateChatResponse } from './services/aiService.js';
import db from './services/dbService.js';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & General Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', apiLimiter);

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/user/profile', auth, getProfile);

// Carbon Footprint Routes
app.post('/api/carbon/calculate', auth, calculateCarbon);
app.get('/api/carbon/history', auth, getHistory);

// Recommendations Route
app.get('/api/recommendations', auth, async (req, res) => {
  try {
    const history = await db.getCarbonHistory(req.user.id);
    if (history.length === 0) {
      return res.status(200).json([]);
    }
    const latest = history[history.length - 1];
    const recommendations = getAIRecommendations(latest.inputs, latest.breakdown);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Fetch recommendations error:', error);
    res.status(500).json({ message: 'Server error loading recommendations' });
  }
});

// Challenges Routes
app.get('/api/challenges', auth, getChallenges);
app.post('/api/challenges/complete', auth, completeChallenge);

// Reports Route
app.get('/api/reports', auth, getReportData);

// AI Chatbot Route
app.post('/api/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await db.findUserById(req.user.id);
    const history = await db.getCarbonHistory(req.user.id);
    const latest = history.length > 0 ? history[history.length - 1] : null;

    const response = await generateChatResponse(message, user, latest);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ message: 'Server error during chat response' });
  }
});

// Leaderboard Route (Custom Endpoint for Leaderboard Page)
app.get('/api/leaderboard', auth, async (req, res) => {
  try {
    const allDb = await db.read();
    
    // Get all users, sort by ecoScore descending, clean up password field
    const leaderboard = allDb.users
      .map(u => ({
        id: u.id,
        name: u.name,
        ecoScore: u.ecoScore || 100,
        createdAt: u.createdAt
      }))
      .sort((a, b) => b.ecoScore - a.ecoScore);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
