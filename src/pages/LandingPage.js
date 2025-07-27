import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">🍎 Welcome to Diet App</h1>
        <p className="landing-subtitle">
          Track your weight, plan your meals, and stay healthy with ease!
        </p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn login-btn">
            🚪 Login
          </Link>
          <Link to="/signup" className="landing-btn signup-btn">
            ✨ Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
