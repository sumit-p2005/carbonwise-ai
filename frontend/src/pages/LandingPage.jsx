import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Award, ArrowRight, CheckCircle2, Globe, Leaf } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const featureList = [
    {
      icon: Zap,
      title: 'Smart Carbon Calculator',
      description: 'Enter your transport, energy, food, and waste details with our intuitive sliding interface to instantly discover your footprint.'
    },
    {
      icon: Sparkles,
      title: 'AI Sustainability Coach',
      description: 'Interact with EcoBuddy, a customized conversational AI designed to give context-aware tips based on your profile.'
    },
    {
      icon: Award,
      title: 'Gamified Eco Challenges',
      description: 'Complete daily challenges like walking or composting, log completions to earn badges and boost your green score.'
    }
  ];

  const benefits = [
    {
      title: 'Save Household Costs',
      desc: 'Reducing electricity and fossil fuel use means lowering utility bills and fuel receipts by hundreds of dollars annually.'
    },
    {
      title: 'Live Healthier',
      desc: 'Replacing driving with biking or walking promotes active physical health, while eating cleaner diets supports wellness.'
    },
    {
      title: 'Real Climate Action',
      desc: 'Small lifestyle modifications compound into massive community effects. Track carbon savings and lead by example.'
    }
  ];

  const steps = [
    { num: '01', title: 'Calculate Baseline', desc: 'Input your energy, waste, and distance logs.' },
    { num: '02', title: 'Unlock AI Insights', desc: 'Our recommendation engine flags high-impact tweaks.' },
    { num: '03', title: 'Claim Weekly Goals', desc: 'Accept daily eco challenges and log them.' },
    { num: '04', title: 'Watch Carbon Fall', desc: 'Download charts and see your score grow over time.' }
  ];

  const statistics = [
    { value: '1.2M+', label: 'Tons CO2 Tracked' },
    { value: '45%', label: 'Avg Carbon Reduction' },
    { value: '85,000+', label: 'Challenges Finished' },
    { value: '98/100', label: 'Satisfaction Score' }
  ];

  const testimonials = [
    {
      quote: "CarbonWise AI completely changed how I look at my daily commute. Changing short car rides to biking boosted my score and saved me money!",
      author: "Jessica R.",
      role: "Product Manager"
    },
    {
      quote: "EcoBuddy acts like a real personal coach. It suggested specific changes to my meal schedules that immediately cut down food waste by 60%.",
      author: "David K.",
      role: "Sustainability Specialist"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col w-full relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-28 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div variants={itemVariants} className="flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-primary rounded-full text-xs font-semibold self-start">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>AI-Powered Personal Coached Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-slate-900 dark:text-white leading-tight">
            Track Your Carbon Footprint. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Build a Greener Future.
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
            AI-powered sustainability insights for everyday life. Calculate emissions, claim eco challenges, and get real-time recommendations.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link to="/register">
              <Button size="lg" className="shadow-lg shadow-emerald-500/25">
                Get Started <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center relative"
        >
          <div className="w-full max-w-[450px] aspect-square relative rounded-3xl overflow-hidden glass-card p-8 flex items-center justify-center">
            {/* Spinning background rings */}
            <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/20 dark:border-emerald-500/10 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-12 rounded-full border border-dashed border-teal-500/20 dark:border-teal-500/10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

            {/* Premium environmental SVGs */}
            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Earth Circle */}
              <circle cx="100" cy="100" r="50" fill="url(%23earthGlow)" className="opacity-80" />
              
              {/* Windmill 1 */}
              <g transform="translate(60, 60)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="#22c55e" strokeWidth="2" />
                <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                  <line x1="0" y1="0" x2="0" y2="-15" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="13" y2="7.5" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="-13" y2="7.5" stroke="#10b981" strokeWidth="1.5" />
                </motion.g>
              </g>

              {/* Windmill 2 */}
              <g transform="translate(140, 75)">
                <line x1="0" y1="0" x2="0" y2="35" stroke="#22c55e" strokeWidth="2" />
                <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}>
                  <line x1="0" y1="0" x2="0" y2="-12" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="10" y2="6" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="-10" y2="6" stroke="#10b981" strokeWidth="1.5" />
                </motion.g>
              </g>

              {/* Solar Panel */}
              <g transform="translate(100, 115) scale(0.8)">
                <path d="M-15 15 L15 15 L25 30 L-25 30 Z" fill="#334155" />
                <line x1="-15" y1="15" x2="-25" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="-5" y1="15" x2="-8" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="5" y1="15" x2="8" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="15" y1="15" x2="25" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="-20" y1="22" x2="20" y2="22" stroke="#f1f5f9" strokeWidth="0.5" />
              </g>

              {/* Leaves floating around */}
              <motion.path
                d="M30 140 C35 130 45 130 50 140 C45 150 35 150 30 140 Z"
                fill="#22c55e"
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <motion.path
                d="M160 50 C165 40 175 40 180 50 C175 60 165 60 160 50 Z"
                fill="#10b981"
                animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              />

              {/* Defs for gradients */}
              <defs>
                <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Glass Badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute bottom-6 right-6 p-4 glass-card rounded-2xl flex items-center gap-3 border border-white/20 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Globe size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Active Footprint</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">-45.2% CO₂</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-primary font-bold text-xs tracking-wider uppercase">Key Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
            Everything you need to lead a low-carbon lifestyle
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((feat, idx) => (
            <Card key={idx} delay={idx * 0.1} className="flex flex-col items-start gap-4">
              <div className="p-3 bg-emerald-500/10 text-primary rounded-xl">
                <feat.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 text-left leading-relaxed">{feat.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-100/50 dark:bg-slate-900/40 py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-left">
              <span className="text-primary font-bold text-xs tracking-wider uppercase">Why CarbonWise?</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 dark:text-white">
                Eco-conscious living benefits your wallet and wellness
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Adopting sustainable behaviors goes beyond global statistics. It has immediate, positive benefits on your physical health, your personal accounting, and your local community dynamics.
              </p>
              
              <div className="flex flex-col gap-4 mt-2">
                {benefits.map((ben, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{ben.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{ben.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[400px] aspect-square rounded-3xl glass-card overflow-hidden p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Carbon Reduction Path</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                
                {/* Visual Chart Graphic */}
                <div className="flex items-end gap-3 h-40 mt-4 px-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-[90%] rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold">W1</div>
                  <div className="w-full bg-slate-300 dark:bg-slate-600 h-[75%] rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold">W2</div>
                  <div className="w-full bg-primary/40 h-[55%] rounded-lg flex items-center justify-center text-[10px] text-primary dark:text-emerald-400 font-bold">W3</div>
                  <div className="w-full bg-primary/70 h-[35%] rounded-lg flex items-center justify-center text-[10px] text-white font-bold">W4</div>
                  <div className="w-full bg-primary h-[20%] rounded-lg flex items-center justify-center text-[10px] text-white font-bold">W5</div>
                </div>

                <div className="mt-4 text-left p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
                  <span className="text-xs font-semibold text-primary">Status: Outstanding</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">You reached a 70% decrease compared to your regional standard baseline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-primary font-bold text-xs tracking-wider uppercase">Simple Steps</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
            How CarbonWise AI Works
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((st, idx) => (
            <div key={idx} className="flex flex-col gap-4 text-left p-6 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 relative">
              <span className="text-4xl font-black text-slate-200 dark:text-slate-700/60 font-outfit">{st.num}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{st.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1 items-center">
                <span className="text-3xl sm:text-4xl font-extrabold font-outfit">{stat.value}</span>
                <span className="text-xs sm:text-sm font-medium text-emerald-100">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-primary font-bold text-xs tracking-wider uppercase">User Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">
            What our green community says
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((test, idx) => (
            <Card key={idx} className="flex flex-col justify-between text-left h-full">
              <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-sm">
                  {test.author.charAt(0)}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-950 dark:text-white">{test.author}</h5>
                  <span className="text-xs text-slate-400">{test.role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-emerald-950/20 dark:to-teal-950/10 border border-slate-800 dark:border-emerald-500/20 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
            Ready to calculate your footprint?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Join thousands of active users tracking and reducing emissions. Start with a 2-minute baseline test and get EcoBuddy coaching immediately.
          </p>
          <Link to="/register" className="mt-2">
            <Button size="lg" className="shadow-lg shadow-emerald-500/25">
              Start Free Trial <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/20 py-12 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto w-full no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary rounded text-white">
              <Leaf size={14} className="fill-current" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">CarbonWise AI</span>
          </div>
          <p>© 2026 CarbonWise AI. Built with love for a cleaner planet.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
            <a href="#" className="hover:text-primary transition">Contact Support</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
