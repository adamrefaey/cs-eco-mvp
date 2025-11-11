import React, { useState } from "react";
import { MessageSquare, X, Send, Lightbulb, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/api/integrations";

export default function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your Lumanagi AI assistant. I can help you with:\n\n• Understanding AI decisions\n• Finding ISO mappings\n• Explaining policies\n• Navigating the system\n\nWhat would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await InvokeLLM({
        prompt: `You are the Lumanagi AI Assistant. Help the user with their question about the Lumanagi system. Be concise and helpful. User question: ${input}`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: response
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I encountered an error processing your request. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: Shield, label: "ISO Mappings", query: "Show me ISO mappings for this page" },
    { icon: Lightbulb, label: "Explain Decision", query: "Explain the last AI decision" },
    { icon: FileText, label: "Policy Help", query: "Help me write a new policy" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-[#0a0118]/95 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <p className="text-xs text-white/60">ISO 42001, 22989</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/10">
        <p className="text-xs text-white/60 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => setInput(action.query)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm text-white/80"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white'
                  : 'bg-white/5 text-white/90'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-90"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}