import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import AiAssistant from './pages/AiAssistant';
import CompanyDashboard from './pages/CompanyDashboard';
import LandingPage from './pages/LandinPage';
import Internships from './pages/Internship';
import Ranking from './pages/Ranking';
import Settings from './pages/Settings';

// Placeholder for missing pages
const Placeholder = ({ name }) => (
  <div className="placeholder-container">
    <h2 className="placeholder-title">{name} Page</h2>
    <p className="placeholder-text">
      This section is currently under development.
    </p>
  </div>
);

function AppContent() {
  const { user, loading } = useAuth();

  // Global loading state for Firebase Auth persistence
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<LandingPage name="Landing" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- PROTECTED ROUTES (Requires Login) --- */}
      <Route element={<ProtectedRoute isAllowed={!!user} redirectTo="/login" />}>
        <Route element={<DashboardLayout />}>
          
          {/* Shared Pages among all logged-in users */}
          <Route path="/profile" element={<Placeholder name="Profile" />} />
          <Route path="/settings" element={<Settings name="Settings" />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/rankings" element={<Ranking name="Rankings" />} />
          <Route path="/internships" element={<Internships name="Internships" />} />

          {/* --- ROLE-BASED DASHBOARDS --- */}
          
          {/* Student Dashboard */}
          <Route 
            path="/student-dashboard" 
            element={
              !user?.role ? (
                <div className="loading-container"><div className="spinner"></div></div>
              ) : user.role === 'student' ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/forbidden" />
              )
            } 
          />

          {/* School Dashboard */}
          <Route 
            path="/school-dashboard" 
            element={
              !user?.role ? (
                <div className="loading-container"><div className="spinner"></div></div>
              ) : user.role === 'school' ? (
                <SchoolDashboard />
              ) : (
                <Navigate to="/forbidden" />
              )
            } 
          />

          {/* Company Dashboard */}
          <Route 
            path="/company-dashboard" 
            element={
              !user?.role ? (
                <div className="loading-container"><div className="spinner"></div></div>
              ) : user.role === 'company' ? (
                <CompanyDashboard name="Company Dashboard" />
              ) : (
                <Navigate to="/forbidden" />
              )
            } 
          />
        </Route>
      </Route>

      {/* --- ERROR PAGES --- */}
      <Route path="/forbidden" element={<Placeholder name="403 - Forbidden Access" />} />
      <Route path="*" element={<Placeholder name="404 - Not Found" />} />
    </Routes>
  );
}

/**
 * Root App Component wrapped in AuthProvider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;