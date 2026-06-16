import db from '../services/dbService.js';
import { getAIRecommendations } from '../services/aiService.js';

export const getReportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await db.getCarbonHistory(userId);
    const user = await db.findUserById(userId);
    const completedChallenges = await db.getUserChallenges(userId);

    if (history.length === 0) {
      return res.status(200).json({
        hasData: false,
        message: 'No carbon footprint data found. Please use the calculator first to generate your report.'
      });
    }

    // Get the latest and the previous calculation
    const latestCalc = history[history.length - 1];
    const previousCalc = history.length > 1 ? history[history.length - 2] : null;

    let scoreChange = 0;
    let emissionChange = 0;

    if (previousCalc) {
      scoreChange = latestCalc.score - previousCalc.score;
      emissionChange = Math.round((latestCalc.totalMonthly - previousCalc.totalMonthly) * 100) / 100;
    }

    // Fetch recommendations for the latest configuration
    const recommendations = getAIRecommendations(latestCalc.inputs, latestCalc.breakdown);

    // Filter challenges completed in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCompletedChallenges = completedChallenges.filter(uc => {
      return new Date(uc.completedAt) >= sevenDaysAgo;
    });

    res.status(200).json({
      hasData: true,
      userName: user.name,
      ecoScore: user.ecoScore,
      currentScore: latestCalc.score,
      scoreChange,
      currentEmissions: latestCalc.totalMonthly,
      emissionChange,
      yearlyEmissions: latestCalc.totalYearly,
      breakdown: latestCalc.breakdown,
      inputs: latestCalc.inputs,
      createdAt: latestCalc.createdAt,
      completedChallengesCount: completedChallenges.length,
      recentCompletedCount: recentCompletedChallenges.length,
      recommendations: recommendations.slice(0, 3) // Return top 3 recommendations
    });
  } catch (error) {
    console.error('Get report data error:', error);
    res.status(500).json({ message: 'Server error generating report data' });
  }
};
