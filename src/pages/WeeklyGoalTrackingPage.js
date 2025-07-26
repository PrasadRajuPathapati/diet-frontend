import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function WeeklyGoalTrackingPage({ user, onLogout }) { // Receive 'user' prop
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');
  const [weeklySummaryData, setWeeklySummaryData] = useState([]);

  // --- Duplicated Meal Plan Data and Helpers for calculation ---
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mealPlanData = {
    'Early Morning': {
      all: [
        { item: '1 glass lukewarm jeera water', calories: 0 },
        { item: 'OR soaked chia seeds water (1 tsp soaked overnight in 1 glass water)', calories: 50 }
      ]
    },
    Breakfast: {
      Mon: { item: '2 Idli + sambar (no coconut chutney) + ½ banana', calories: 300 },
      Tue: { item: 'Vegetable upma with 1 tsp ghee', calories: 250 },
      Wed: { item: 'Dosa (non-fermented, thin) + mint chutney', calories: 200 },
      Thu: { item: 'Pongal (with less ghee) + boiled beetroot', calories: 350 },
      Fri: { item: 'Oats with buttermilk + curry leaves', calories: 220 },
      Sat: { item: 'Ragi dosa + chutney', calories: 240 },
      Sun: { item: 'Moong dal chilla + carrot chutney', calories: 280 },
    },
    'Mid-Morning Snack': {
      all: [
        { item: '1 cup buttermilk with curry leaves', calories: 80 },
        { item: 'OR 1 guava / orange / papaya', calories: 60 }
      ]
    },
    Lunch: {
      Mon: { item: '1 cup rice + sambar + cabbage curry + 1 tsp ghee', calories: 450 },
      Tue: { item: '2 phulka + moong dal curry + snake gourd poriyal', calories: 400 },
      Wed: { item: 'Vegetable khichdi (no onion) + curd', calories: 420 },
      Thu: { item: 'Rice + rasam + beans curry + salad', calories: 380 },
      Fri: { item: 'Brown rice + horse gram curry (ulava charu)', calories: 470 },
      Sat: { item: '2 jowar rotis + tomato dal + carrot curry', calories: 430 },
      Sun: { item: 'Rice + curd + beetroot thoran + 1 tsp flaxseeds', calories: 400 },
    },
    'Evening Snack': {
      all: [
        { item: 'Roasted peanuts (1 tbsp)', calories: 100 },
        { item: 'OR 1 cup buttermilk with hing + cumin', calories: 80 },
        { item: 'OR 1 small banana or guava', calories: 90 }
      ]
    },
    Dinner: {
      Mon: { item: 'Vegetable soup + ragi roti', calories: 300 },
      Tue: { item: 'Dosa + mint chutney', calories: 250 },
      Wed: { item: 'Broken wheat (godhuma rava) upma', calories: 280 },
      Thu: { item: 'Moong dal soup + 1 idli', calories: 220 },
      Fri: { item: 'Steamed vegetable salad + fruit', calories: 180 },
      Sat: { item: 'Lemon rice (with less oil) + salad', calories: 320 },
      Sun: { item: 'Curd rice (small portion) + grated carrot', calories: 280 },
    },
    'Before Bed (Optional)': {
      all: [
        { item: '1 cup ajwain or jeera water (warm)', calories: 0 }
      ]
    }
  };

  const getMealItemsForDisplay = useCallback((categoryName, dayAbbr) => {
    const categoryData = mealPlanData[categoryName];
    if (!categoryData) return [];
    if (categoryData.all) {
      return categoryData.all;
    }
    const dailyItem = categoryData[dayAbbr];
    return dailyItem ? [dailyItem] : [{ item: `No plan for ${dayAbbr} ${categoryName}.`, calories: 0 }];
  }, [mealPlanData]);

  const mealCategoriesList = Object.keys(mealPlanData);
  const totalMealsPerDay = mealCategoriesList.length;
  // --- End Duplicated Data ---

  const generateWeeklySummary = useCallback(() => {
    const summary = [];
    const today = new Date();

    const allLoggedWeights = JSON.parse(localStorage.getItem('loggedWeights') || '[]');
    const dietCompletionHistory = JSON.parse(localStorage.getItem('dietCompletionHistory') || '{}');

    console.log('[WeeklyGoalTrackingPage] --- Generating Summary ---');
    console.log('[WeeklyGoalTrackingPage] Raw loggedWeights from localStorage:', allLoggedWeights);
    console.log('[WeeklyGoalTrackingPage] Raw dietCompletionHistory from localStorage:', dietCompletionHistory);

    for (let i = 0; i <= 6; i++) { // Loop for last 7 days (including today) - Today is i=0
      const d = new Date(today);
      d.setDate(today.getDate() - i); // Go back i days
      const dateStr = d.toDateString(); // e.g., "Fri Jul 25 2025"
      const formattedDateForDisplay = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); // e.g., "Jul 25"
      const dayAbbr = daysOfWeek[d.getDay()]; // e.g., "Fri"

      // Get Weight Status for the day
      const dayWeights = allLoggedWeights.filter(lw => new Date(lw.timestamp).toDateString() === dateStr);
      let weightStatus = 'N/A';
      if (dayWeights.length > 0) {
          weightStatus = `${dayWeights[dayWeights.length - 1].weight.toFixed(1)} kg`; // Latest weight for the day
      }

      // Get Diet Plan Status for the day
      const dayDietData = dietCompletionHistory[dateStr];
      console.log(`[WeeklyGoalTrackingPage] Processing date: ${dateStr}, Data found:`, dayDietData);
      let dietStatus = { message: 'Not Started', type: 'not-started' };
      if (dayDietData) {
        const eatenCount = Object.values(dayDietData.eatenMeals).filter(status => status).length;
        if (dayDietData.completionPercentage === 100) {
          dietStatus = { message: 'Completed Today!', type: 'completed' };
        } else {
          const missedMeals = mealCategoriesList.filter(category => !dayDietData.eatenMeals[category]);
          if (missedMeals.length > 0) {
              const missedMealNames = missedMeals.map(category => {
                  const items = getMealItemsForDisplay(category, dayAbbr);
                  return items[0] ? items[0].item.split('(')[0].trim() : category;
              });
              dietStatus = { message: `Missed: ${missedMealNames.join(', ')}`, type: 'missed' };
          } else {
              dietStatus = { message: `${dayDietData.completionPercentage}% Completed`, type: 'in-progress' };
          }
        }
      }

      summary.push({
        date: formattedDateForDisplay,
        day: dayAbbr,
        weight: weightStatus,
        dietPlan: dietStatus.message,
        dietPlanType: dietStatus.type
      });
    }
    setWeeklySummaryData(summary);
    console.log('[WeeklyGoalTrackingPage] Weekly summary data generated:', summary);
  }, [getMealItemsForDisplay, mealCategoriesList, location.pathname]); // location.pathname triggers re-generation on navigation

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

    generateWeeklySummary(); // Initial generation on mount/navigation

    const summaryInterval = setInterval(generateWeeklySummary, 5 * 60 * 1000); // Periodic refresh

    return () => {
        clearInterval(intervalId);
        clearInterval(summaryInterval);
    };
  }, [generateWeeklySummary]);

  if (!user) { // Check 'user' prop
    navigate('/login');
    return null;
  }

  return (
    <div className="home-page-container">
      <nav className="home-navbar">
        <h1 className="navbar-title">
          Weekly Goal Tracking
          {currentDateTimeDisplay && <span className="navbar-datetime">{currentDateTimeDisplay}</span>}
        </h1>
        <div>
          <button onClick={() => navigate('/home')} className="back-button">Back to Dashboard</button>
          <button onClick={() => { onLogout(); navigate('/login'); }} className="logout-button">Logout</button>
        </div>
      </nav>

      <div className="home-content-card">
        <h2 className="page-section-title">Your Weekly Progress Summary</h2>
        <p className="page-section-description">Review your weight and diet plan completion for the past 7 days.</p>

        <div className="weekly-summary-section">
            <div className="table-container">
              <table className="weekly-summary-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Weight</th>
                    <th>Diet Plan Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySummaryData.map((dayData, index) => (
                    <tr key={index}>
                      <td>{dayData.date}</td>
                      <td>{dayData.day}</td>
                      <td>{dayData.weight}</td>
                      <td className={`diet-status-cell status-${dayData.dietPlanType}`}>
                        {dayData.dietPlan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {weeklySummaryData.length === 0 && (
                <p className="no-data-message">No weekly data available. Start logging your weight and completing your diet!</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default WeeklyGoalTrackingPage;