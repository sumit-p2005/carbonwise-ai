import db from '../services/dbService.js';

// Emission Factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  car: 0.18,        // per km
  bus: 0.089,       // per km
  train: 0.041,     // per km
  bike: 0,          // per km
  walk: 0,          // per km
  electricity: 0.38, // per kWh
  waste: 0.5        // per kg of waste
};

// Food monthly estimates (kg CO2)
const DIET_FACTORS = {
  vegetarian: 125,      // ~1.5 tons/year
  mixed: 208,           // ~2.5 tons/year
  'non-vegetarian': 275 // ~3.3 tons/year
};

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

    // Validation
    if (isNaN(bikeDistance) || isNaN(walkingDistance) || isNaN(carDistance) || isNaN(busDistance) || isNaN(trainDistance)) {
      return res.status(400).json({ message: 'Distance values must be numbers' });
    }
    if (isNaN(monthlyElectricity)) {
      return res.status(400).json({ message: 'Electricity must be a number' });
    }
    if (isNaN(weeklyWaste)) {
      return res.status(400).json({ message: 'Waste must be a number' });
    }
    if (!['vegetarian', 'mixed', 'non-vegetarian'].includes(dietType)) {
      return res.status(400).json({ message: 'Invalid diet type' });
    }

    // Calculations (Monthly basis - 30 days or 4.33 weeks per month)
    const transportCar = carDistance * 30 * EMISSION_FACTORS.car;
    const transportBus = busDistance * 30 * EMISSION_FACTORS.bus;
    const transportTrain = trainDistance * 30 * EMISSION_FACTORS.train;
    const transportBike = bikeDistance * 30 * EMISSION_FACTORS.bike;
    const transportWalk = walkingDistance * 30 * EMISSION_FACTORS.walk;
    const totalTransport = transportCar + transportBus + transportTrain + transportBike + transportWalk;

    const totalEnergy = monthlyElectricity * EMISSION_FACTORS.electricity;
    const totalFood = DIET_FACTORS[dietType] || DIET_FACTORS.mixed;
    const totalWaste = weeklyWaste * 4.33 * EMISSION_FACTORS.waste;

    const totalMonthly = totalTransport + totalEnergy + totalFood + totalWaste;
    const totalYearly = totalMonthly * 12;

    // Calculate Sustainability Score (out of 100)
    // Average monthly emissions per person is ~800 kg CO2.
    // Score declines as emissions exceed 150 kg (ideal low-carbon lifestyle).
    let score = Math.round(100 - (totalMonthly / 15));
    score = Math.max(10, Math.min(100, score)); // clamp between 10 and 100

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

    const breakdown = {
      transport: Math.round(totalTransport * 100) / 100,
      energy: Math.round(totalEnergy * 100) / 100,
      food: Math.round(totalFood * 100) / 100,
      waste: Math.round(totalWaste * 100) / 100
    };

    const newRecord = await db.saveCarbonCalculation(userId, {
      inputs,
      breakdown,
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalYearly * 100) / 100,
      score
    });

    // Update user's general ecoScore to match or align with this calculation score
    const user = await db.findUserById(userId);
    // Let's adjust user ecoScore. If user has active challenge completions, they are added to this baseline.
    const completedChallenges = await db.getUserChallenges(userId);
    const challengeBonus = completedChallenges.reduce((sum, c) => sum + c.pointsEarned, 0);
    const newEcoScore = score + challengeBonus;

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
