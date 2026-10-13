"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { sendChatMessage } from "@/features/chat/api";

const SUGGESTIONS = [
  "Find a family homestay in Ghandruk",
  "Homestays in Chitwan with WiFi",
  "How do I pay with eSewa?",
];

export default function ChatWidget() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! I'm your HomestayNepal Guide. Ask me about homestays, villages, or how to book!" },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isAuthenticated) return null;

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);
    try {
      const res = await sendChatMessage({ message: content, sessionId });
      setSessionId(res?.data?.sessionId || sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res?.data?.response || "Sorry, no answer.", homestays: res?.data?.homestays || [] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err?.response?.data?.message || "Sorry, I couldn't reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl text-2xl flex items-center justify-center transition-transform hover:scale-105"
        style={{ backgroundColor: "#C4654A", color: "#FAF6F0" }}
        aria-label="Open chat"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] h-[480px] bg-white rounded-3xl border border-[#E8DDD1] shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b bg-[#2C1810] text-[#FAF6F0]">
            <p className="font-serif font-bold text-sm">HomestayNepal Guide</p>
            <p className="text-[10px]" style={{ color: "#D4BBA5" }}>Online • Ask about homestays across Nepal</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] text-xs rounded-2xl px-3 py-2 whitespace-pre-line ${
                    m.role === "user" ? "bg-[#C4654A] text-white" : "bg-[#FAF6F0] text-[#2C1810]"
                  }`}
                >
                  {m.content}
                  {m.homestays && m.homestays.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {m.homestays.map((h) => (
                        <Link
                          key={h.id}
                          href={`/homestays/${h.slug || h.id}`}
                          className="block bg-white rounded-lg border border-[#E8DDD1] p-2 text-[#2C1810]"
                        >
                          <p className="font-bold text-[10px]">{h.name}</p>
                          <p className="text-[9px] text-[#7A5C45]">📍 {h.village} • NPR {h.pricePerNight}/night</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-[10px] text-[#7A5C45] animate-pulse">Thinking...</p>}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[10px] px-2 py-1 rounded-full border border-[#E8DDD1] text-[#7A5C45] hover:bg-[#FAF6F0]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about homestays..."
              className="flex-1 rounded-xl border border-[#E8DDD1] px-3 py-2 text-xs focus:outline-none focus:border-[#C4654A]"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#C4654A" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
