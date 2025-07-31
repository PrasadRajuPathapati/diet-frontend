import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DietPlanPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [doneMeals, setDoneMeals] = useState([]);
  const [dietPlanText, setDietPlanText] = useState("");
  const [todayMeals, setTodayMeals] = useState([]);

  const API_BASE = "https://diet-backend-nnb5.onrender.com/api";

  const parsePlanForToday = (planText) => {
    if (!planText) return [];
    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

    const lines = planText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let capture = false;
    let meals = [];
    let currentMeal = null;

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes(dayName.toLowerCase())) {
        capture = true;
        return;
      }

      if (
        capture &&
        ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].some(
          (d) => lowerLine.includes(d) && !lowerLine.includes(dayName.toLowerCase())
        )
      ) {
        capture = false;
      }

      if (!capture) return;

      if (
        ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].some((d) =>
          lowerLine.startsWith(d)
        )
      ) {
        return;
      }

      if (line.startsWith("*") || line.endsWith(":")) {
        if (currentMeal) meals.push(currentMeal);

        const cleanName = line.replace(/^\*+/, "").replace(/\*+$/, "").trim();
        const lowerName = cleanName.toLowerCase();

        const allowed = ["breakfast", "lunch", "snack", "dinner"];
        const isAllowed = allowed.some((m) => lowerName.startsWith(m));

        if (isAllowed) {
          currentMeal = { name: cleanName, items: [] };
        } else {
          currentMeal = null;
        }
      } else if ((line.startsWith("+") || line.startsWith("-")) && currentMeal) {
        currentMeal.items.push(line.replace(/^[\+\-]/, "").trim());
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
    <div className="min-h-screen bg-green-50 text-gray-800 p-6">
      <header className="flex justify-between items-center bg-green-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-green-700">🥗 Your Diet Plan</h1>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
            onClick={() => navigate("/dashboard")}
          >
            🏠 Dashboard
          </button>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
            onClick={onLogout}
          >
            📒 Logout
          </button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {todayMeals.length > 0 ? (
          todayMeals.map((meal, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow hover:shadow-lg transform transition-all duration-300 border-l-4 ${
                doneMeals.includes(idx)
                  ? "border-green-600 opacity-70"
                  : "border-green-300"
              }`}
            >
              <div className="p-5">
                <h3 className="text-xl font-semibold text-green-700 mb-2">{meal.name}</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  {meal.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDone(idx)}
                  disabled={doneMeals.includes(idx)}
                  className={`w-full px-4 py-2 rounded font-medium ${
                    doneMeals.includes(idx)
                      ? "bg-green-200 text-green-800 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  } transition`}
                >
                  {doneMeals.includes(idx) ? "✅ Done" : "Mark as Done"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No diet plan found for today.</p>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-green-700 mb-4">📋 Full Diet Plan (Raw)</h2>
        {dietPlanText ? (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap max-h-96">
            {dietPlanText}
          </pre>
        ) : (
          <p className="text-gray-600">No diet plan saved yet.</p>
        )}
      </section>
    </div>
  );
}
