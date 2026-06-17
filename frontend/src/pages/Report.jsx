import { useEffect, useState } from 'react';
import { useCarbon } from '../context/CarbonContext';
import { Printer, FileText, TrendingUp, TrendingDown, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Report = () => {
  const { reportData, fetchReport } = useCarbon();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await fetchReport();
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const hasData = reportData && reportData.hasData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header and Print Control (hidden during print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 no-print text-left">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-primary" /> Carbon Report
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Generate and export printable weekly summaries of your sustainability indices.
          </p>
        </div>
        
        {hasData && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading} icon={RefreshCw}>
              Refresh
            </Button>
            <Button size="sm" onClick={handlePrint} icon={Printer} className="shadow-lg shadow-emerald-500/20">
              Print / Save PDF
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3 font-semibold animate-pulse">Analyzing reports data...</p>
        </div>
      ) : !hasData ? (
        /* Empty State */
        <Card hoverEffect={false} className="border border-dashed border-slate-300 dark:border-slate-800 text-center py-16 max-w-2xl mx-auto flex flex-col items-center gap-6 no-print">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            No report data available
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            You must run at least one carbon footprint calculation before we can generate a consolidated report sheet for you.
          </p>
          <a href="/calculator">
            <Button size="lg" className="shadow-lg shadow-emerald-500/25">
              Go to Calculator <ArrowUpRight size={18} className="ml-2" />
            </Button>
          </a>
        </Card>
      ) : (
        /* Report Page Layout (styled to fit nicely on standard A4 print) */
        <div className="flex flex-col gap-6 text-left print-card p-0 md:p-8 bg-white dark:bg-slate-900/10 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl">
          
          {/* Print Title Block (only shown in print) */}
          <div className="hidden print:flex justify-between items-center pb-6 border-b border-slate-200 mb-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sustainability Dashboard Report</span>
              <h1 className="text-2xl font-extrabold text-slate-950 mt-1">CarbonWise AI</h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Report Compiled On</span>
              <p className="text-sm font-bold text-slate-950 mt-0.5">{new Date(reportData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Heading summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/40 pb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white font-outfit">
                Sustainable Status Report
              </h2>
              <span className="text-xs text-slate-400">
                Prepared for <span className="font-bold text-slate-600 dark:text-slate-300">{reportData.userName}</span>
              </span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calculation Timestamp</span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                {new Date(reportData.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            </div>
          </div>

          {/* Top KPI values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
            
            {/* Sustainability Score */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carbon Score</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-primary font-outfit">{reportData.currentScore}</span>
                <span className="text-xs font-bold text-slate-400">/100</span>
              </div>
              
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-2">
                {reportData.scoreChange >= 0 ? (
                  <TrendingUp size={12} className="text-primary" />
                ) : (
                  <TrendingDown size={12} className="text-rose-500" />
                )}
                <span className={reportData.scoreChange >= 0 ? 'text-primary' : 'text-rose-500'}>
                  {reportData.scoreChange >= 0 ? `+${reportData.scoreChange}` : reportData.scoreChange} points change
                </span>
              </div>
            </div>

            {/* Monthly Carbon Emission */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Emissions</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-outfit">{reportData.currentEmissions}</span>
                <span className="text-xs font-bold text-slate-400">kg CO₂</span>
              </div>
              
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-2">
                {reportData.emissionChange <= 0 ? (
                  <TrendingDown size={12} className="text-primary" />
                ) : (
                  <TrendingUp size={12} className="text-rose-500" />
                )}
                <span className={reportData.emissionChange <= 0 ? 'text-primary' : 'text-rose-500'}>
                  {reportData.emissionChange <= 0 ? '' : '+'}{reportData.emissionChange} kg difference
                </span>
              </div>
            </div>

            {/* Yearly Equivalent */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Yearly Projection</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-outfit">
                  {Math.round((reportData.yearlyEmissions / 1000) * 10) / 10}
                </span>
                <span className="text-xs font-bold text-slate-400">tons CO₂</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold mt-2">
                Eco Score base: {reportData.ecoScore}
              </span>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Sector Breakdown Analysis
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Data list */}
              <div className="flex flex-col gap-3">
                {/* Transport */}
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">🚗 Transportation</span>
                  <span className="text-slate-900 dark:text-white">{reportData.breakdown.transport} kg CO₂</span>
                </div>
                
                {/* Energy */}
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">💡 Home Energy</span>
                  <span className="text-slate-900 dark:text-white">{reportData.breakdown.energy} kg CO₂</span>
                </div>

                {/* Food */}
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">🍏 Dietary Intake</span>
                  <span className="text-slate-900 dark:text-white">{reportData.breakdown.food} kg CO₂</span>
                </div>

                {/* Waste */}
                <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">🗑️ Waste Output</span>
                  <span className="text-slate-900 dark:text-white">{reportData.breakdown.waste} kg CO₂</span>
                </div>
              </div>

              {/* Progress bar visualizer */}
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-200/30">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visual Proportion</span>
                
                <div className="flex h-4 rounded-full overflow-hidden w-full bg-slate-200">
                  {/* Transport */}
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${reportData.currentEmissions > 0 ? (reportData.breakdown.transport / reportData.currentEmissions) * 100 : 0}%` }}
                    title="Transport"
                  />
                  {/* Energy */}
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${reportData.currentEmissions > 0 ? (reportData.breakdown.energy / reportData.currentEmissions) * 100 : 0}%` }}
                    title="Energy"
                  />
                  {/* Food */}
                  <div
                    className="bg-yellow-500 h-full"
                    style={{ width: `${reportData.currentEmissions > 0 ? (reportData.breakdown.food / reportData.currentEmissions) * 100 : 0}%` }}
                    title="Food"
                  />
                  {/* Waste */}
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${reportData.currentEmissions > 0 ? (reportData.breakdown.waste / reportData.currentEmissions) * 100 : 0}%` }}
                    title="Waste"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Transport</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Energy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Diet</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Waste</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seed inputs details */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Calculation Parameters
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">DAILY CAR</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{reportData.inputs.carDistance} km</span>
              </div>
              <div className="p-3 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">ELECTRICITY</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{reportData.inputs.monthlyElectricity} kWh</span>
              </div>
              <div className="p-3 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">DIET PATTERN</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block capitalize">{reportData.inputs.dietType}</span>
              </div>
              <div className="p-3 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">WEEKLY WASTE</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{reportData.inputs.weeklyWaste} kg</span>
              </div>
            </div>
          </div>

          {/* Activity summary */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Ecological Accomplishments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You completed <span className="font-bold text-slate-700 dark:text-slate-200">{reportData.completedChallengesCount} challenges</span> in total. 
              In the last 7 days, you finalized <span className="font-bold text-primary">{reportData.recentCompletedCount} daily challenges</span>.
            </p>
          </div>

          {/* AI Recommendations */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              AI Action Recommendations
            </h3>
            
            <div className="flex flex-col gap-3">
              {reportData.recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex justify-between items-start gap-4">
                  <div className="text-left">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary text-white rounded-md uppercase tracking-wider">
                      {rec.priorityLevel} Priority
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{rec.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Est. Savings</span>
                    <span className="text-xs font-bold text-primary mt-1 block">-{rec.estimatedSavings} kg/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable signature */}
          <div className="hidden print:block pt-16 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400 mt-auto">
            Report compiled by CarbonWise AI Sustainability Platform. Keep tracking to save the planet!
          </div>

        </div>
      )}
    </div>
  );
};

export default Report;
