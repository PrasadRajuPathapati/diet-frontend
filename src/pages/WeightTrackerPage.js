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

function WeightTrackerPage({ user, onLogout }) { // Receive 'user' prop
  const navigate = useNavigate();

  const [currentWeight, setCurrentWeight] = useState('');
  const [weightLogMessage, setWeightLogMessage] = useState('');
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [loggedWeights, setLoggedWeights] = useState(() => {
    const savedWeights = localStorage.getItem('loggedWeights');
    return savedWeights ? JSON.parse(savedWeights) : [];
  });

  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');

  // Effect to save loggedWeights to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loggedWeights', JSON.stringify(loggedWeights));

    // Date/time update logic for navbar
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
  }, [loggedWeights]);


  const handleWeightLog = async (e) => {
    e.preventDefault();
    setWeightLogMessage('');
    setIsLoggingWeight(true);

    const weightValue = parseFloat(currentWeight);

    if (currentWeight === '' || isNaN(weightValue) || weightValue <= 0) {
      setWeightLogMessage({ type: 'error', text: 'Please enter a valid positive weight.' });
      setIsLoggingWeight(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Logging weight: ${weightValue} kg`);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const newLogEntry = {
      id: Date.now(),
      weight: weightValue,
      date: formattedDate,
      time: formattedTime,
      timestamp: now.getTime()
    };

    setLoggedWeights(prevWeights =>
      [newLogEntry, ...prevWeights].sort((a, b) => a.timestamp - b.timestamp)
    );

    setWeightLogMessage({ type: 'success', text: `Weight ${weightValue} kg logged successfully!` });
    setCurrentWeight('');
    setIsLoggingWeight(false);
  };

  if (!user) { // Check 'user' prop
    navigate('/login');
    return null;
  }

  const sortedLoggedWeights = [...loggedWeights].sort((a, b) => a.timestamp - b.timestamp);

  const chartLabels = sortedLoggedWeights.map(log => log.date);
  const chartDataPoints = sortedLoggedWeights.map(log => log.weight);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: chartDataPoints,
        fill: false,
        borderColor: '#28a745',
        backgroundColor: '#28a745',
        tension: 0.2,
        pointRadius: 5,
        pointBackgroundColor: '#1e8449',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#1e8449',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Weight Progress Over Time',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' kg';
            }
            return label;
          },
          title: function(context) {
              return 'Date: ' + context[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
              size: 14
          },
          color: '#555'
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
          font: {
              size: 14
          },
          color: '#555'
        },
        beginAtZero: false,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function(value) {
            return value + ' kg';
          }
        }
      },
    },
  };

  return (
    <div className="home-page-container">
      <nav className="home-navbar">
        <h1 className="navbar-title">
          Daily Weight Tracker
          {currentDateTimeDisplay && <span className="navbar-datetime">{currentDateTimeDisplay}</span>}
        </h1>
        <div>
          <button onClick={() => navigate('/home')} className="back-button">Back to Dashboard</button>
          <button onClick={() => { onLogout(); navigate('/login'); }} className="logout-button">Logout</button>
        </div>
      </nav>

      <div className="home-content-card">
        <h2 className="page-section-title">Log Your Weight</h2>
        <p className="page-section-description">Keep a consistent record of your weight to track your progress towards your goal of **65 kg** from **77 kg**.</p>

        <form onSubmit={handleWeightLog} className="weight-log-form">
          <input
            type="number"
            step="0.1"
            className="form-input weight-input"
            placeholder="Enter weight in kg (e.g., 72.5)"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            required
            aria-label="Enter current weight"
          />
          <button
            type="submit"
            className={`primary-button log-weight-button ${isLoggingWeight ? 'loading-button' : ''}`}
            disabled={isLoggingWeight}
          >
            {isLoggingWeight ? (
              <>
                <div className="spinner"></div> Logging...
              </>
            ) : 'Log Weight'}
          </button>
        </form>
        {weightLogMessage.text && (
          <p className={`weight-log-message ${weightLogMessage.type}`}>
            {weightLogMessage.text}
          </p>
        )}

        {/* Weight History Table */}
        <div className="weight-history-section">
            <h3 className="sub-section-title">Weight History</h3>
            {loggedWeights.length > 0 ? (
                <div className="table-container">
                    <table className="weight-history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Weight (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loggedWeights.slice().reverse().map(log => (
                                <tr key={log.id}>
                                    <td>{log.date}</td>
                                    <td>{log.time}</td>
                                    <td>{log.weight.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-message">No weight data logged yet. Log your first weight!</p>
            )}
        </div>


        {/* Weight Progress Chart (Replaced Placeholder) */}
        <div className="progress-graph-container">
          <h3 className="sub-section-title">Your Weight Progress Graph</h3>
          {loggedWeights.length >= 2 ? (
              <div className="chart-area">
                  <Line data={chartData} options={chartOptions} />
              </div>
          ) : (
              <p className="no-data-message">Log at least two weights to see your progress graph!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeightTrackerPage;