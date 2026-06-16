import axios from 'axios';

// Rule-based Recommendations Engine
export const getAIRecommendations = (inputs, breakdown) => {
  const recommendations = [];
  const totalMonthly = (breakdown.transport || 0) + (breakdown.energy || 0) + (breakdown.food || 0) + (breakdown.waste || 0);

  if (totalMonthly === 0) {
    return [
      {
        id: 'calc-first',
        title: 'Complete your first Carbon Calculator entry',
        description: 'Provide details about your daily habits to get custom tailored recommendations.',
        estimatedSavings: 0,
        impactLevel: 'High',
        priorityLevel: 'High',
        category: 'general'
      }
    ];
  }

  const transportPct = ((breakdown.transport || 0) / totalMonthly) * 100;
  const energyPct = ((breakdown.energy || 0) / totalMonthly) * 100;
  const foodPct = ((breakdown.food || 0) / totalMonthly) * 100;
  const wastePct = ((breakdown.waste || 0) / totalMonthly) * 100;

  // TRANSPORT RECOMMENDATIONS
  if (transportPct > 40 || (inputs.carDistance || 0) > 15) {
    recommendations.push({
      id: 'carpool',
      title: 'Carpool for commuting',
      description: 'Share your daily commutes with colleagues or friends to cut car emissions in half.',
      estimatedSavings: Math.round((inputs.carDistance || 0) * 30 * 0.18 * 0.4 * 10) / 10,
      impactLevel: 'High',
      priorityLevel: 'High',
      category: 'transport'
    });

    recommendations.push({
      id: 'public-transit-more',
      title: 'Swap driving for public transit',
      description: 'Take the train or bus instead of driving a personal car. Trains emit 77% less carbon per km.',
      estimatedSavings: Math.round((inputs.carDistance || 0) * 30 * (0.18 - 0.041) * 0.5 * 10) / 10,
      impactLevel: 'High',
      priorityLevel: 'High',
      category: 'transport'
    });
  }

  if ((inputs.carDistance || 0) > 0) {
    recommendations.push({
      id: 'bike-short-trips',
      title: 'Walk or bike for short trips (< 2 km)',
      description: 'Avoid starting the car engine for short errands. Active travel is completely carbon-free.',
      estimatedSavings: 15,
      impactLevel: 'Medium',
      priorityLevel: 'Medium',
      category: 'transport'
    });
  }

  // ENERGY RECOMMENDATIONS
  if (energyPct > 30 || (inputs.monthlyElectricity || 0) > 250) {
    recommendations.push({
      id: 'led-bulbs',
      title: 'Upgrade to LED lighting',
      description: 'Replace standard incandescent bulbs with LEDs, which use up to 80% less energy.',
      estimatedSavings: 12,
      impactLevel: 'Low',
      priorityLevel: 'High',
      category: 'energy'
    });

    recommendations.push({
      id: 'unplug-vampire',
      title: 'Unplug stand-by appliances',
      description: 'Turn off switches or unplug devices like TVs, chargers, and microwaves when not in use.',
      estimatedSavings: 8,
      impactLevel: 'Low',
      priorityLevel: 'Medium',
      category: 'energy'
    });

    recommendations.push({
      id: 'thermostat-adj',
      title: 'Optimize thermostat temperature',
      description: 'Adjust your thermostat by 1-2 degrees. Lowering heating or raising cooling settings saves major power.',
      estimatedSavings: 25,
      impactLevel: 'Medium',
      priorityLevel: 'High',
      category: 'energy'
    });

    if ((inputs.monthlyElectricity || 0) > 400) {
      recommendations.push({
        id: 'solar-panels',
        title: 'Transition to solar energy',
        description: 'Install solar panels or purchase clean energy credits from your utility provider.',
        estimatedSavings: Math.round((inputs.monthlyElectricity || 0) * 0.38 * 0.8),
        impactLevel: 'High',
        priorityLevel: 'Low',
        category: 'energy'
      });
    }
  }

  // FOOD RECOMMENDATIONS
  if (foodPct > 25 || inputs.dietType === 'non-vegetarian') {
    recommendations.push({
      id: 'meatless-mondays',
      title: 'Implement Meatless Mondays',
      description: 'Avoid meat once a week. Replacing beef/chicken with grains or legumes makes a massive difference.',
      estimatedSavings: 20,
      impactLevel: 'Medium',
      priorityLevel: 'High',
      category: 'food'
    });

    if (inputs.dietType === 'non-vegetarian') {
      recommendations.push({
        id: 'switch-diet-vegetarian',
        title: 'Adopt a plant-forward diet',
        description: 'Shift your diet to focus primarily on fruits, vegetables, grains, and nuts.',
        estimatedSavings: 83, // Difference between non-veg and vegetarian monthly emission
        impactLevel: 'High',
        priorityLevel: 'Medium',
        category: 'food'
      });
    }

    recommendations.push({
      id: 'reduce-food-waste',
      title: 'Reduce household food waste',
      description: 'Plan your meals, store food correctly, and compost organic scraps. Rotting food in landfills produces methane.',
      estimatedSavings: 15,
      impactLevel: 'Medium',
      priorityLevel: 'High',
      category: 'food'
    });
  }

  // WASTE RECOMMENDATIONS
  if (wastePct > 15 || (inputs.weeklyWaste || 0) > 8) {
    recommendations.push({
      id: 'reusable-bags-cups',
      title: 'Bring reusables everywhere',
      description: 'Decline single-use plastic bags, coffee cups, and takeaway containers. Bring your own instead.',
      estimatedSavings: 10,
      impactLevel: 'Low',
      priorityLevel: 'High',
      category: 'waste'
    });

    recommendations.push({
      id: 'home-compost',
      title: 'Start kitchen composting',
      description: 'Convert fruit skins, coffee grounds, and food scraps into nutrient-rich soil instead of trash.',
      estimatedSavings: 18,
      impactLevel: 'Medium',
      priorityLevel: 'Medium',
      category: 'waste'
    });

    recommendations.push({
      id: 'rigorous-recycling',
      title: 'Organize household recycling',
      description: 'Separate cardboards, plastic bottles, glass, and tin cans cleanly. Familiarize with your local recycling program.',
      estimatedSavings: 12,
      impactLevel: 'Medium',
      priorityLevel: 'High',
      category: 'waste'
    });
  }

  // Default recommendations if list is short
  if (recommendations.length < 3) {
    recommendations.push({
      id: 'plant-trees-direct',
      title: 'Support local reforestation',
      description: 'Plant a tree or purchase verified carbon offset projects online.',
      estimatedSavings: 20,
      impactLevel: 'Medium',
      priorityLevel: 'Medium',
      category: 'nature'
    });
  }

  return recommendations;
};

// Conversational Sustainability Coach Chatbot
export const generateChatResponse = async (message, userProfile, latestCalculation) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Extract variables for context
  const userName = userProfile?.name || 'User';
  const ecoScore = userProfile?.ecoScore || 100;
  
  let carbonDataText = 'You have not completed a carbon footprint calculation yet.';
  if (latestCalculation && latestCalculation.breakdown) {
    carbonDataText = `Your monthly carbon footprint is ${latestCalculation.totalMonthly} kg CO2.
Breakdown:
- Transportation: ${latestCalculation.breakdown.transport || 0} kg CO2
- Home Energy: ${latestCalculation.breakdown.energy || 0} kg CO2
- Diet/Food: ${latestCalculation.breakdown.food || 0} kg CO2
- Waste/Garbage: ${latestCalculation.breakdown.waste || 0} kg CO2
Your carbon score is ${latestCalculation.score}/100.`;
  }

  const systemInstructions = `You are a friendly, encouraging, and highly knowledgeable AI Sustainability Coach at "CarbonWise AI".
Your name is "EcoBuddy".
Your goal is to guide users to understand their carbon emissions, provide actionable advice, interpret their footprint stats, and keep them motivated to complete eco-challenges.
Keep your answers brief, engaging, and clear. Avoid overly dense text blocks. Format replies using markdown.

User Context:
- Name: ${userName}
- Eco Score / Points: ${ecoScore}
- Carbon Footprint Data:
${carbonDataText}`;

  if (GEMINI_API_KEY) {
    try {
      // Connect to Google Gemini API via HTTP POST request
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const response = await axios.post(url, {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstructions}\n\nUser Message: "${message}"\n\nEcoBuddy Response:`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7
        }
      });

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply.trim();
      }
    } catch (error) {
      console.error('Gemini API request failed, falling back to rule-based engine:', error.response?.data || error.message);
    }
  }

  // Local Rule-Based NLP Fallback
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey')) {
    return `Hello ${userName}! 👋 I am **EcoBuddy**, your AI Sustainability Coach. How can I help you on your green journey today? You can ask me about your carbon footprint, how to complete challenges, or tips to save electricity!`;
  }

  if (lowerMsg.includes('score') || lowerMsg.includes('points')) {
    return `Your current **Eco Score** is **${ecoScore} points**. 🌟 
You can raise this by:
1. Entering calculations in the **Carbon Calculator** page to see your baseline.
2. Completing and checking off items in the **Eco Challenges** dashboard. Let's make today greener!`;
  }

  if (lowerMsg.includes('footprint') || lowerMsg.includes('emission') || lowerMsg.includes('emissions') || lowerMsg.includes('my data')) {
    if (!latestCalculation) {
      return `It looks like you haven't calculated your footprint yet. Head over to the **Carbon Calculator** page to log your transportation, power, and food habits. Once done, I will analyze your data and show you where you can save the most CO2!`;
    }
    return `Here is your current breakdown, ${userName}:
- **Total Monthly Emissions**: \`${latestCalculation.totalMonthly} kg CO2\`
- **Highest contributor**: ${getHighestContributor(latestCalculation.breakdown)}

To reduce this, I recommend looking at your highest sector. For instance, if it's Transportation, try walking short distances or carpooling! What sector would you like to discuss?`;
  }

  if (lowerMsg.includes('transport') || lowerMsg.includes('car') || lowerMsg.includes('bike') || lowerMsg.includes('bus')) {
    return `Transportation is a major contributor to personal carbon footprints. 🚗
**Actionable tips**:
- Try **carpooling** with coworkers to split emissions.
- Switch to public transit (bus/train) which has a much lower carbon index.
- For trips under **2 km**, walk or ride a bike. It's completely carbon-free and great for your health!`;
  }

  if (lowerMsg.includes('electricity') || lowerMsg.includes('energy') || lowerMsg.includes('light') || lowerMsg.includes('power')) {
    return `Reducing home electricity usage saves both carbon emissions and money on your bills! 💡
**Top suggestions**:
- Swap standard incandescent bulbs for energy-efficient **LED bulbs**.
- Unplug standby appliances (TVs, chargers, computers) as they consume "vampire load" even when turned off.
- Lower your thermostat by 1-2 degrees in winter or raise it in summer.`;
  }

  if (lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('diet') || lowerMsg.includes('meat') || lowerMsg.includes('vegetarian')) {
    return `Diet choices play a significant role in greenhouse gases. Meat production, especially beef, is extremely resource-intensive. 🍏
**Tips**:
- Try **Meatless Mondays** – skipping meat just one day a week saves significant carbon.
- Shop for local, seasonal organic ingredients to reduce shipping emissions ("food miles").
- Plan meals ahead to avoid food waste, which releases methane in landfills.`;
  }

  if (lowerMsg.includes('waste') || lowerMsg.includes('plastic') || lowerMsg.includes('recycle') || lowerMsg.includes('compost')) {
    return `Managing waste is a great way to help the environment! ♻️
**Easy steps**:
- Carry **reusable shopping bags** and water bottles.
- Set up a small **kitchen composting bin** for organic waste.
- Properly recycle paper, cardboards, glass bottles, and metal cans.`;
  }

  if (lowerMsg.includes('challenge') || lowerMsg.includes('challenges')) {
    return `Checking off challenges on the **Eco Challenges** page is the fastest way to build green habits and raise your Eco Score. Have you completed a challenge today? Try turning off unnecessary lights or bringing a reusable bottle!`;
  }

  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
    return `You're very welcome, ${userName}! Thank you for taking steps to build a greener future. 🌍 Let me know if you need any other sustainability advice!`;
  }

  return `Thanks for your message, ${userName}! As your Sustainability Coach, I'm here to help. 
Could you clarify if you'd like advice on **reducing household energy**, **carpooling/transportation**, **dietary improvements**, or how to read your **Carbon Calculator** scores?`;
};

// Helper function
function getHighestContributor(breakdown) {
  if (!breakdown) return 'N/A';
  const keys = Object.keys(breakdown);
  let maxKey = keys[0];
  let maxVal = breakdown[maxKey] || 0;
  for (let i = 1; i < keys.length; i++) {
    if (breakdown[keys[i]] > maxVal) {
      maxVal = breakdown[keys[i]];
      maxKey = keys[i];
    }
  }
  return `**${maxKey.charAt(0).toUpperCase() + maxKey.slice(1)}** (${maxVal} kg CO2)`;
}
