import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

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
    this.data = null;
  }

  async init() {
    try {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      try {
        await fs.access(DB_PATH);
        this.data = await this.readFromFile();
        let updated = false;
        if (!this.data.users) { this.data.users = []; updated = true; }
        if (!this.data.carbonHistory) { this.data.carbonHistory = []; updated = true; }
        if (!this.data.challenges || this.data.challenges.length === 0) { this.data.challenges = DEFAULT_CHALLENGES; updated = true; }
        if (!this.data.userChallenges) { this.data.userChallenges = []; updated = true; }
        if (updated) {
          await this.writeToFile(this.data);
        }
      } catch (err) {
        this.data = { ...INITIAL_DB };
        await this.writeToFile(INITIAL_DB);
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  async readFromFile() {
    try {
      const content = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to read database file, returning default schema:', error);
      return { users: [], carbonHistory: [], challenges: DEFAULT_CHALLENGES, userChallenges: [] };
    }
  }

  async writeToFile(data) {
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

  async read() {
    if (!this.data) {
      this.data = await this.readFromFile();
    }
    return this.data;
  }

  async write(data) {
    this.data = data;
    // Perform background disk write to avoid blocking the event loop
    this.writeToFile(data).catch(err => {
      console.error('Database write error:', err);
    });
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
    // Destructure and sanitize properties to prevent JSON property override vulnerabilities
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name: String(user.name || ''),
      email: String(user.email || '').toLowerCase(),
      password: String(user.password || ''),
      ecoScore: 100, // Starts at baseline 100
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    await this.write(db);
    return newUser;
  }

  async updateUserScore(userId, points) {
    const db = await this.read();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      db.users[userIndex].ecoScore = (db.users[userIndex].ecoScore || 100) + Number(points);
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
      userId: String(userId),
      createdAt: new Date().toISOString(),
      inputs: {
        bikeDistance: Number(calcData.inputs?.bikeDistance ?? 0),
        walkingDistance: Number(calcData.inputs?.walkingDistance ?? 0),
        carDistance: Number(calcData.inputs?.carDistance ?? 0),
        busDistance: Number(calcData.inputs?.busDistance ?? 0),
        trainDistance: Number(calcData.inputs?.trainDistance ?? 0),
        monthlyElectricity: Number(calcData.inputs?.monthlyElectricity ?? 0),
        dietType: String(calcData.inputs?.dietType ?? 'mixed'),
        weeklyWaste: Number(calcData.inputs?.weeklyWaste ?? 0)
      },
      breakdown: {
        transport: Number(calcData.breakdown?.transport ?? 0),
        energy: Number(calcData.breakdown?.energy ?? 0),
        food: Number(calcData.breakdown?.food ?? 0),
        waste: Number(calcData.breakdown?.waste ?? 0)
      },
      totalMonthly: Number(calcData.totalMonthly ?? 0),
      totalYearly: Number(calcData.totalYearly ?? 0),
      score: Number(calcData.score ?? 0)
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
      userId: String(userId),
      challengeId: String(challengeId),
      completedAt: new Date().toISOString(),
      pointsEarned: Number(challenge.points)
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
