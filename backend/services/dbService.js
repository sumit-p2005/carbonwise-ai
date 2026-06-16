import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/db.json');

const DEFAULT_CHALLENGES = [
  { id: 'reusable-bottle', title: 'Use a reusable bottle', description: 'Avoid single-use plastic bottles today.', points: 10, category: 'waste' },
  { id: 'switch-lights', title: 'Switch off unused lights', description: 'Turn off lights and appliances when leaving a room.', points: 5, category: 'energy' },
  { id: 'walk-1km', title: 'Walk or cycle for 1 km', description: 'Replace a short car ride with walking or biking.', points: 15, category: 'transport' },
  { id: 'plant-tree', title: 'Plant a tree or tend to plants', description: 'Add some greenery to your living space or community.', points: 30, category: 'nature' },
  { id: 'avoid-plastic-bags', title: 'Avoid plastic bags', description: 'Bring your own cloth bag for shopping.', points: 10, category: 'waste' },
  { id: 'public-transit', title: 'Take public transit', description: 'Ride the bus or train instead of driving your car.', points: 20, category: 'transport' },
  { id: 'veggie-day', title: 'Eat a fully plant-based meal', description: 'Opt for a vegetarian or vegan lunch or dinner.', points: 15, category: 'food' }
];

const INITIAL_DB = {
  users: [],
  carbonHistory: [],
  challenges: DEFAULT_CHALLENGES,
  userChallenges: []
};

class DbService {
  constructor() {
    this.lock = false;
  }

  async init() {
    try {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      try {
        await fs.access(DB_PATH);
        // Load and verify schema
        const data = await this.read();
        let updated = false;
        if (!data.users) { data.users = []; updated = true; }
        if (!data.carbonHistory) { data.carbonHistory = []; updated = true; }
        if (!data.challenges || data.challenges.length === 0) { data.challenges = DEFAULT_CHALLENGES; updated = true; }
        if (!data.userChallenges) { data.userChallenges = []; updated = true; }
        if (updated) {
          await this.write(data);
        }
      } catch (err) {
        // Create initial db
        await this.write(INITIAL_DB);
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  async read() {
    try {
      const content = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to read database file, returning default schema:', error);
      return { users: [], carbonHistory: [], challenges: DEFAULT_CHALLENGES, userChallenges: [] };
    }
  }

  async write(data) {
    // Basic write locking to prevent corruption
    while (this.lock) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.lock = true;
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } finally {
      this.lock = false;
    }
  }

  // User Helpers
  async findUserByEmail(email) {
    const db = await this.read();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    const db = await this.read();
    return db.users.find(u => u.id === id);
  }

  async createUser(user) {
    const db = await this.read();
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      ecoScore: 100, // Starts at baseline 100
      createdAt: new Date().toISOString(),
      ...user
    };
    db.users.push(newUser);
    await this.write(db);
    return newUser;
  }

  async updateUserScore(userId, points) {
    const db = await this.read();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      db.users[userIndex].ecoScore = (db.users[userIndex].ecoScore || 100) + points;
      await this.write(db);
      return db.users[userIndex];
    }
    return null;
  }

  // Carbon History Helpers
  async getCarbonHistory(userId) {
    const db = await this.read();
    return db.carbonHistory
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async saveCarbonCalculation(userId, calcData) {
    const db = await this.read();
    const newRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      userId,
      createdAt: new Date().toISOString(),
      ...calcData
    };
    db.carbonHistory.push(newRecord);
    await this.write(db);
    return newRecord;
  }

  // Challenge Helpers
  async getChallenges() {
    const db = await this.read();
    return db.challenges;
  }

  async getUserChallenges(userId) {
    const db = await this.read();
    return db.userChallenges.filter(uc => uc.userId === userId);
  }

  async completeUserChallenge(userId, challengeId) {
    const db = await this.read();
    
    // Check if challenge exists
    const challenge = db.challenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if already completed today (simple check by date string)
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyCompleted = db.userChallenges.some(
      uc => uc.userId === userId && uc.challengeId === challengeId && uc.completedAt.startsWith(todayStr)
    );

    if (alreadyCompleted) {
      throw new Error('Challenge already completed today');
    }

    // Record completion
    const newCompletion = {
      userId,
      challengeId,
      completedAt: new Date().toISOString(),
      pointsEarned: challenge.points
    };

    db.userChallenges.push(newCompletion);
    await this.write(db);

    // Update user score
    const updatedUser = await this.updateUserScore(userId, challenge.points);
    return { completion: newCompletion, user: updatedUser };
  }
}

const db = new DbService();
db.init();

export default db;
