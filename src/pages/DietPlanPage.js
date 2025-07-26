import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function DietPlanPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [doneMeals, setDoneMeals] = useState([]);
  const [dietPlanText, setDietPlanText] = useState(""); // raw text from backend
  const [todayMeals, setTodayMeals] = useState([]); // parsed meals for today

  const API_BASE = "http://localhost:5000/api";

  // ✅ Helper: extract meals only for today's day
  const parsePlanForToday = (planText) => {
    if (!planText) return [];

    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

    // Split text by lines
    const lines = planText.split("\n").map((l) => l.trim()).filter(Boolean);

    let capture = false;
    let meals = [];
    let currentMeal = null;

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();

      // Start capturing when we find today
      if (lowerLine.includes(dayName.toLowerCase())) {
        capture = true;
        return; // skip the heading line itself
      }

      // Stop capturing when another day appears
      if (
        capture &&
        (lowerLine.includes("monday") ||
          lowerLine.includes("tuesday") ||
          lowerLine.includes("wednesday") ||
          lowerLine.includes("thursday") ||
          lowerLine.includes("friday") ||
          lowerLine.includes("saturday") ||
          lowerLine.includes("sunday")) &&
        !lowerLine.includes(dayName.toLowerCase())
      ) {
        capture = false;
      }

      if (!capture) return;

      // Skip lines that are just the day headings accidentally captured
      if (
        ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].some((d) =>
          lowerLine.startsWith(d)
        )
      ) {
        return;
      }

      // Detect a meal heading: starts with "*" or ends with ":"
      if (line.startsWith("*") || line.endsWith(":")) {
        if (currentMeal) meals.push(currentMeal);
        const cleanName = line.replace(/^\*+/, "").replace(/\*+$/, "").trim();
        // Skip if name is exactly the day (just in case)
        const lowerName = cleanName.toLowerCase();
        if (
          ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].includes(lowerName)
        ) {
          return;
        }
        currentMeal = { name: cleanName, items: [] };
      } else if (line.startsWith("+") || line.startsWith("-")) {
        if (currentMeal) {
          currentMeal.items.push(line.replace(/^[\+\-]/, "").trim());
        }
      }
    });

    if (currentMeal) meals.push(currentMeal);
    return meals;
  };

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/diet-plan/${user.id}`);
        if (!res.ok) {
          setDietPlanText("");
          setTodayMeals([]);
          return;
        }
        const data = await res.json();
        const text = data.planText || "";
        setDietPlanText(text);

        const parsedMeals = parsePlanForToday(text);
        setTodayMeals(parsedMeals);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setDietPlanText("");
        setTodayMeals([]);
      }
    };
    fetchPlan();
  }, [user]);

  const handleDone = (index) => {
    if (!doneMeals.includes(index)) {
      setDoneMeals([...doneMeals, index]);
    }
  };

  return (
    <div className="diet-plan-page">
      <header className="header">
        <h1>🥗 Your Diet Plan</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button onClick={onLogout}>📒 Logout</button>
        </div>
      </header>

      <div className="meals-grid">
        {todayMeals.length > 0 ? (
          todayMeals.map((meal, idx) => (
            <div className="meal-card" key={idx}>
              <h3>{meal.name}</h3>
              <ul>
                {meal.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button
                className={`done-btn ${doneMeals.includes(idx) ? "done" : ""}`}
                onClick={() => handleDone(idx)}
                disabled={doneMeals.includes(idx)}
              >
                {doneMeals.includes(idx) ? "✅ Done" : "Mark as Done"}
              </button>
            </div>
          ))
        ) : (
          <p>No diet plan found for today.</p>
        )}
      </div>

      <div className="detailed-plan-container">
        <h2>Your Full Diet Plan (Raw)</h2>
        {dietPlanText ? (
          <pre className="bot-plan">{dietPlanText}</pre>
        ) : (
          <p>No diet plan saved yet.</p>
        )}
      </div>
    </div>
  );
}
