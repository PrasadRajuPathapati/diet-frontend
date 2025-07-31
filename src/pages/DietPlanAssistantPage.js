import React from "react";
import ChatBot from "./ChatBot"; // adjust the path if needed

export default function DietPlanAssistantPage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-3xl bg-green-200 p-4 rounded-lg shadow-md mb-6 text-center">
        <h1 className="text-2xl font-bold text-green-800">🥗 Diet Plan Assistant</h1>
        <p className="text-sm text-green-700 mt-1">Ask your diet-related questions here</p>
      </header>

      {/* ChatBot Component */}
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg">
        <ChatBot user={user} />
      </div>
    </div>
  );
}
