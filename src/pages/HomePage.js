import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function HomePage({ user, onLogout }) { // Receive 'user' prop
  const navigate = useNavigate();

  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');
  const [latestWeight, setLatestWeight] = useState('N/A');
  const [dietPlanStatusMessage, setDietPlanStatusMessage] = useState('Loading...');

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

  const getMealItemsForDisplay = (categoryName, currentDayAbbr) => {
    const categoryData = mealPlanData[categoryName];
    if (!categoryData) return [];
    if (categoryData.all) {
      return categoryData.all;
    }
    const dailyItem = categoryData[currentDayAbbr];
    return dailyItem ? [dailyItem] : [{ item: `No plan for ${currentDayAbbr} ${categoryName}.`, calories: 0 }];
  };
  const mealCategoriesList = Object.keys(mealPlanData);
  const totalMealsPerDay = mealCategoriesList.length;
  // --- End Duplicated Data ---


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

    const updateTrackingData = () => {
      // Latest Weight
      const allLoggedWeights = JSON.parse(localStorage.getItem('loggedWeights') || '[]');
      if (allLoggedWeights.length > 0) {
        const sortedWeights = [...allLoggedWeights].sort((a, b) => b.timestamp - a.timestamp);
        setLatestWeight(`${sortedWeights[0].weight.toFixed(1)} kg`);
      } else {
        setLatestWeight('N/A');
      }

      // Diet Plan Status
      const savedDietPlanState = JSON.parse(localStorage.getItem('dietCompletionHistory') || '{}');
      const today = new Date();
      const todayStr = today.toDateString();
      const currentDayAbbr = daysOfWeek[today.getDay()];

      const todayDietData = savedDietPlanState[todayStr];
      if (todayDietData) {
        const eatenCount = Object.values(todayDietData.eatenMeals).filter(status => status).length;
        if (todayDietData.completionPercentage === 100) {
          setDietPlanStatusMessage('Completed Today!');
        } else {
          const missedMeals = mealCategoriesList.filter(category => !todayDietData.eatenMeals[category]);
          if (missedMeals.length > 0) {
            const missedMealNames = missedMeals.map(category => {
                const items = getMealItemsForDisplay(category, currentDayAbbr);
                return items[0] ? items[0].item.split('(')[0].trim() : category;
            });
            setDietPlanStatusMessage(`Missed: ${missedMealNames.join(', ')}`);
          } else {
            setDietPlanStatusMessage(`In Progress (${eatenCount}/${totalMealsPerDay})`);
          }
        }
      } else {
        setDietPlanStatusMessage('Not Started Today');
      }
    };

    updateTrackingData();
    const trackingInterval = setInterval(updateTrackingData, 5 * 60 * 1000);

    return () => {
        clearInterval(intervalId);
        clearInterval(trackingInterval);
    };
  }, []);


  if (!user) { // Check 'user' prop
    navigate('/login');
    return null;
  }

  return (
    <div className="home-page-container">
      <nav className="home-navbar">
        <h1 className="navbar-title">
          My Weight Loss Plan
          {currentDateTimeDisplay && <span className="navbar-datetime">{currentDateTimeDisplay}</span>}
        </h1>
        <button
          onClick={() => {
            onLogout();
            navigate('/login');
          }}
          className="logout-button"
        >
          Logout
        </button>
      </nav>

      <div className="home-content-card">
        <h2 className="home-welcome-title">Welcome to Your Personalized Plan!</h2>
        <p className="home-intro-text">
          Select a section below to get started with your health journey.
        </p>

        <div className="feature-cards-grid">
          {/* Your Diet Plan Card - FIRST AND BIGGER */}
          <Link to="/diet-plan" className="feature-card feature-card-diet-plan">
            <h3 className="feature-card-title">Your Diet Plan for Today</h3>
            <p className="feature-card-description">View your customized daily meal plan, gastric-friendly!</p>
            <span className="feature-card-icon">🥗</span>
          </Link>

          {/* Daily Weight Tracker Card */}
          <Link to="/weight-tracker" className="feature-card">
            <h3 className="feature-card-title">Daily Weight Tracker</h3>
            <p className="feature-card-description">Log your weight and see your progress over time.</p>
            <span className="feature-card-icon">📊</span>
          </Link>

          {/* Your Exercise Plan Card */}
          <Link to="/exercise-plan" className="feature-card">
            <h3 className="feature-card-title">Your Exercise Plan</h3>
            <p className="feature-card-description">Check out your daily exercise routine for belly fat reduction.</p>
            <span className="feature-card-icon">🏋️‍♀️</span>
          </Link>

          {/* NEW: Diet Plan Assistant Card */}
          <Link to="/diet-planner" className="feature-card">
            <h3 className="feature-card-title">Diet Plan Assistant</h3>
            <p className="feature-card-description">Let our assistant generate a personalized daily diet plan for you!</p>
            <span className="feature-card-icon">🧠</span> {/* Brain or Robot icon */}
          </Link>

          {/* Weekly Goal Tracking */}
          <Link to="/weekly-goals" className="feature-card">
            <h3 className="feature-card-title">Weekly Goal Tracking</h3>
            <p className="feature-card-description">Track your overall progress and see your weekly summary.</p>
            <span className="feature-card-icon">📈</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default HomePage;