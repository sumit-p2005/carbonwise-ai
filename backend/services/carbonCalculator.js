export const EMISSION_FACTORS = {
  car: 0.18,
  bus: 0.089,
  train: 0.041,
  bike: 0,
  walk: 0,
  electricity: 0.38,
  waste: 0.5
};

export const DIET_FACTORS = {
  vegetarian: 125,
  mixed: 208,
  'non-vegetarian': 275
};

export const SUPPORTED_DIETS = Object.keys(DIET_FACTORS);

const roundTwo = (value) => Math.round(value * 100) / 100;

export const validateCarbonInputs = (inputs = {}) => {
  const numericFields = [
    'bikeDistance',
    'walkingDistance',
    'carDistance',
    'busDistance',
    'trainDistance',
    'monthlyElectricity',
    'weeklyWaste'
  ];

  for (const field of numericFields) {
    const value = inputs[field] ?? 0;
    if (Number.isNaN(Number(value)) || Number(value) < 0) {
      return { valid: false, message: `${field} must be a non-negative number` };
    }
  }

  if (!SUPPORTED_DIETS.includes(inputs.dietType ?? 'mixed')) {
    return { valid: false, message: 'Invalid diet type' };
  }

  return { valid: true };
};

export const calculateCarbonFootprint = (rawInputs = {}) => {
  const inputs = {
    bikeDistance: Number(rawInputs.bikeDistance ?? 0),
    walkingDistance: Number(rawInputs.walkingDistance ?? 0),
    carDistance: Number(rawInputs.carDistance ?? 0),
    busDistance: Number(rawInputs.busDistance ?? 0),
    trainDistance: Number(rawInputs.trainDistance ?? 0),
    monthlyElectricity: Number(rawInputs.monthlyElectricity ?? 0),
    dietType: rawInputs.dietType ?? 'mixed',
    weeklyWaste: Number(rawInputs.weeklyWaste ?? 0)
  };

  const validation = validateCarbonInputs(inputs);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const totalTransport =
    inputs.carDistance * 30 * EMISSION_FACTORS.car +
    inputs.busDistance * 30 * EMISSION_FACTORS.bus +
    inputs.trainDistance * 30 * EMISSION_FACTORS.train +
    inputs.bikeDistance * 30 * EMISSION_FACTORS.bike +
    inputs.walkingDistance * 30 * EMISSION_FACTORS.walk;

  const totalEnergy = inputs.monthlyElectricity * EMISSION_FACTORS.electricity;
  const totalFood = DIET_FACTORS[inputs.dietType];
  const totalWaste = inputs.weeklyWaste * 4.33 * EMISSION_FACTORS.waste;
  const totalMonthly = totalTransport + totalEnergy + totalFood + totalWaste;
  const totalYearly = totalMonthly * 12;
  const score = Math.max(10, Math.min(100, Math.round(100 - totalMonthly / 15)));

  return {
    inputs,
    breakdown: {
      transport: roundTwo(totalTransport),
      energy: roundTwo(totalEnergy),
      food: roundTwo(totalFood),
      waste: roundTwo(totalWaste)
    },
    totalMonthly: roundTwo(totalMonthly),
    totalYearly: roundTwo(totalYearly),
    score
  };
};
