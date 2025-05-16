"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const ChatComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch response");
      }

      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        text: "",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const content = JSON.parse(line.slice(2));
              if (typeof content === "string") {
                accumulatedText += content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, text: accumulatedText }
                      : msg
                  )
                );
              }
            } catch (err) {
              console.warn("Failed to parse chunk:", line, err);
            }
          }
        }
      }

      if (!accumulatedText) {
        throw new Error("No valid message content received");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops, something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-satoshi">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "600px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[260px] xs:w-[310px] sm:w-[380px] md:w-[450px] lg:w-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200"
            data-color-mode="light"
          >
            <div className="bg-black text-white p-5 flex justify-between items-center">
              <h3 className="text-2xl font-medium">Chat with Nova</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center">
                  Start a conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-5 flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <MDEditor.Markdown
                          source={msg.text}
                          className="markdown-body text-base"
                          style={{
                            background: "transparent",
                            color: "#1f2a44",
                            fontFamily: "Satoshi, sans-serif",
                          }}
                        />
                      ) : (
                        <p className="text-base">{msg.text}</p>
                      )}
                      <span className="text-xs text-gray-400 block mt-2">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoading && !messages[messages.length - 1]?.text && (
                <div className="text-gray-500 text-sm">Nova is typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-5 bg-white border-t border-gray-200">
              <div className="flex items-center gap-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  <Send size={28} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800"
          >
            <MessageCircle size={32} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatComponent;
