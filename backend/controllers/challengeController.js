import db from '../services/dbService.js';

export const getChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const challenges = await db.getChallenges();
    const userCompletions = await db.getUserChallenges(userId);

    // Get today's date in string format YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];

    // Check which ones are completed today
    const completedTodayIds = userCompletions
      .filter(uc => uc.completedAt.startsWith(todayStr))
      .map(uc => uc.challengeId);

    const challengesWithStatus = challenges.map(c => ({
      ...c,
      completed: completedTodayIds.includes(c.id)
    }));

    res.status(200).json({
      challenges: challengesWithStatus,
      totalCompletedCount: userCompletions.length
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error fetching challenges' });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }

    try {
      const result = await db.completeUserChallenge(userId, challengeId);
      res.status(200).json({
        message: 'Challenge completed successfully!',
        pointsEarned: result.completion.pointsEarned,
        ecoScore: result.user.ecoScore
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ message: 'Server error completing challenge' });
  }
};
