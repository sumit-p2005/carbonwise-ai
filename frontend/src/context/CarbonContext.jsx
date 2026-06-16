import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CarbonContext = createContext();

export const CarbonProvider = ({ children }) => {
  const { user, updateLocalUserScore } = useAuth();
  const [history, setHistory] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi! I am **EcoBuddy**, your AI Sustainability Coach. Ask me anything about carbon footprint reductions, eco habits, or your score data!',
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Load history and data once user logs in
  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      // Clear data on logout
      setHistory([]);
      setChallenges([]);
      setRecommendations([]);
      setReportData(null);
      setLeaderboard([]);
      setChatMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Hi! I am **EcoBuddy**, your AI Sustainability Coach. Ask me anything about carbon footprint reductions, eco habits, or your score data!',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchHistory(),
        fetchChallenges(),
        fetchRecommendations(),
        fetchLeaderboard()
      ]);
    } catch (err) {
      console.error('Error loading all carbon details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/carbon/history');
      setHistory(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch history:', err);
      // Fallback
      const local = localStorage.getItem(`history_${user?.id}`);
      if (local) setHistory(JSON.parse(local));
    }
  };

  const fetchChallenges = async () => {
    try {
      const res = await api.get('/challenges');
      setChallenges(res.data.challenges);
      return res.data.challenges;
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      const local = localStorage.getItem(`challenges_${user?.id}`);
      if (local) setChallenges(JSON.parse(local));
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/recommendations');
      setRecommendations(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard');
      setLeaderboard(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const calculateCarbon = async (inputs) => {
    setLoading(true);
    try {
      const res = await api.post('/carbon/calculate', inputs);
      const { record, ecoScore } = res.data;
      
      // Update history
      setHistory(prev => [...prev, record]);
      // Update local storage history fallback
      localStorage.setItem(`history_${user?.id}`, JSON.stringify([...history, record]));
      
      // Sync user score in AuthContext
      updateLocalUserScore(ecoScore);
      
      // Refetch recommendations and leaderboard
      await Promise.all([
        fetchRecommendations(),
        fetchLeaderboard()
      ]);
      
      setLoading(false);
      return record;
    } catch (err) {
      setLoading(false);
      console.error('Error during carbon calculation:', err);
      throw err;
    }
  };

  const completeChallenge = async (challengeId) => {
    try {
      const res = await api.post('/challenges/complete', { challengeId });
      const { pointsEarned, ecoScore } = res.data;
      
      // Update challenges list locally
      setChallenges(prev =>
        prev.map(c => (c.id === challengeId ? { ...c, completed: true } : c))
      );
      
      // Update user score in AuthContext
      updateLocalUserScore(ecoScore);

      // Refetch leaderboard
      fetchLeaderboard();
      
      return pointsEarned;
    } catch (err) {
      console.error('Error completing challenge:', err);
      const errMsg = err.response?.data?.message || 'Failed to complete challenge';
      throw new Error(errMsg, { cause: err });
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports');
      setReportData(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      console.error('Error fetching report:', err);
    }
  };

  const sendChatMessage = async (text) => {
    const userMsg = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      createdAt: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await api.post('/chat', { message: text });
      const botMsg = {
        id: Math.random().toString(),
        sender: 'bot',
        text: res.data.response,
        createdAt: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error sending chat message:', err);
      const botMsg = {
        id: Math.random().toString(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to my environment. Please check your internet or retry.',
        createdAt: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botMsg]);
    }
  };

  return (
    <CarbonContext.Provider
      value={{
        history,
        challenges,
        recommendations,
        reportData,
        leaderboard,
        chatMessages,
        loading,
        calculateCarbon,
        completeChallenge,
        fetchReport,
        sendChatMessage,
        loadAllData
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  return context;
};
