"use client";

import { useEffect, useState, useRef } from "react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DEMO_RESPONSES: Record<string, string> = {
  "how to apply": "To apply for a scheme, go to the scheme details page and click 'Apply Now'. You'll be guided through a step-by-step process. Make sure your profile is up-to-date for better recommendations.",
  "what schemes": "Based on your profile, we recommend PM YASASVI Scholarship, Central Sector Scholarship, and PM Vidyalakshmi Education Loan. Visit the 'Recommended' section for personalized matches.",
  "documents needed": "Most schemes require: (1) Identity proof (Aadhaar/PAN), (2) Educational certificates, (3) Income proof, (4) Disability certificate (if applicable). Check individual scheme requirements for specifics.",
  "deadline": "Deadlines vary by scheme. Check your Reminders page for upcoming deadlines and dates. Most scholarships accept applications during academic year start (June-September).",
  "default": "I'm Janसहायक, your civic assistance guide. I can help you: (1) Find suitable government schemes, (2) Understand eligibility, (3) Guide you through applications, (4) Answer questions about benefits. What would you like help with?",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      type: "assistant",
      content: "नमस्ते! I'm Janसहायक, your civic assistance guide. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    for (const [key, response] of Object.entries(DEMO_RESPONSES)) {
      if (lower.includes(key)) {
        return response;
      }
    }
    return DEMO_RESPONSES.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: getResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-slate-900">Ask Janसहायक</h1>
        <p className="text-slate-600 text-sm">Get instant help with schemes, eligibility, and applications</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-slate-900 border border-slate-200 rounded-bl-none"
              }`}
            >
              <p className="text-sm md:text-base">{message.content}</p>
              <span className={`text-xs mt-1 block ${message.type === "user" ? "text-blue-100" : "text-slate-500"}`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6">
        <div className="space-y-3 mb-3">
          <p className="text-xs text-slate-600 font-medium">Quick questions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["How to apply?", "What schemes?", "Documents needed", "Deadlines?"].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about schemes, eligibility, or applications..."
            rows={2}
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
