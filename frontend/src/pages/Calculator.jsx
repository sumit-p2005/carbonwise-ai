import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbon } from '../context/CarbonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Bus, Train, Footprints, Zap, Utensils, Trash2, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Calculator = () => {
  const { calculateCarbon } = useCarbon();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [carDistance, setCarDistance] = useState(15);
  const [busDistance, setBusDistance] = useState(5);
  const [trainDistance, setTrainDistance] = useState(0);
  const [bikeDistance, setBikeDistance] = useState(2);
  const [walkingDistance, setWalkingDistance] = useState(1);

  const [monthlyElectricity, setMonthlyElectricity] = useState(250);
  const [dietType, setDietType] = useState('mixed');
  const [weeklyWaste, setWeeklyWaste] = useState(5);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        carDistance: parseFloat(carDistance) || 0,
        busDistance: parseFloat(busDistance) || 0,
        trainDistance: parseFloat(trainDistance) || 0,
        bikeDistance: parseFloat(bikeDistance) || 0,
        walkingDistance: parseFloat(walkingDistance) || 0,
        monthlyElectricity: parseFloat(monthlyElectricity) || 0,
        dietType,
        weeklyWaste: parseFloat(weeklyWaste) || 0
      };

      await calculateCarbon(payload);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save calculation. Please check inputs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Live intermediate math for UI preview
  const liveTransport = (carDistance * 0.18 + busDistance * 0.089 + trainDistance * 0.041) * 30;
  const liveEnergy = monthlyElectricity * 0.38;
  const liveFood = dietType === 'vegetarian' ? 125 : dietType === 'non-vegetarian' ? 275 : 208;
  const liveWaste = weeklyWaste * 4.33 * 0.5;
  const liveTotal = liveTransport + liveEnergy + liveFood + liveWaste;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Title */}
      <div className="text-center mb-8 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white">
          Carbon Calculator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          Log your daily lifestyle factors to check your detailed eco score.
        </p>

        {/* Multi-step progress bar */}
        <div className="flex items-center gap-2 mt-6 w-full max-w-md">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div
                className={`h-2 w-full rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            </div>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">
          Step {step} of {totalSteps}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        {/* Main interactive form */}
        <Card hoverEffect={false} className="lg:col-span-2 border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col justify-between">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Car className="text-primary" /> Daily Transportation (km)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Enter the average distances you travel every day. Set to 0 if you don't use that mode of transport.
                  </p>

                  <div className="flex flex-col gap-4 mt-2">
                    {/* Car */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Car size={14} /> Car</span>
                        <span>{carDistance} km/day</span>
                      </div>
                      <input
                        type="range" min="0" max="150" value={carDistance}
                        onChange={(e) => setCarDistance(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Bus */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Bus size={14} /> Bus</span>
                        <span>{busDistance} km/day</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={busDistance}
                        onChange={(e) => setBusDistance(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Train */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Train size={14} /> Train</span>
                        <span>{trainDistance} km/day</span>
                      </div>
                      <input
                        type="range" min="0" max="100" value={trainDistance}
                        onChange={(e) => setTrainDistance(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Bike */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Bike size={14} /> Bicycle</span>
                        <span>{bikeDistance} km/day</span>
                      </div>
                      <input
                        type="range" min="0" max="50" value={bikeDistance}
                        onChange={(e) => setBikeDistance(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Walk */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Footprints size={14} /> Walking</span>
                        <span>{walkingDistance} km/day</span>
                      </div>
                      <input
                        type="range" min="0" max="30" value={walkingDistance}
                        onChange={(e) => setWalkingDistance(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-primary" /> Monthly Energy Usage (kWh)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Estimate your monthly household power bill or electricity consumption in Kilowatt-hours (kWh).
                  </p>

                  <div className="flex flex-col gap-4 mt-6">
                    <Input
                      label="Electricity Consumption"
                      type="number"
                      value={monthlyElectricity}
                      onChange={(e) => setMonthlyElectricity(Math.max(0, parseInt(e.target.value) || 0))}
                      helperText="An average household consumes around 200 - 450 kWh per month."
                      required
                    />

                    {/* Quick Range Slider */}
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                        <span>Low Usage (100 kWh)</span>
                        <span>High Usage (1000 kWh)</span>
                      </div>
                      <input
                        type="range" min="50" max="1000" step="10" value={monthlyElectricity}
                        onChange={(e) => setMonthlyElectricity(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Utensils className="text-primary" /> Dietary Habits
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Select the profile that best matches your typical daily nutrition.
                  </p>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {/* Vegetarian */}
                    <label className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition ${
                      dietType === 'vegetarian' ? 'border-primary bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio" name="diet" value="vegetarian" checked={dietType === 'vegetarian'}
                          onChange={() => setDietType('vegetarian')} className="accent-primary"
                        />
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Vegetarian / Vegan</p>
                          <p className="text-xs text-slate-500 mt-0.5">Focus on vegetables, grains, plant proteins. Low environmental index.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">~1.5t CO₂/yr</span>
                    </label>

                    {/* Mixed */}
                    <label className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition ${
                      dietType === 'mixed' ? 'border-primary bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio" name="diet" value="mixed" checked={dietType === 'mixed'}
                          onChange={() => setDietType('mixed')} className="accent-primary"
                        />
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Mixed Diet</p>
                          <p className="text-xs text-slate-500 mt-0.5">Average balance of vegetables, dairy, grains, poultry, and occasional meats.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-500">~2.5t CO₂/yr</span>
                    </label>

                    {/* Non-Vegetarian */}
                    <label className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition ${
                      dietType === 'non-vegetarian' ? 'border-primary bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio" name="diet" value="non-vegetarian" checked={dietType === 'non-vegetarian'}
                          onChange={() => setDietType('non-vegetarian')} className="accent-primary"
                        />
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Non-Vegetarian</p>
                          <p className="text-xs text-slate-500 mt-0.5">Frequent consumption of red meat (beef, lamb, pork) and seafood. High carbon profile.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-rose-500">~3.3t CO₂/yr</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="text-primary" /> Weekly Waste Output (kg)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Estimate the weight of garbage, single-use packages, and organic waste generated by you in a typical week.
                  </p>

                  <div className="flex flex-col gap-4 mt-6">
                    <Input
                      label="Weekly Waste Generation"
                      type="number"
                      value={weeklyWaste}
                      onChange={(e) => setWeeklyWaste(Math.max(0, parseInt(e.target.value) || 0))}
                      helperText="An average individual produces roughly 4-10 kg of waste per week."
                      required
                    />

                    {/* Quick Range Slider */}
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                        <span>Low waste (1 kg)</span>
                        <span>High waste (30 kg)</span>
                      </div>
                      <input
                        type="range" min="0" max="30" value={weeklyWaste}
                        onChange={(e) => setWeeklyWaste(parseInt(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || loading}
              icon={ArrowLeft}
            >
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                className="shadow-lg shadow-emerald-500/25"
              >
                Submit & Calculate <CheckCircle2 size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </Card>

        {/* Live Calculation Preview Dashboard */}
        <Card hoverEffect={false} className="border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between">
          <div className="text-left">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Live Preview</h3>
            
            <div className="flex flex-col items-center py-6 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-4xl font-black text-slate-900 dark:text-white font-outfit">
                {Math.round(liveTotal)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                kg CO₂ / month
              </span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                (~{Math.round((liveTotal * 12) / 100) / 10} tons / year)
              </span>
            </div>

            {/* Live Breakdowns */}
            <div className="flex flex-col gap-3.5 mt-6">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Transport
                </span>
                <span className="text-slate-900 dark:text-white">{Math.round(liveTransport)} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Home Energy
                </span>
                <span className="text-slate-900 dark:text-white">{Math.round(liveEnergy)} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" /> Diet Habits
                </span>
                <span className="text-slate-900 dark:text-white">{Math.round(liveFood)} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Waste Output
                </span>
                <span className="text-slate-900 dark:text-white">{Math.round(liveWaste)} kg</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-3 bg-emerald-500/10 rounded-xl text-left border border-emerald-500/10 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-primary font-bold">Calculation Factor Info:</span> We compute these based on direct emissions models, converting weekly waste and daily kilometers into standard monthly equivalents.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
