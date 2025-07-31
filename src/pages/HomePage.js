import React, { useState, useEffect, useRef } from 'react'; // ADD useRef
import { useNavigate, Link } from 'react-router-dom';

function HomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const contentRef = useRef(null); // Create a ref for the content card

  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState('');
  const [latestWeight, setLatestWeight] = useState('N/A');
  const [dietPlanStatusMessage, setDietPlanStatusMessage] = useState('Loading...');
  const [showCards, setShowCards] = useState(false);

  // --- Duplicated Meal Plan Data and Helpers for HomePage calculation ---
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mealPlanData = {
    'Early Morning': { all: [{ item: '1 glass lukewarm jeera water', calories: 0 }, { item: 'OR soaked chia seeds water (1 tsp soaked overnight in 1 glass water)', calories: 50 }] },
    Breakfast: {
      Mon: { item: '2 Idli + sambar (no coconut chutney) + ½ banana', calories: 300 },
      Tue: { item: 'Vegetable upma with 1 tsp ghee', calories: 250 },
      Wed: { item: 'Dosa (non-fermented, thin) + mint chutney', calories: 200 },
      Thu: { item: 'Pongal (with less ghee) + boiled beetroot', calories: 350 },
      Fri: { item: 'Oats with buttermilk + curry leaves', calories: 220 },
      Sat: { item: 'Ragi dosa + chutney', calories: 240 },
      Sun: { item: 'Moong dal chilla + carrot chutney', calories: 280 },
    },
    'Mid-Morning Snack': { all: [{ item: '1 cup buttermilk with curry leaves', calories: 80 }, { item: 'OR 1 guava / orange / papaya', calories: 60 }] },
    Lunch: {
      Mon: { item: '1 cup rice + sambar + cabbage curry + 1 tsp ghee', calories: 450 },
      Tue: { item: '2 phulka + moong dal curry + snake gourd poriyal', calories: 400 },
      Wed: { item: 'Vegetable khichdi (no onion) + curd', calories: 420 },
      Thu: { item: 'Rice + rasam + beans curry + salad', calories: 380 },
      Fri: { item: 'Brown rice + horse gram curry (ulava charu)', calories: 470 },
      Sat: { item: '2 jowar rotis + tomato dal + carrot curry', calories: 430 },
      Sun: { item: 'Rice + curd + beetroot thoran + 1 tsp flaxseeds', calories: 400 },
    },
    'Evening Snack': { all: [{ item: 'Roasted peanuts (1 tbsp)', calories: 100 }, { item: 'OR 1 cup buttermilk with hing + cumin', calories: 80 }, { item: 'OR 1 small banana or guava', calories: 90 }] },
    Dinner: {
      Mon: { item: 'Vegetable soup + ragi roti', calories: 300 },
      Tue: { item: 'Dosa + mint chutney', calories: 250 },
      Wed: { item: 'Broken wheat (godhuma rava) upma', calories: 280 },
      Thu: { item: 'Moong dal soup + 1 idli', calories: 220 },
      Fri: { item: 'Steamed vegetable salad + fruit', calories: 180 },
      Sat: { item: 'Lemon rice (with less oil) + salad', calories: 320 },
      Sun: { item: 'Curd rice (small portion) + grated carrot', calories: 280 },
    },
    'Before Bed (Optional)': { all: [{ item: '1 cup ajwain or jeera water (warm)', calories: 0 }] }
  };

  const getMealItemsForDisplay = (categoryName, currentDayAbbr) => {
    const categoryData = mealPlanData[categoryName];
    if (!categoryData) return [];
    if (categoryData.all) return categoryData.all;
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
      const allLoggedWeights = JSON.parse(localStorage.getItem('loggedWeights') || '[]');
      if (allLoggedWeights.length > 0) {
        const sortedWeights = [...allLoggedWeights].sort((a, b) => b.timestamp - a.timestamp);
        setLatestWeight(`${sortedWeights[0].weight.toFixed(1)} kg`);
      } else {
        setLatestWeight('N/A');
      }

      const savedDietPlanState = JSON.parse(localStorage.getItem('dietCompletionHistory') || '{}');
      const today = new Date();
      const todayStr = today.toDateString();
      const currentDayAbbr = daysOfWeek[today.getDay()];

      const todayDietData = savedDietPlanState[todayStr];
      if (todayDietData) {
        const eatenCount = Object.values(todayDietData.eatenMeals).filter(status => status).length;
        if (eatenCount === totalMealsPerDay) {
          setDietPlanStatusMessage('✅ Completed Today!');
        } else {
          const missedMeals = mealCategoriesList.filter(category => !todayDietData.eatenMeals[category]);
          const missedMealNames = missedMeals.map(category => {
            const items = getMealItemsForDisplay(category, currentDayAbbr);
            return items[0] ? items[0].item.split('(')[0].trim() : category;
          });
          setDietPlanStatusMessage(`⚠️ Missed: ${missedMealNames.join(', ')}`);
        }
      } else {
        setDietPlanStatusMessage('⏳ Not Started Today');
      }
    };

    updateTrackingData();
    const trackingInterval = setInterval(updateTrackingData, 5 * 60 * 1000);

    // After initial load, show cards with a slight delay
    setTimeout(() => {
        setShowCards(true);
        if (contentRef.current) {
             contentRef.current.classList.add('animate-fade-in-up');
        }
    }, 100);

    return () => {
      clearInterval(intervalId);
      clearInterval(trackingInterval);
    };
  }, []);


  if (!user) {
    navigate('/login');
    return null;
  }

  const userName = user.name || user.email || 'User';


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col items-center p-4 animate-bg-gradient">
      {/* Header */}
      <nav className="w-full max-w-6xl flex justify-between items-center bg-white/70 backdrop-blur-md shadow-lg rounded-xl px-4 md:px-6 py-3 mb-4 md:mb-6 border border-white/30 animate-fade-in-down">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-green-600">My Weight Loss Plan</h1>
          <p className="text-xs md:text-sm text-gray-600">{currentDateTimeDisplay}</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/profile-setup"
            className="px-3 py-1 md:px-4 md:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center">
            Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
            }}
            className="px-3 py-1 md:px-4 md:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content - Attach the ref here */}
      <div ref={contentRef} className="w-full max-w-6xl bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/30 flex-grow-0 overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-2 md:mb-4 text-center animate-fade-in">Welcome, {userName}! 🌱</h2>
        <p className="text-sm md:text-base text-gray-700 mb-4 text-center animate-fade-in animation-delay-200">Let’s keep crushing your goals today!</p>

        <div className="mb-4 text-xs md:text-sm text-gray-800 text-center animate-fade-in animation-delay-400">
          <p><strong>Latest Weight:</strong> {latestWeight}</p>
          <p><strong>Diet Status:</strong> {dietPlanStatusMessage}</p>
          <p>Other Goals: *Coming soon!*</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 transition-opacity duration-500 ${showCards ? 'opacity-100' : 'opacity-0'}`}>
          <Link to="/diet-plan" className="feature-card feature-card-diet-plan animate-fade-in-card animation-delay-600">
            <h3 className="text-lg md:text-xl font-semibold text-green-600">🥗 Your Diet Plan</h3>
            <p className="text-sm text-gray-700 mt-2">Personalized meals to support your journey.</p>
          </Link>

          <Link to="/weight-tracker" className="feature-card animate-fade-in-card animation-delay-700">
            <h3 className="text-lg md:text-xl font-semibold text-blue-600">📊 Daily Weight Tracker</h3>
            <p className="text-sm text-gray-700 mt-2">Track your weight with progress charts.</p>
          </Link>

          <Link to="/exercise-plan" className="feature-card animate-fade-in-card animation-delay-800">
            <h3 className="text-lg md:text-xl font-semibold text-purple-600">🏋️ Exercise Plan</h3>
            <p className="text-sm text-gray-700 mt-2">Daily belly-fat workouts to stay active.</p>
          </Link>

          <Link to="/diet-planner" className="feature-card animate-fade-in-card animation-delay-900">
            <h3 className="text-lg md:text-xl font-semibold text-yellow-600">🤖 Diet Plan Assistant</h3>
            <p className="text-sm text-gray-700 mt-2">Let AI suggest your meals for the day.</p>
          </Link>

          <Link to="/weekly-goals" className="feature-card animate-fade-in-card animation-delay-1000">
            <h3 className="text-lg md:text-xl font-semibold text-indigo-600">📈 Weekly Goals</h3>
            <p className="text-sm text-gray-700 mt-2">Track your weekly achievements.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;