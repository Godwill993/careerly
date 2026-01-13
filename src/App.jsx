import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SchoolDashboard from './pages/SchoolDashboard';

// Placeholder for missing pages
const Placeholder = ({ name }) => (
  <div style={{ padding: '2rem', background: 'white', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}>
    <h2 style={{ color: 'var(--color-primary)' }}>{name} Page</h2>
    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
      This section is currently under development.
    </p>
  </div>
);

function AppContent() {
  const { user, loading } = useAuth();

  // Global loading state for Firebase Auth persistence
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ marginBottom: '1rem' }}></div>
          <p style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<Placeholder name="Landing" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- PROTECTED ROUTES (Requires Login) --- */}
      <Route element={<ProtectedRoute isAllowed={!!user} redirectTo="/login" />}>
        <Route element={<DashboardLayout />}>
          
          {/* Shared Pages among all logged-in users */}
          <Route path="/profile" element={<Placeholder name="Profile" />} />
          <Route path="/settings" element={<Placeholder name="Settings" />} />
          <Route path="/ai-assistant" element={<Placeholder name="AI Assistant" />} />
          <Route path="/rankings" element={<Placeholder name="Rankings" />} />
          <Route path="/internships" element={<Placeholder name="Internships" />} />

          {/* --- ROLE-BASED DASHBOARDS --- */}
          
          {/* Student Dashboard */}
          <Route 
            path="/student-dashboard" 
            element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/forbidden" />} 
          />

          {/* School Dashboard */}
          <Route 
            path="/school-dashboard" 
            element={user?.role === 'school' ? <SchoolDashboard /> : <Navigate to="/forbidden" />} 
          />

          {/* Company Dashboard */}
          <Route 
            path="/company-dashboard" 
            element={user?.role === 'company' ? <Placeholder name="Company Dashboard" /> : <Navigate to="/forbidden" />} 
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