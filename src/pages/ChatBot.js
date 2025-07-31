import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Loader2, Trash2 } from "lucide-react";

export default function ChatBot({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://diet-backend-nnb5.onrender.com/api";

  // Fetch existing chat history
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

  // Send a message
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
        setMessages((prev) => [...prev, { from: "bot", text: data.answer }]);
        await fetch(`${API_BASE}/save-diet-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, planText: data.answer }),
        });
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "❌ Unable to get answer" },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { from: "bot", text: "❌ Server error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

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
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">💬 Diet Assistant</h2>

      <Card className="h-[500px] overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                msg.from === "user"
                  ? "ml-auto bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg w-fit">
              <Loader2 className="animate-spin inline w-4 h-4 mr-2" />
              Thinking...
            </div>
          )}
        </ScrollArea>

        <CardContent className="border-t p-4 flex items-center gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={loading}>
            Send
          </Button>
          <Button variant="outline" onClick={clearChat} size="icon" title="Clear Chat">
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
