import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarbonProvider } from './context/CarbonContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Insights from './pages/Insights';
import Challenges from './pages/Challenges';
import Report from './pages/Report';
import Leaderboard from './pages/Leaderboard';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CarbonProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow flex flex-col justify-start">
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
              </main>
            </div>
          </CarbonProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
