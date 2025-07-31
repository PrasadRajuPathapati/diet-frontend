import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import WeightTrackerPage from './pages/WeightTrackerPage';
import DietPlanPage from './pages/DietPlanPage';
import ExercisePlanPage from './pages/ExercisePlanPage';
import WeeklyGoalTrackingPage from './pages/WeeklyGoalTrackingPage';
import DietPlanAssistantPage from './pages/DietPlanAssistantPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LandingPage from './pages/LandingPage';

import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    let initialUser = null;

    // --- Attempt to retrieve from localStorage (for 'Remember Me') ---
    const storedLocalUserRaw = localStorage.getItem('currentUser');
    console.log('[App.js] On App init: Raw localStorage currentUser:', storedLocalUserRaw);
    if (storedLocalUserRaw) {
      try {
        const parsedUser = JSON.parse(storedLocalUserRaw);
        if (parsedUser && typeof parsedUser.id === 'string') {
          initialUser = parsedUser;
          console.log('[App.js] On App init: Successfully parsed user from localStorage (Remember Me).');
        } else {
          console.warn('[App.js] On App init: localStorage currentUser is invalid JSON or malformed. Clearing it.');
          localStorage.removeItem('currentUser');
        }
      } catch (e) {
        console.error('[App.js] On App init: Error parsing localStorage user data. Clearing corrupted data:', e);
        localStorage.removeItem('currentUser');
      }
    }

    // --- If not found/valid in localStorage, attempt to retrieve from sessionStorage (for session-only) ---
    if (!initialUser) {
      const storedSessionUserRaw = sessionStorage.getItem('currentUser');
      console.log('[App.js] On App init: Raw sessionStorage currentUser:', storedSessionUserRaw);
      if (storedSessionUserRaw) {
        try {
          const parsedUser = JSON.parse(storedSessionUserRaw);
          if (parsedUser && typeof parsedUser.id === 'string') {
            initialUser = parsedUser;
            console.log('[App.js] On App init: Successfully parsed user from sessionStorage (Session Only).');
          } else {
            console.warn('[App.js] On App init: sessionStorage currentUser is invalid JSON or malformed. Clearing it.');
            sessionStorage.removeItem('currentUser');
          }
        } catch (e) {
          console.error('[App.js] On App init: Error parsing sessionStorage user data. Clearing corrupted data:', e);
          sessionStorage.removeItem('currentUser');
        }
      }
    }
    
    console.log('[App.js] Final user state on App init:', initialUser ? initialUser.email : 'null');
    return initialUser;
  });

  const navigate = useNavigate();
  const location = useLocation();

  const isProfileIncomplete = (u) => {
    if (!u) return true;
    return u.initialWeight == null || u.targetWeight == null || u.age == null || u.conditions == null || u.conditions.trim() === "";
  };

  const handleLogin = (loggedInUser, rememberMe) => {
    console.log('[App.js] handleLogin called. loggedInUser:', loggedInUser, 'Remember Me checked:', rememberMe);
    setUser(loggedInUser); 

    if (loggedInUser) {
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        sessionStorage.removeItem('currentUser'); 
        console.log('[App.js] User stored in localStorage (Remember Me). Stored value:', JSON.stringify(loggedInUser));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        localStorage.removeItem('currentUser'); 
        console.log('[App.js] User stored in sessionStorage (Session Only). Stored value:', JSON.stringify(loggedInUser));
      }

      if (isProfileIncomplete(loggedInUser)) {
        console.log('[App.js] Redirecting to profile-setup because profile is incomplete for:', loggedInUser.email);
        navigate('/profile-setup');
      } else {
        console.log('[App.js] Profile complete for:', loggedInUser.email, 'redirecting to home');
        navigate('/home');
      }

    } else {
      console.log('[App.js] handleLogin called with no user (e.g., failed login or manual clearing).');
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
      console.log('[App.js] User stored in sessionStorage after signup. Stored value:', JSON.stringify(loggedInUser));
      navigate('/profile-setup');
    }
  };

  const handleLogout = () => {
    console.log('[App.js] handleLogout called. Clearing user from storage.');
    setUser(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  const ProtectedRoute = ({ children }) => {
    const navigateProtected = useNavigate();
    const locationProtected = useLocation();

    console.log('[App.js] ProtectedRoute rendered. User for protection:', user, 'Path:', locationProtected.pathname);

    if (!user) {
      console.log('[App.js] ProtectedRoute: No user, redirecting to /login.');
      return <Navigate to="/login" replace />;
    }

    if (isProfileIncomplete(user) && locationProtected.pathname !== '/profile-setup') {
      console.log('[App.js] ProtectedRoute: Profile incomplete for user:', user.email, 'redirecting to profile setup.');
      return <Navigate to="/profile-setup" replace />;
    }

    console.log('[App.js] ProtectedRoute: User found and profile complete (or on setup page), rendering children.');
    return children;
  };

  return (
    <div className="App">
      <Routes>
        {/* NEW: Intelligent Root Redirect */}
        <Route path="/" element={
          user ? ( // If user is logged in (from localStorage or sessionStorage)
            isProfileIncomplete(user) ? ( // Check profile completeness
              <Navigate to="/profile-setup" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : ( // If no user, show LandingPage
            <LandingPage />
          )
        } />
        
        {/* Public Routes (Login/Signup/Password Recovery) */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={handleSignUp} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Profile Setup (accessible when profile incomplete) */}
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage user={user} onLogin={handleLogin} /></ProtectedRoute>} />

        {/* Protected Main App Routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/weight-tracker" element={<ProtectedRoute><WeightTrackerPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/diet-plan" element={<ProtectedRoute><DietPlanPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/exercise-plan" element={<ProtectedRoute><ExercisePlanPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/weekly-goals" element={<ProtectedRoute><WeeklyGoalTrackingPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/diet-planner" element={<ProtectedRoute><DietPlanAssistantPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />

        {/* Fallback route: Now redirects to LandingPage (/) as a last resort */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;