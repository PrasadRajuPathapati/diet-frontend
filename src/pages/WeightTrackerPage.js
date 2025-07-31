import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WeightTrackerPage({ user, onLogout }) {
  const navigate = useNavigate();

  const [currentWeight, setCurrentWeight] = useState('');
  const [weightLogMessage, setWeightLogMessage] = useState('');
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [loggedWeights, setLoggedWeights] = useState(() => {
    const saved = localStorage.getItem('loggedWeights');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');

  useEffect(() => {
    localStorage.setItem('loggedWeights', JSON.stringify(loggedWeights));

    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short', year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit',
        hour12: true,
      };
      setCurrentDateTimeDisplay(now.toLocaleString('en-IN', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [loggedWeights]);

  const handleWeightLog = async (e) => {
    e.preventDefault();
    setIsLoggingWeight(true);
    setWeightLogMessage('');

    const weight = parseFloat(currentWeight);
    if (!weight || weight <= 0) {
      setWeightLogMessage({ type: 'error', text: 'Please enter a valid weight.' });
      setIsLoggingWeight(false);
      return;
    }

    await new Promise(res => setTimeout(res, 1500));

    const now = new Date();
    const entry = {
      id: Date.now(),
      weight,
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN'),
      timestamp: now.getTime()
    };

    setLoggedWeights(prev => [entry, ...prev].sort((a, b) => a.timestamp - b.timestamp));
    setWeightLogMessage({ type: 'success', text: `Logged ${weight} kg successfully!` });
    setCurrentWeight('');
    setIsLoggingWeight(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const sorted = [...loggedWeights].sort((a, b) => a.timestamp - b.timestamp);
  const chartData = {
    labels: sorted.map(l => l.date),
    datasets: [{
      label: 'Weight (kg)',
      data: sorted.map(l => l.weight),
      borderColor: '#4ade80',
      backgroundColor: '#4ade80',
      tension: 0.2,
      pointRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Weight Progress Over Time',
        color: '#16a34a',
        font: { size: 18, weight: 'bold' },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#555',
          font: { size: 14 }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
          color: '#555',
          font: { size: 14 }
        },
        ticks: {
          callback: value => `${value} kg`
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-green-100 p-4 rounded shadow-md mb-6">
        <div>
          <h1 className="text-xl font-bold text-green-800">Weight Tracker</h1>
          {currentDateTimeDisplay && (
            <p className="text-sm text-green-600">{currentDateTimeDisplay}</p>
          )}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/home')}
            className="bg-green-200 hover:bg-green-300 text-green-900 px-3 py-1 rounded"
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

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Log Your Weight</h2>
        <form onSubmit={handleWeightLog} className="flex flex-col gap-4">
          <input
            type="number"
            step="0.1"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="Enter weight in kg"
            className="border border-gray-300 px-3 py-2 rounded outline-green-500"
          />
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white py-2 rounded flex justify-center items-center gap-2 ${isLoggingWeight ? 'opacity-70 cursor-wait' : ''}`}
            disabled={isLoggingWeight}
          >
            {isLoggingWeight && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoggingWeight ? 'Logging...' : 'Log Weight'}
          </button>
        </form>
        {weightLogMessage.text && (
          <p className={`mt-2 text-sm ${weightLogMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {weightLogMessage.text}
          </p>
        )}
      </div>

      {/* History Table */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Weight History</h3>
        {loggedWeights.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-green-200">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time</th>
                  <th className="px-4 py-2 border">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {loggedWeights.slice().reverse().map(log => (
                  <tr key={log.id} className="even:bg-green-50">
                    <td className="px-4 py-2 border">{log.date}</td>
                    <td className="px-4 py-2 border">{log.time}</td>
                    <td className="px-4 py-2 border">{log.weight.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No data logged yet.</p>
        )}
      </div>

      {/* Chart */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Progress Chart</h3>
        {loggedWeights.length >= 2 ? (
          <div className="w-full h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-600">Log at least two weights to see progress.</p>
        )}
      </div>
    </div>
  );
}

export default WeightTrackerPage;
