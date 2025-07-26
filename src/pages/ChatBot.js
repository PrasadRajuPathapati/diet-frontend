import React, { useState, useEffect } from "react";
import "../index.css";

export default function ChatBot({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://diet-backend-nnb5.onrender.com/api";

  // ✅ Load previous chats on mount
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_BASE}/chats/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const rawChats = data.data || [];
        const formatted = rawChats.flatMap((chat) => [
          { from: "user", text: chat.prompt },
          { from: "bot", text: chat.answer },
        ]);
        setMessages(formatted);
      })
      .catch((err) => console.error("❌ Error loading chats:", err));
  }, [user]);

  // ✅ Send message to bot
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, userId: user.id }),
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        // ✅ Add bot message to chat
        setMessages((prev) => [...prev, { from: "bot", text: data.answer }]);

        // ✅ SAVE the diet plan permanently
        await fetch(`${API_BASE}/save-diet-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, planText: data.answer }),
        });
      } else {
        console.error("❌ Chat API error:", data);
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "❌ Unable to get answer" },
        ]);
      }
    } catch (e) {
      console.error("❌ Network error:", e);
      setMessages((prev) => [...prev, { from: "bot", text: "❌ Server error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ✅ Clear chat except last plan
  const clearChat = async () => {
    if (!user?.id) return;
    try {
      await fetch(`${API_BASE}/clear-chats/${user.id}`, { method: "DELETE" });
      setMessages([]);
    } catch (err) {
      console.error("❌ Error clearing chats:", err);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="title">💬 Diet Chatbot</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">⏳ Thinking…</div>}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={clearChat}>Clear Chat</button>
      </div>
    </div>
  );
}
