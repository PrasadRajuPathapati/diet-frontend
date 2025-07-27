import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Import all your page components, including the new ones
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import WeightTrackerPage from './pages/WeightTrackerPage';
import DietPlanPage from './pages/DietPlanPage';
import ExercisePlanPage from './pages/ExercisePlanPage';
import WeeklyGoalTrackingPage from './pages/WeeklyGoalTrackingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DietPlanAssistantPage from './pages/DietPlanAssistantPage';
import LandingPage from './pages/LandingPage'; // ✅ NEW landing page

import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    const storedLocalUser = localStorage.getItem('currentUser');
    if (storedLocalUser) {
      console.log('[App.js] Initializing user from localStorage:', JSON.parse(storedLocalUser));
      return JSON.parse(storedLocalUser);
    }
    const storedSessionUser = sessionStorage.getItem('currentUser');
    if (storedSessionUser) {
      console.log('[App.js] Initializing user from sessionStorage:', JSON.parse(storedSessionUser));
      return JSON.parse(storedSessionUser);
    }
    console.log('[App.js] No user found in storage on App init.');
    return null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (loggedInUser, rememberMe) => {
    console.log('[App.js] handleLogin called. loggedInUser:', loggedInUser, 'rememberMe:', rememberMe);
    setUser(loggedInUser);

    if (loggedInUser) {
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        sessionStorage.removeItem('currentUser');
        console.log('[App.js] User stored in localStorage.');
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        localStorage.removeItem('currentUser');
        console.log('[App.js] User stored in sessionStorage.');
      }
    } else {
      console.log('[App.js] handleLogin called with no user.');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
  };

  const handleSignUp = (loggedInUser) => {
    console.log('[App.js] handleSignUp called. loggedInUser:', loggedInUser);
    setUser(loggedInUser);
    if (loggedInUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      localStorage.removeItem('currentUser');
      console.log('[App.js] User stored in sessionStorage after signup.');
    }
  };

  const handleLogout = () => {
    console.log('[App.js] handleLogout called.');
    setUser(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  };

  const ProtectedRoute = ({ children }) => {
    const locationProtected = useLocation();
    console.log('[App.js] ProtectedRoute rendered. User for protection:', user, 'Path:', locationProtected.pathname);

    if (!user) {
      console.log('[App.js] ProtectedRoute: No user, redirecting to /login.');
      return <Navigate to="/login" replace />;
    }
    console.log('[App.js] ProtectedRoute: User found, rendering children.');
    return children;
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} /> {/* ✅ CHANGED */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={handleSignUp} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/weight-tracker" element={<ProtectedRoute><WeightTrackerPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/diet-plan" element={<ProtectedRoute><DietPlanPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/exercise-plan" element={<ProtectedRoute><ExercisePlanPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/weekly-goals" element={<ProtectedRoute><WeeklyGoalTrackingPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/diet-planner" element={<ProtectedRoute><DietPlanAssistantPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} /> {/* ✅ changed fallback to / */}
      </Routes>
    </div>
  );
}

export default App;
