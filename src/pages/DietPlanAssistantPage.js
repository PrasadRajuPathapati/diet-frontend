import React from "react";
import ChatBot from "./ChatBot"; // adjust path if needed
import "../index.css";

export default function DietPlanAssistantPage({ user, onLogout }) {
  return (
    <div className="diet-assistant-page">
      <header className="assistant-header">
        <h1>🥗 Diet Plan Assistant</h1>
      </header>

      {/* Pass user object down to ChatBot */}
      <ChatBot user={user} />
    </div>
  );
}
