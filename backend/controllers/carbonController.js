import db from '../services/dbService.js';
import { calculateCarbonFootprint, validateCarbonInputs } from '../services/carbonCalculator.js';

export const calculateCarbon = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bikeDistance = 0,
      walkingDistance = 0,
      carDistance = 0,
      busDistance = 0,
      trainDistance = 0,
      monthlyElectricity = 0,
      dietType = 'mixed',
      weeklyWaste = 0
    } = req.body;

    const inputs = {
      bikeDistance,
      walkingDistance,
      carDistance,
      busDistance,
      trainDistance,
      monthlyElectricity,
      dietType,
      weeklyWaste
    };

    const validation = validateCarbonInputs(inputs);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const calculation = calculateCarbonFootprint(inputs);

    const newRecord = await db.saveCarbonCalculation(userId, {
      ...calculation
    });

    // Update user's general ecoScore to match or align with this calculation score
    // Let's adjust user ecoScore. If user has active challenge completions, they are added to this baseline.
    const completedChallenges = await db.getUserChallenges(userId);
    const challengeBonus = completedChallenges.reduce((sum, c) => sum + c.pointsEarned, 0);
    const newEcoScore = calculation.score + challengeBonus;

    // Directly modify user score in DB
    const allDb = await db.read();
    const uIdx = allDb.users.findIndex(u => u.id === userId);
    if (uIdx !== -1) {
      allDb.users[uIdx].ecoScore = newEcoScore;
      await db.write(allDb);
    }

    res.status(201).json({
      record: newRecord,
      ecoScore: newEcoScore
    });
  } catch (error) {
    console.error('Carbon calculation error:', error);
    res.status(500).json({ message: 'Server error during carbon calculation' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await db.getCarbonHistory(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error fetching carbon history' });
  }
};
