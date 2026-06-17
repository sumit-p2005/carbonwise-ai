import { useEffect, useState } from 'react';
import { useCarbon } from '../context/CarbonContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Users } from 'lucide-react';
import Card from '../components/ui/Card';

const Leaderboard = () => {
  const { leaderboard, loadAllData } = useCarbon();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadAllData().finally(() => setLoading(false));
  }, []);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500 fill-yellow-500/10" size={20} />;
      case 2:
        return <Medal className="text-slate-400 fill-slate-400/10" size={20} />;
      case 3:
        return <Medal className="text-amber-600 fill-amber-600/10" size={20} />;
      default:
        return <span className="text-xs font-bold text-slate-400 dark:text-slate-500">#{rank}</span>;
    }
  };

  const getAchievementTag = (score) => {
    if (score >= 250) {
      return { label: 'Carbon Zero Hero 👑', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    } else if (score >= 180) {
      return { label: 'Green Champion 🏆', style: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    } else if (score >= 120) {
      return { label: 'Carbon Cutter 🌿', style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    } else {
      return { label: 'Eco Cadet 🌱', style: 'bg-slate-500/10 text-slate-400 border-slate-500/10' };
    }
  };

  const hasData = leaderboard && leaderboard.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="text-left mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="text-primary" /> Green Leaderboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Compare scores with the CarbonWise community and rise in rank as you complete eco challenges.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3 font-semibold animate-pulse">Retrieving leaderboards...</p>
        </div>
      ) : !hasData ? (
        /* Empty State */
        <Card hoverEffect={false} className="border border-dashed border-slate-300 dark:border-slate-800 text-center py-16 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Leaderboard unavailable
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            There are no users registered yet to compare statistics. Make sure calculation logs are completed.
          </p>
        </Card>
      ) : (
        /* Leaderboard table */
        <div className="flex flex-col gap-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((u, idx) => {
              const badge = getAchievementTag(u.ecoScore);
              return (
                <Card
                  key={u.id}
                  hoverEffect={true}
                  className={`border text-center flex flex-col items-center gap-3 relative ${
                    u.id === currentUser?.id ? 'border-primary bg-emerald-500/[0.02]' : 'border-slate-100 dark:border-slate-800'
                  }`}
                  delay={idx * 0.1}
                >
                  <div className="absolute top-4 right-4">
                    {getRankBadge(idx + 1)}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-base shadow-md">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-950 dark:text-white">
                      {u.name} {u.id === currentUser?.id && <span className="text-xs text-primary font-bold">(You)</span>}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Score: {u.ecoScore} pts</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${badge.style}`}>
                    {badge.label}
                  </span>
                </Card>
              );
            })}
          </div>

          {/* Full List */}
          <Card hoverEffect={false} className="border border-slate-100 dark:border-slate-800 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/20 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/40">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Achievement Rank</th>
                    <th className="px-6 py-4 text-right">Eco Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {leaderboard.map((u, index) => {
                    const isSelf = u.id === currentUser?.id;
                    const badge = getAchievementTag(u.ecoScore);
                    return (
                      <tr
                        key={u.id}
                        className={`text-xs font-semibold hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition ${
                          isSelf ? 'bg-primary/[0.02]' : ''
                        }`}
                      >
                        <td className="px-6 py-4 flex items-center gap-2">
                          {getRankBadge(index + 1)}
                        </td>
                        <td className={`px-6 py-4 ${isSelf ? 'text-primary font-bold' : 'text-slate-900 dark:text-slate-300'}`}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">
                              {u.name.charAt(0)}
                            </span>
                            <span>{u.name} {isSelf && '(You)'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${badge.style}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-extrabold font-outfit">
                          {u.ecoScore} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
