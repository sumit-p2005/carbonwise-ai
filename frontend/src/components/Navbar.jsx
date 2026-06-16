import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Leaf, Sun, Moon, Menu, X, LogOut, Award, BarChart3, Calculator, HelpCircle, Trophy, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/calculator', label: 'Calculator', icon: Calculator },
    { to: '/insights', label: 'AI Insights', icon: HelpCircle },
    { to: '/challenges', label: 'Challenges', icon: Award },
    { to: '/report', label: 'Report', icon: BarChart3 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/chat', label: 'AI Coach', icon: MessageSquare },
  ];

  const activeClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-primary font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-sm transition-all duration-200";
  const inactiveClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-all duration-200";

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full transition-all duration-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
            <div className="p-1.5 bg-primary rounded-lg text-white">
              <Leaf size={20} className="fill-current" />
            </div>
            <span className="font-outfit tracking-wide">CarbonWise<span className="text-primary font-extrabold">AI</span></span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                  <link.icon size={16} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* Actions (Score, Darkmode, Auth) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Eco Score badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-primary rounded-full text-xs font-semibold">
                  <Award size={14} className="animate-pulse" />
                  <span>Eco Score: {user.ecoScore}</span>
                </div>

                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-550/10 hover:bg-rose-500/20 text-rose-500 rounded-lg text-xs font-semibold border border-rose-500/10 transition"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition shadow-md shadow-emerald-500/25">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Open Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 mb-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.name}</span>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-primary rounded-full text-xs font-semibold">
                      <Award size={12} />
                      <span>Eco Score: {user.ecoScore}</span>
                    </div>
                  </div>

                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center gap-3 px-4 py-2.5 rounded-lg text-primary font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-sm"
                          : "flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                      }
                    >
                      <link.icon size={18} />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 text-sm transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/25"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
