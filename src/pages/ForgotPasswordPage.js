import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "If your email exists, a reset link was sent.");
      } else {
        setError(data.message || "Unable to process your request.");
      }
    } catch (err) {
      setError("Network error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter your email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className={`primary-button ${isLoading ? "loading-button" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <Link to="/login" className="secondary-link">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
