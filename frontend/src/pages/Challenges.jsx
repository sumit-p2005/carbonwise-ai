import { useEffect, useState } from 'react';
import { useCarbon } from '../context/CarbonContext';
import { Award, Flame, Sparkles, Check, Trash2, Zap, Car, Leaf, Footprints } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Challenges = () => {
  const { challenges, completeChallenge, loadAllData } = useCarbon();
  const [claimingId, setClaimingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const handleComplete = async (challengeId) => {
    setClaimingId(challengeId);
    setSuccessMsg('');
    try {
      const points = await completeChallenge(challengeId);
      setSuccessMsg(`Awesome! You completed the challenge and earned +${points} Eco points! 🎉`);
      // Auto clear message after 4s
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to complete challenge');
    } finally {
      setClaimingId(null);
    }
  };

  const getChallengeIcon = (category) => {
    switch (category) {
      case 'waste':
        return <Trash2 className="text-rose-500" size={18} />;
      case 'energy':
        return <Zap className="text-yellow-500" size={18} />;
      case 'transport':
        return <Car className="text-blue-500" size={18} />;
      case 'food':
        return <Footprints className="text-orange-500" size={18} />;
      case 'nature':
      default:
        return <Leaf className="text-primary" size={18} />;
    }
  };

  const completedCount = challenges ? challenges.filter(c => c.completed).length : 0;
  const totalCount = challenges ? challenges.length : 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="text-left mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="text-primary" /> Eco Challenges
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Complete daily climate goals, earn points, and build sustainable habits.
        </p>
      </div>

      {/* Stats and progress card */}
      <Card hoverEffect={false} className="border border-slate-100 dark:border-slate-800 mb-8 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left w-full sm:w-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Today's Progress</span>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white mt-1 font-outfit">
            {completedCount} of {totalCount} completed
          </h2>
          <div className="w-full sm:w-64 bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/10 px-6 py-4 rounded-2xl w-full sm:w-auto">
          <div className="p-2.5 bg-primary text-white rounded-xl">
            <Flame size={20} className="fill-current animate-bounce" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion rate</span>
            <p className="text-lg font-black text-primary font-outfit mt-0.5">{pct}% efficiency</p>
          </div>
        </div>
      </Card>

      {/* Success alert message banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-primary text-sm font-semibold rounded-2xl flex items-center gap-2"
          >
            <Sparkles size={18} className="shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenges List */}
      <div className="flex flex-col gap-4">
        {challenges && challenges.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <div className={`p-5 rounded-2xl border transition duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              item.completed
                ? 'border-emerald-500/20 bg-emerald-500/[0.02] opacity-80'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}>
              <div className="flex items-start gap-4 text-left">
                {/* Category Icon */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl mt-0.5 shrink-0">
                  {getChallengeIcon(item.category)}
                </div>
                
                <div>
                  <h4 className={`font-bold text-sm ${item.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-950 dark:text-white'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <span className="text-xs font-bold text-primary px-2.5 py-1 bg-emerald-500/10 rounded-lg whitespace-nowrap">
                  +{item.points} Points
                </span>
                
                {item.completed ? (
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-primary flex items-center justify-center border border-emerald-500/10" aria-label="Completed">
                    <Check size={18} strokeWidth={3} />
                  </div>
                ) : (
                  <Button
                    onClick={() => handleComplete(item.id)}
                    loading={claimingId === item.id}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;
