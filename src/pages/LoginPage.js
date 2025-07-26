import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this is defined here or imported

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // This hook is essential for direct navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log(`[LoginPage] Submitting login for email: ${email}`);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(`[LoginPage] API Response OK: ${response.ok}, Status: ${response.status}`);
      const data = await response.json();
      console.log('[LoginPage] API Response Data:', data);

      if (response.ok) {
        console.log(`[LoginPage] Login successful, calling onLogin with user ID: ${data.user.id}, rememberMe: ${rememberMe}`);
        onLogin(data.user, rememberMe); // This updates user state in App.js

        // Direct navigation to home on success
        console.log('[LoginPage] Login successful. Navigating directly to /home.');
        navigate('/home');
      } else {
        console.log(`[LoginPage] Login failed, setting error: ${data.message}`);
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('[LoginPage] Login request error:', err);
      setError('Network error. Could not connect to the server. Is the backend running?');
    } finally {
      setIsLoading(false);
      console.log('[LoginPage] Login process finished.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* 👉 Added Forgot Password Link */}
            <div className="forgot-password">
              <Link to="/forgot-password" className="secondary-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember Me
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`primary-button ${isLoading ? 'loading-button' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div> Logging In...
                </>
              ) : 'Login'}
            </button>
            <Link to="/signup" className="secondary-link">
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
