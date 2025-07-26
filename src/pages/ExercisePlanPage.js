import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ExercisePlanPage({ user, onLogout }) { // Receive 'user' prop
  const navigate = useNavigate();

  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setCurrentDateTimeDisplay(now.toLocaleString('en-IN', options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000 * 60);

    return () => clearInterval(intervalId);
  }, []);

  // Sample Exercise Plan Data
  const exercisePlanData = {
    'Daily Routine (10-15 mins)': [
      'Spot Jogging: 1 min warm-up',
      'High Knees: 1 min',
      'Leg Raises: 3 sets of 10',
      'Bicycle Crunches: 2 sets of 15',
      'Plank: 30 sec hold',
      'Surya Namaskars: 3 rounds'
    ],
    'Frequency': 'Do 5–6 days/week, morning or evening.',
    'Optional': 'Add walking after dinner (15 mins)'
  };

  if (!user) { // Check 'user' prop
    navigate('/login');
    return null;
  }

  return (
    <div className="home-page-container">
      <nav className="home-navbar">
        <h1 className="navbar-title">
          Your Exercise Plan
          {currentDateTimeDisplay && <span className="navbar-datetime">{currentDateTimeDisplay}</span>}
        </h1>
        <div>
          <button onClick={() => navigate('/home')} className="back-button">Back to Dashboard</button>
          <button onClick={() => { onLogout(); navigate('/login'); }} className="logout-button">Logout</button>
        </div>
      </nav>

      <div className="home-content-card">
        <h2 className="page-section-title">Your Daily Exercise Routine</h2>
        <p className="page-section-description">A consistent exercise routine is key for belly fat reduction and overall fitness. Aim for 10-15 minutes daily.</p>

        <div className="exercise-details-section">
            <h4>Daily Routine:</h4>
            <ul>
              {exercisePlanData['Daily Routine (10-15 mins)'].map((item, index) => (
                <li key={`ex-daily-${index}`}>{item}</li>
              ))}
            </ul>
            <p><strong>Frequency:</strong> {exercisePlanData.Frequency}</p>
            <p><strong>Optional:</strong> {exercisePlanData.Optional}</p>
        </div>

        <div className="tips-box">
            <h3 className="sub-section-title">Tips for Success:</h3>
            <ul>
                <li>Warm up before starting to prevent injuries.</li>
                <li>Stay hydrated throughout your workout.</li>
                <li>Listen to your body; don't push too hard initially.</li>
                <li>Consistency is more important than intensity.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}

export default ExercisePlanPage;