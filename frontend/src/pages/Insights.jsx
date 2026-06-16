import { useEffect, useState } from 'react';
import { useCarbon } from '../context/CarbonContext';
import { HelpCircle, Check, Leaf, Zap, Car, Utensils, Trash2, ArrowUpRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Insights = () => {
  const { recommendations, loadAllData } = useCarbon();
  const [adoptedHabits, setAdoptedHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadAllData().finally(() => setLoading(false));
  }, []);

  const handleAdopt = (id) => {
    if (adoptedHabits.includes(id)) return;
    setAdoptedHabits(prev => [...prev, id]);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'transport':
        return <Car className="text-blue-500" size={18} />;
      case 'energy':
        return <Zap className="text-yellow-500" size={18} />;
      case 'food':
        return <Utensils className="text-emerald-500" size={18} />;
      case 'waste':
        return <Trash2 className="text-rose-500" size={18} />;
      default:
        return <Leaf className="text-primary" size={18} />;
    }
  };

  const hasRecommendations = recommendations && recommendations.length > 0;

  // Filter recommendations by priority
  const highPriority = recommendations ? recommendations.filter(r => r.priorityLevel === 'High') : [];
  const mediumPriority = recommendations ? recommendations.filter(r => r.priorityLevel === 'Medium') : [];
  const lowPriority = recommendations ? recommendations.filter(r => r.priorityLevel === 'Low') : [];

  const renderRecommendationCard = (rec) => {
    const isAdopted = adoptedHabits.includes(rec.id);
    return (
      <Card key={rec.id} hoverEffect={true} className="border border-slate-100 dark:border-slate-800 flex flex-col justify-between text-left h-full">
        <div>
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {getCategoryIcon(rec.category)}
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                rec.priorityLevel === 'High' ? 'bg-rose-500/10 text-rose-500' :
                rec.priorityLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {rec.priorityLevel} Priority
              </span>
              <span className="text-[10px] font-medium text-slate-400">Impact: {rec.impactLevel}</span>
            </div>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            {rec.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {rec.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Est. Monthly Savings:</span>
            <span className="text-primary font-bold">{rec.estimatedSavings} kg CO₂</span>
          </div>

          <Button
            variant={isAdopted ? 'secondary' : 'primary'}
            size="sm"
            className="w-full text-xs"
            onClick={() => handleAdopt(rec.id)}
            disabled={isAdopted}
            icon={isAdopted ? Check : Leaf}
          >
            {isAdopted ? 'Habit Adopted!' : 'Adopt Recommendation'}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="text-left mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="text-primary" /> AI Insights
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Tailored emissions optimization guidelines generated based on your calculator logs.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3 font-semibold animate-pulse">Running AI recommendations models...</p>
        </div>
      ) : !hasRecommendations ? (
        /* Empty State */
        <Card hoverEffect={false} className="border border-dashed border-slate-300 dark:border-slate-800 text-center py-16 max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analyze your baseline first
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            We require calculation logs before we can process AI recommendations. Head to the calculator page and enter details.
          </p>
          <a href="/calculator">
            <Button size="lg" className="shadow-lg shadow-emerald-500/25">
              Go to Calculator <ArrowUpRight size={18} className="ml-2" />
            </Button>
          </a>
        </Card>
      ) : (
        /* Recommendation Cards Columns */
        <div className="flex flex-col gap-10 text-left">
          
          {/* High Priority */}
          {highPriority.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-rose-500 font-outfit mb-4 border-b border-rose-500/10 pb-2">
                🔴 High Priority Action Items
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highPriority.map(renderRecommendationCard)}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {mediumPriority.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-amber-500 font-outfit mb-4 border-b border-amber-500/10 pb-2">
                🟡 Medium Priority Action Items
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediumPriority.map(renderRecommendationCard)}
              </div>
            </div>
          )}

          {/* Low Priority */}
          {lowPriority.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-blue-500 font-outfit mb-4 border-b border-blue-500/10 pb-2">
                🔵 Low Priority Action Items
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lowPriority.map(renderRecommendationCard)}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Insights;
