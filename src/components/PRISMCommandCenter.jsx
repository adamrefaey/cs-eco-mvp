import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Mic,
  Download,
  Settings,
  Brain,
  Zap,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Terminal,
  Code,
  TrendingUp,
  Shield,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/api/client";

const QUICK_ACTIONS = [
  { label: "System Status", icon: Shield, command: "Show me current system status" },
  { label: "Recent Alerts", icon: AlertCircle, command: "What are the latest alerts?" },
  { label: "AI Insights", icon: Brain, command: "Give me AI-generated insights" },
  { label: "Risk Summary", icon: TrendingUp, command: "Summarize current risks" }
];

const SYSTEM_PROMPTS = {
  dashboard: "I'm viewing the Dashboard. Help me understand key metrics and suggest actions.",
  contracts: "I'm managing Smart Contracts. Help me monitor health and optimize gas costs.",
  oracles: "I'm checking Oracle Feeds. Alert me to any anomalies or delays.",
  compliance: "I'm reviewing Compliance status. Show certification gaps and recommendations.",
  security: "I'm in Security Posture. Identify vulnerabilities and suggest controls."
};

export default function PRISMCommandCenter({ currentPage, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 **PRISM Command Center Online**\n\nI'm your AI copilot for Lumanagi. I can:\n• Analyze system metrics and anomalies\n• Explain AI decisions and recommendations\n• Execute governance actions\n• Answer questions about compliance\n• Provide intelligent suggestions\n\nHow can I assist you?",
      timestamp: new Date(),
      context: "system"
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mode, setMode] = useState("chat");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentPage && SYSTEM_PROMPTS[currentPage.toLowerCase()]) {
      addSystemMessage(`📍 Context: ${currentPage} page loaded`);
    }
  }, [currentPage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSystemMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "system",
      content,
      timestamp: new Date()
    }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const contextPrompt = currentPage 
        ? `User is on ${currentPage} page. ${SYSTEM_PROMPTS[currentPage.toLowerCase()] || ""}\n\nUser question: ${input}`
        : input;

      const response = await apiClient.post('/integrations/llm/invoke', {
        prompt: `You are PRISM, the AI copilot for Lumanagi - an infrastructure intelligence system aligned with ISO 27001, ISO 42001, and ISO 9241-210.

Context: ${contextPrompt}

Provide a helpful, concise response. If suggesting actions, format them as:
• Action items
If explaining technical concepts, be clear but not verbose.
If the question involves data analysis, provide insights.
If it's about compliance, reference relevant ISO standards.

Keep responses under 200 words unless analysis requires more detail.`,
        add_context_from_internet: false
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response || "I'm having trouble processing that request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("PRISM error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickAction = (command) => {
    setInput(command);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "👋 **PRISM Command Center Online**\n\nI'm your AI copilot for Lumanagi. I can:\n• Analyze system metrics and anomalies\n• Explain AI decisions and recommendations\n• Execute governance actions\n• Answer questions about compliance\n• Provide intelligent suggestions\n\nHow can I assist you?",
      timestamp: new Date(),
      context: "system"
    }]);
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
        {line}
      </p>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[85vh] max-h-[800px] bg-[#0F111A]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">PRISM Command Center</h2>
              <p className="text-xs text-white/60">AI-Powered Intelligence Copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="bg-white/10 border border-white/20 h-8">
                <TabsTrigger value="chat" className="data-[state=active]:bg-white/20 text-xs px-3 h-7">
                  <Brain className="w-3 h-3 mr-1.5" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="command" className="data-[state=active]:bg-white/20 text-xs px-3 h-7">
                  <Terminal className="w-3 h-3 mr-1.5" />
                  Command
                </TabsTrigger>
                <TabsTrigger value="analyze" className="data-[state=active]:bg-white/20 text-xs px-3 h-7">
                  <TrendingUp className="w-3 h-3 mr-1.5" />
                  Analyze
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearConversation}
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 overflow-x-auto">
          {QUICK_ACTIONS.map((action, idx) => (
            <Button
              key={idx}
              onClick={() => handleQuickAction(action.command)}
              size="sm"
              className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs h-8"
            >
              <action.icon className="w-3 h-3 mr-1.5" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-white'
                    : message.role === 'system'
                    ? 'bg-white/5 border border-white/10 text-white/70 text-sm'
                    : message.error
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                    : 'bg-white/10 border border-white/20 text-white'
                }`}
              >
                {message.role === 'assistant' && !message.error && (
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-xs font-semibold text-[#3B82F6]">PRISM AI</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {formatMessage(message.content)}
                </div>
                <div className="text-xs text-white/40 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />
                  <span className="text-sm text-white/70">PRISM is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask PRISM anything about your infrastructure..."
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-10 h-12"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="h-12 px-6 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:opacity-90 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Context: {currentPage || 'Global'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Mode: {mode}</span>
              <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70 text-[10px]">
                ISO 42001
              </Badge>
            </div>
          </div>

          <button
            onClick={clearConversation}
            className="mt-3 text-xs text-white/50 hover:text-white/70 transition-colors"
          >
            Clear conversation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}