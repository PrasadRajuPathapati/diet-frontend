import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function WeeklyGoalTrackingPage({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');
  const [weeklySummaryData, setWeeklySummaryData] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Your mealPlanData remains unchanged

  const generateWeeklySummary = useCallback(() => {
    const allWeights = JSON.parse(localStorage.getItem('loggedWeights') || '[]');
    const dietHistory = JSON.parse(localStorage.getItem('dietCompletionHistory') || '{}');
    const summary = [];

    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const dayAbbr = daysOfWeek[d.getDay()];
      const formattedDate = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      const dayWeights = allWeights.filter(w => new Date(w.timestamp).toDateString() === dateStr);
      const weightStatus = dayWeights.length
        ? `${dayWeights[dayWeights.length - 1].weight.toFixed(1)} kg`
        : 'N/A';

      const dayDietData = dietHistory[dateStr];
      let dietStatus = 'Not Started', statusType = 'not-started';

      if (dayDietData) {
        if (dayDietData.completionPercentage === 100) {
          dietStatus = '✅ Completed'; statusType = 'completed';
        } else {
          const missed = Object.entries(dayDietData.eatenMeals)
            .filter(([, v]) => !v)
            .map(([meal]) => meal);
          dietStatus = missed.length
            ? `⚠️ Missed: ${missed.join(', ')}`
            : `${dayDietData.completionPercentage}%`;
          statusType = 'missed';
        }
      }

      summary.push({ date: formattedDate, day: dayAbbr, weight: weightStatus, dietStatus, statusType });
    }

    setWeeklySummaryData(summary);
  }, [location.pathname]);

  useEffect(() => {
    const updateClock = () => {
      setCurrentDateTimeDisplay(new Date().toLocaleString('en-IN', {
        weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true
      }));
    };
    updateClock();
    const timer = setInterval(updateClock, 60000);
    generateWeeklySummary();
    const summaryTimer = setInterval(generateWeeklySummary, 5 * 60 * 1000);

    return () => { clearInterval(timer); clearInterval(summaryTimer); };
  }, [generateWeeklySummary]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-green-50 p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-green-200 p-4 rounded-lg shadow-md mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-800">📊 Weekly Goals</h1>
          <p className="text-green-700 text-sm">{currentDateTimeDisplay}</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/home')}
            className="bg-white hover:bg-green-100 text-green-800 px-3 py-1 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => { onLogout(); navigate('/login'); }}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Summary Table */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-green-800 mb-4">Your Weekly Progress</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-green-200">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Weight</th>
                <th className="px-4 py-2">Diet Status</th>
              </tr>
            </thead>
            <tbody>
              {weeklySummaryData.map((d, idx) => (
                <tr key={idx} className="even:bg-green-50">
                  <td className="px-4 py-2">{d.date}</td>
                  <td className="px-4 py-2">{d.day}</td>
                  <td className="px-4 py-2">{d.weight}</td>
                  <td className={`px-4 py-2 font-medium ${d.statusType === 'completed' ? 'text-green-700' : d.statusType === 'missed' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {d.dietStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {weeklySummaryData.length === 0 && (
          <p className="mt-4 text-center text-gray-600">Start logging your weight and diet today!</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyGoalTrackingPage;
