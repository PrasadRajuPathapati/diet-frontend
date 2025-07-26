import React, { useState } from 'react'; // Fix: Remove ' =>'
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://diet-backend-nnb5.onrender.com/api';

function SignUpPage({ onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log(`[SignUpPage] Submitting signup for email: ${email}`);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(`[SignUpPage] API Response OK: ${response.ok}, Status: ${response.status}`);
      const data = await response.json();
      console.log('[SignUpPage] API Response Data:', data);

      if (response.ok) {
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          console.log(`[SignUpPage] Signup successful, auto-login successful. Calling onSignUp with user ID: ${loginData.user.id}`);
          onSignUp(loginData.user);
          console.log('[SignUpPage] Signup successful. Navigating directly to /home.');
          navigate('/home');
        } else {
          throw new Error(loginData.message || 'Auto-login failed after signup. Please try logging in.');
        }

      } else {
        console.log(`[SignUpPage] Signup failed, setting error: ${data.message}`);
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('[SignUpPage] Signup request error:', err);
      setError(err.message || 'Network error. Could not connect to the server.');
    } finally {
      setIsLoading(false);
      console.log('[SignUpPage] Signup process finished.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="form-input"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`primary-button ${isLoading ? 'loading-button' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
            <Link to="/login" className="secondary-link">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;