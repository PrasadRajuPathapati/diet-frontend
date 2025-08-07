import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell } from 'lucide-react';
// Diet Plan images
import dietStatic from "../assets/salad.png";
import dietGif from "../assets/salad.gif";

// Weight Tracker images
import weightStatic from "../assets/line-chart.png";
import weightAnimated from "../assets/line-chart.gif";

// Exercise Plan images
import exerciseStatic from "../assets/running.png";
import exerciseGif from "../assets/running.gif";

// AI Diet Assistant images
import aiDietStatic from "../assets/turing-test.png";
import aiDietGif from "../assets/turing-test.gif";

// Weekly Goals images
import weeklyStatic from "../assets/calendar-time.png";
import weeklyGif from "../assets/calendar-time.gif";

import balance from "../assets/student (2).gif";

function HomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [dietImg, setDietImg] = useState(dietStatic);
  const [weightImg, setWeightImg] = useState(weightStatic);
  const [exerciseImg, setExerciseImg] = useState(exerciseStatic);
  const [aiDietImg, setAiDietImg] = useState(aiDietStatic);
  const [weeklyImg, setWeeklyImg] = useState(weeklyStatic);

  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTimeDisplay, setCurrentDateTimeDisplay] = useState("");
  const [showCards, setShowCards] = useState(false);

  // Quotes + Emojis
  const quotesWithEmojis = [
    { text: "Small steps every day lead to big changes.", emoji: "🌱" },
    { text: "Your body can stand almost anything. It’s your mind you have to convince.", emoji: "🧠" },
    { text: "Don’t wish for it. Work for it.", emoji: "💪" },
    { text: "The only bad workout is the one you didn’t do.", emoji: "🏃" },
    { text: "Consistency is more important than perfection.", emoji: "📅" },
    { text: "Push yourself, because no one else is going to do it for you.", emoji: "🔥" }
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotesWithEmojis.length);
        setFade(true); // fade in
      }, 500);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const mobileCheck =
      window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
    setIsMobile(mobileCheck);

    if (mobileCheck) {
      setDietImg(dietGif);
      setWeightImg(weightAnimated);
      setExerciseImg(exerciseGif);
      setAiDietImg(aiDietGif);
      setWeeklyImg(weeklyGif);
    }
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      };
      setCurrentDateTimeDisplay(now.toLocaleString("en-IN", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000 * 60);

    setTimeout(() => {
      setShowCards(true);
      if (contentRef.current) {
        contentRef.current.classList.add("animate-fade-in-up");
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const userName = user.name || user.email || "User";

  return (
    <div
      className="min-h-screen flex flex-col p-0 animate-bg-gradient"
      style={{
        background:
          "linear-gradient(135deg, rgba(167, 243, 208, 0.7), rgba(255, 255, 255, 0.6), rgba(187, 247, 208, 0.7))",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Header */}
      <nav className="w-full flex justify-between items-center bg-white/40 backdrop-blur-lg shadow-lg px-4 md:px-6 py-3 mb-4 md:mb-6 border-b border-white/30 animate-fade-in-down">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-green-600">
            My Weight Loss Plan
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            {currentDateTimeDisplay}
          </p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            to="/profile-setup"
            className="px-3 py-1 md:px-4 md:py-2 bg-teal-500/40 backdrop-blur-md border border-white/30 
             text-black rounded-lg text-sm font-medium transition-all duration-300 transform 
             hover:scale-105 hover:shadow-lg hover:shadow-teal-200 active:scale-95 flex 
             items-center justify-center"
          >
            Profile
          </Link>
          <button
            onClick={onLogout}
            className="px-3 py-1 md:px-4 md:py-2 bg-rose-500/40 backdrop-blur-md border border-white/30 
             text-black rounded-lg text-sm font-medium transition-all duration-300 transform 
             hover:scale-105 hover:shadow-lg hover:shadow-rose-200 active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div
        ref={contentRef}
        className="w-full bg-white/40 backdrop-blur-lg rounded-none p-6 md:p-8 shadow-xl border-t border-white/30 flex-1 flex flex-col justify-start overflow-y-auto"
      >
<h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-6 text-center relative">
  <div className="flex items-center justify-center gap-1">
      <img
      src={balance}
      alt="Weekly Goals"
      className="w-14 h-12 object-contain"  // 👈 increase size here
    />
    <span>Welcome, {userName}!</span>
  </div>
  <span className="absolute left-1/2 -bottom-2 w-16 h-[3px] bg-green-300 rounded-full transform -translate-x-1/2"></span>
</h2>



        {/* Quote with emoji + highlight + fade */}
        <div
          className={`flex justify-center mb-4 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="px-4 py-2 rounded-full bg-green-100/70 text-gray-800 text-sm md:text-base flex items-center shadow-sm">
            <span className="mr-2 text-lg">{quotesWithEmojis[quoteIndex].emoji}</span>
            {quotesWithEmojis[quoteIndex].text}
          </span>
        </div>

        {/* Feature Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 transition-opacity duration-500 ${
            showCards ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Diet Plan */}
          <Link
            to="/diet-plan"
            className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 text-center 
             transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-200 
             animate-fade-in-card animation-delay-600 group"
            onMouseEnter={() => !isMobile && setDietImg(dietGif)}
            onMouseLeave={() => !isMobile && setDietImg(dietStatic)}
          >
            <img
              src={dietImg}
              alt="Diet Plan"
              className="w-14 h-14 mx-auto mb-3 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="text-lg md:text-xl font-semibold text-green-600 group-hover:text-green-600">
              Your Diet Plan
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Personalized meals to support your journey.
            </p>
          </Link>

          {/* Weight Tracker */}
          <Link
            to="/weight-tracker"
            className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 text-center 
             transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-200 
             animate-fade-in-card animation-delay-700 group"
            onMouseEnter={() => !isMobile && setWeightImg(weightAnimated)}
            onMouseLeave={() => !isMobile && setWeightImg(weightStatic)}
          >
            <img
              src={weightImg}
              alt="Weight Tracker"
              className="w-14 h-14 mx-auto mb-3 object-contain"
            />
            <h3 className="text-lg md:text-xl font-semibold text-blue-600 group-hover:text-green-600">
              Daily Weight Tracker
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Track your weight with progress charts.
            </p>
          </Link>

          {/* Exercise Plan */}
          <Link
            to="/exercise-plan"
            className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 text-center 
             transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-200 
             animate-fade-in-card animation-delay-800 group"
            onMouseEnter={() => !isMobile && setExerciseImg(exerciseGif)}
            onMouseLeave={() => !isMobile && setExerciseImg(exerciseStatic)}
          >
            <img
              src={exerciseImg}
              alt="Exercise Plan"
              className="w-14 h-14 mx-auto mb-3 object-contain"
            />
            <h3 className="text-lg md:text-xl font-semibold text-purple-600 group-hover:text-green-600">
              Exercise Plan
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Daily belly-fat workouts to stay active.
            </p>
          </Link>

          {/* Diet Plan Assistant */}
          <Link
            to="/diet-planner"
            className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 text-center 
             transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-200 
             animate-fade-in-card animation-delay-900 group"
            onMouseEnter={() => !isMobile && setAiDietImg(aiDietGif)}
            onMouseLeave={() => !isMobile && setAiDietImg(aiDietStatic)}
          >
            <img
              src={aiDietImg}
              alt="Diet Plan Assistant"
              className="w-14 h-14 mx-auto mb-3 object-contain"
            />
            <h3 className="text-lg md:text-xl font-semibold text-yellow-600 group-hover:text-green-600">
              Diet Plan Assistant
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Let AI suggest your meals for the day.
            </p>
          </Link>

          {/* Weekly Goals */}
          <Link
            to="/weekly-goals"
            className="bg-white/30 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6 text-center 
             transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-200 
             animate-fade-in-card animation-delay-1000 group"
            onMouseEnter={() => !isMobile && setWeeklyImg(weeklyGif)}
            onMouseLeave={() => !isMobile && setWeeklyImg(weeklyStatic)}
          >
            <img
              src={weeklyImg}
              alt="Weekly Goals"
              className="w-14 h-14 mx-auto mb-3 object-contain"
            />
            <h3 className="text-lg md:text-xl font-semibold text-indigo-600 group-hover:text-green-600">
              Weekly Goals
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Track your weekly achievements.
            </p>
          </Link>
        </div>
      </div>
      <footer className="text-center text-gray-500 text-sm py-3">
  © 2025 All rights reserved
</footer>

    </div>
    
  );
}

export default HomePage;
