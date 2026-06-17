import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarbonProvider } from './context/CarbonContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Lazy load page components to split bundles and optimize initial load efficiency
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Insights = lazy(() => import('./pages/Insights'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Report = lazy(() => import('./pages/Report'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Chat = lazy(() => import('./pages/Chat'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Clean loader indicator for lazy loading boundaries
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-xs text-slate-400 mt-3 font-semibold animate-pulse">Loading CarbonWise...</p>
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CarbonProvider>
            <div className="flex flex-col min-h-screen">
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Navbar />
              <main id="main-content" tabIndex="-1" className="flex-grow flex flex-col justify-start">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Pages */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected SaaS App Sections */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/calculator" element={<Calculator />} />
                      <Route path="/insights" element={<Insights />} />
                      <Route path="/challenges" element={<Challenges />} />
                      <Route path="/report" element={<Report />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/chat" element={<Chat />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </CarbonProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
