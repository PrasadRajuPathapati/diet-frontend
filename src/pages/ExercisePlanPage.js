import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ExercisePlanPage({ user, onLogout }) {
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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-50 to-white p-4">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-green-200 p-4 rounded-md shadow flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-900">🏋️‍♂️ Your Exercise Plan</h1>
          <p className="text-green-800 text-sm">{currentDateTimeDisplay}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/home')}
            className="bg-white border border-green-400 text-green-800 px-4 py-2 rounded hover:bg-green-100 transition"
          >
            🏠 Back to Dashboard
          </button>
          <button
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-green-800 mb-2">🔥 Daily Routine</h2>
        <p className="text-sm text-gray-700 mb-4">
          A consistent exercise routine is key for belly fat reduction and overall fitness.
          Aim for 10-15 minutes daily.
        </p>

        <ul className="list-disc list-inside mb-4 text-gray-800">
          {exercisePlanData['Daily Routine (10-15 mins)'].map((item, index) => (
            <li key={`ex-daily-${index}`} className="mb-1">{item}</li>
          ))}
        </ul>

        <p className="mb-2">
          <strong className="text-green-800">📅 Frequency:</strong>{" "}
          {exercisePlanData.Frequency}
        </p>
        <p className="mb-6">
          <strong className="text-green-800">🚶 Optional:</strong>{" "}
          {exercisePlanData.Optional}
        </p>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">💡 Tips for Success</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
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
