import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarbon } from '../context/CarbonContext';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Award, ShieldCheck, Flame, Compass, Calculator, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const { history, challenges, recommendations, loadAllData } = useCarbon();

  // Load fresh details
  useEffect(() => {
    loadAllData();
  }, []);

  const hasHistory = history && history.length > 0;
  const latestRecord = hasHistory ? history[history.length - 1] : null;
  const previousRecord = hasHistory && history.length > 1 ? history[history.length - 2] : null;

  // Compile calculations details
  const monthlyEmissions = latestRecord ? latestRecord.totalMonthly : 0;
  const yearlyEmissions = latestRecord ? latestRecord.totalYearly : 0;
  const sustainabilityScore = user ? user.ecoScore : 100;

  // Delta calculations
  let scoreDelta = 0;
  let emissionDelta = 0;
  if (previousRecord && latestRecord) {
    scoreDelta = latestRecord.score - previousRecord.score;
    emissionDelta = Math.round(((latestRecord.totalMonthly - previousRecord.totalMonthly) / previousRecord.totalMonthly) * 100);
  }

  // Count active daily challenges done today
  const completedChallengesCount = challenges ? challenges.filter(c => c.completed).length : 0;
  const totalChallengesCount = challenges ? challenges.length : 0;

  // Chart Data 1: Pie Chart (Breakdown)
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
  const pieData = latestRecord && latestRecord.breakdown
    ? [
        { name: 'Transport', value: latestRecord.breakdown.transport },
        { name: 'Energy', value: latestRecord.breakdown.energy },
        { name: 'Food', value: latestRecord.breakdown.food },
        { name: 'Waste', value: latestRecord.breakdown.waste }
      ]
    : [];

  // Chart Data 2: Line Chart (Trend)
  const lineData = history
    ? history.map(h => ({
        date: new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        Emissions: h.totalMonthly
      }))
    : [];

  // Chart Data 3: Bar Chart (Comparison user vs baseline average)
  const barData = latestRecord && latestRecord.breakdown
    ? [
        { name: 'Transport', You: latestRecord.breakdown.transport, Average: 260 },
        { name: 'Energy', You: latestRecord.breakdown.energy, Average: 200 },
        { name: 'Food', You: latestRecord.breakdown.food, Average: 180 },
        { name: 'Waste', You: latestRecord.breakdown.waste, Average: 60 }
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white">
            Hello, {user?.name || 'Eco Warrior'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Here is your daily sustainability summary and footprint tracking.
          </p>
        </div>
        {hasHistory && (
          <Link to="/calculator">
            <Button size="sm" icon={Calculator}>
              New Calculation
            </Button>
          </Link>
        )}
      </div>

      {!hasHistory ? (
        /* Empty State */
        <Card hoverEffect={false} className="border border-dashed border-slate-300 dark:border-slate-800 text-center py-16 max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center">
            <Calculator size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Calculate your carbon baseline
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            Welcome to CarbonWise AI! Before we can suggest carbon offsets and coaching habits, we need to know your daily details. Click below to begin.
          </p>
          <Link to="/calculator">
            <Button size="lg" className="shadow-lg shadow-emerald-500/25">
              Start Carbon Calculator <ArrowUpRight size={18} className="ml-2" />
            </Button>
          </Link>
        </Card>
      ) : (
        /* Dashboard Content */
        <div className="flex flex-col gap-8 w-full">
          
          {/* Top Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sustainability Score */}
            <Card className="flex items-center gap-4 border border-slate-100 dark:border-slate-800" delay={0}>
              <div className="p-3 bg-emerald-500/15 text-primary rounded-2xl">
                <Award size={28} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Sustainability Score</span>
                <span className="text-2xl font-black text-slate-950 dark:text-white font-outfit mt-0.5">{sustainabilityScore}/100</span>
                {scoreDelta !== 0 && (
                  <span className={`text-[10px] font-bold flex items-center mt-0.5 ${scoreDelta > 0 ? 'text-primary' : 'text-rose-500'}`}>
                    {scoreDelta > 0 ? <ArrowDownRight size={12} className="rotate-180" /> : <ArrowUpRight size={12} className="rotate-180" />}
                    <span>{scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} vs last log</span>
                  </span>
                )}
              </div>
            </Card>

            {/* Monthly Carbon Emission */}
            <Card className="flex items-center gap-4 border border-slate-100 dark:border-slate-800" delay={0.1}>
              <div className="p-3 bg-blue-500/15 text-blue-500 rounded-2xl">
                <Compass size={28} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Monthly Emission</span>
                <span className="text-2xl font-black text-slate-950 dark:text-white font-outfit mt-0.5">{monthlyEmissions} <span className="text-xs font-semibold text-slate-400">kg CO₂</span></span>
                {emissionDelta !== 0 && (
                  <span className={`text-[10px] font-bold flex items-center mt-0.5 ${emissionDelta < 0 ? 'text-primary' : 'text-rose-500'}`}>
                    {emissionDelta < 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                    <span>{emissionDelta > 0 ? `+${emissionDelta}` : `${emissionDelta}`}% vs last log</span>
                  </span>
                )}
              </div>
            </Card>

            {/* Yearly Carbon Emission */}
            <Card className="flex items-center gap-4 border border-slate-100 dark:border-slate-800" delay={0.2}>
              <div className="p-3 bg-yellow-500/15 text-yellow-600 rounded-2xl">
                <Flame size={28} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Yearly Footprint</span>
                <span className="text-2xl font-black text-slate-950 dark:text-white font-outfit mt-0.5">{Math.round((yearlyEmissions / 1000) * 10) / 10} <span className="text-xs font-semibold text-slate-400">tons CO₂</span></span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">National avg is ~16.0 tons</span>
              </div>
            </Card>

            {/* Completed Challenges */}
            <Card className="flex items-center gap-4 border border-slate-100 dark:border-slate-800" delay={0.3}>
              <div className="p-3 bg-rose-500/15 text-rose-500 rounded-2xl">
                <ShieldCheck size={28} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Challenges Completed</span>
                <span className="text-2xl font-black text-slate-950 dark:text-white font-outfit mt-0.5">{completedChallengesCount}/{totalChallengesCount}</span>
                <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${totalChallengesCount > 0 ? (completedChallengesCount / totalChallengesCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Monthly Trend Chart */}
            <Card className="lg:col-span-2 flex flex-col justify-between" hoverEffect={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Emission Trend</h3>
                <span className="text-xs text-slate-400 font-semibold">Monthly Carbon Log (kg CO₂)</span>
              </div>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="Emissions" stroke="#22c55e" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Breakdown Pie Chart */}
            <Card className="flex flex-col justify-between" hoverEffect={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Emission Share</h3>
                <span className="text-xs text-slate-400 font-semibold">Latest Breakdown</span>
              </div>
              <div className="w-full h-52 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} kg`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Score Text inside ring */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">{Math.round(monthlyEmissions)} kg</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {pieData.map((d, index) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                    <span>{d.name}: {Math.round(d.value)} kg</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Second Row Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category Comparison Bar Chart */}
            <Card className="lg:col-span-2 flex flex-col justify-between" hoverEffect={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sector Comparison</h3>
                <span className="text-xs text-slate-400 font-semibold">Your Data vs National Target Base</span>
              </div>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" fontSize={11} />
                    <Bar dataKey="You" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Average" fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Quick AI Coaching Recommendation box */}
            <Card className="flex flex-col justify-between" hoverEffect={false}>
              <div className="flex items-center gap-1.5 mb-4 text-primary">
                <HelpCircle size={18} />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Suggestion</h3>
              </div>

              {recommendations && recommendations.length > 0 ? (
                <div className="flex flex-col gap-4 text-left justify-center flex-grow">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary text-white rounded-full uppercase tracking-wider">
                      {recommendations[0].priorityLevel} Priority
                    </span>
                    <h4 className="font-bold text-slate-950 dark:text-white text-sm mt-2">
                      {recommendations[0].title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {recommendations[0].description}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/40 text-[11px] font-bold text-slate-500">
                      <span>Est. Savings:</span>
                      <span className="text-primary font-extrabold">{recommendations[0].estimatedSavings} kg CO₂ / mo</span>
                    </div>
                  </div>

                  <Link to="/insights" className="w-full">
                    <Button variant="outline" className="w-full text-xs font-bold py-2">
                      See All AI Recommendations
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-slate-400 py-6">
                  <p className="text-xs">No active suggestions.</p>
                </div>
              )}
            </Card>

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
