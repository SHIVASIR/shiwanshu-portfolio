import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  BrainCircuit, 
  Briefcase, 
  Code2, 
  UserCheck, 
  ChevronDown,
  Loader2,
  MessageSquare,
  MinusCircle
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// Available Chatbot Roles / Personas
const BOT_ROLES = [
  {
    id: 'career',
    name: 'Recruiter & Career Guide',
    icon: Briefcase,
    badge: 'Popular',
    description: 'Portfolio Q&A, experience, and candidate matching',
    systemInstruction: 'You are Shiwanshu Kumar Singh\'s AI Career Assistant and Recruiter Guide. Your task is to help recruiters, hiring managers, and visitors learn about Shiwanshu\'s experience in Cloud Computing, Machine Learning, Data Science, B.Tech education, and software projects. Highlight his achievements such as Smart India Hackathon (SIH 2025) Team Lead, 240+ LeetCode solved, and Data Science internship. Be professional, enthusiastic, concise, and structured.',
  },
  {
    id: 'tech',
    name: 'Cloud & ML Architect',
    icon: BrainCircuit,
    badge: 'Technical',
    description: 'Deep dives into ML models, fraud detection, and Cloud architecture',
    systemInstruction: 'You are a Senior Cloud & Machine Learning Architect AI. Answer technical questions regarding Shiwanshu\'s projects like Credit Card Fraud Detection (LightGBM, Random Forest, SMOTE), Cloud-Native Inference Engine, Docker containers, and Cloud infrastructure with technical depth and clarity.',
  },
  {
    id: 'coding',
    name: 'DSA & Coding Mentor',
    icon: Code2,
    badge: 'Coding',
    description: 'Algorithms, LeetCode problem breakdowns, and code analysis',
    systemInstruction: 'You are an expert Data Structures & Algorithms Mentor. Help visitors analyze coding concepts, C++ / Python algorithms, problem-solving strategies, and technical interview questions.',
  },
];

// Available Model Modes
const MODEL_MODES = [
  {
    id: 'gemini-3.5-flash',
    name: 'General',
    speed: 'Balanced',
    icon: Sparkles,
    color: 'text-[#FFD000]',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Fast',
    speed: 'Ultra Fast',
    icon: Zap,
    color: 'text-[#FFD000]',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Complex Reasoning',
    speed: 'Deep Analysis',
    icon: BrainCircuit,
    color: 'text-[#FFD000]',
  },
];

const SUGGESTED_PROMPTS = [
  "What are Shiwanshu's top Machine Learning projects?",
  "Tell me about his role as SIH 2025 Team Lead.",
  "What cloud and programming technologies does Shiwanshu know?",
  "Summarize Shiwanshu's education and coding stats.",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "👋 Hi! I'm **Shiwanshu's AI Career Assistant**. Ask me anything about Shiwanshu's skills, projects in Machine Learning & Cloud, SIH 2025 leadership, or education!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(BOT_ROLES[0]);
  const [selectedModel, setSelectedModel] = useState(MODEL_MODES[0]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setErrorText(null);

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
          systemInstruction: selectedRole.systemInstruction,
          model: selectedModel.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from Gemini.');
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.text || 'I apologize, but I could not process that request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorText(err.message || 'Something went wrong. Please check your network connection.');
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Error**: ${err.message || 'Could not fetch response. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation cleared. Operating as **${selectedRole.name}** using **${selectedModel.name}**. How can I help you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorText(null);
  };

  const RoleIcon = selectedRole.icon;
  const ModelIcon = selectedModel.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="open-chat-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#050505] dark:bg-[#101010] border border-[#FFD000]/60 hover:border-[#FFD000] text-[#FFFFFF] rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(255,208,0,0.3)] transition-all duration-300 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD000] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD000]"></span>
            </span>
            <Bot className="h-4 w-4 text-[#FFD000]" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase hidden sm:inline">
              AI Career Guide
            </span>
            <span className="bg-[#FFD000] text-[9px] font-mono font-bold text-[#050505] px-2 py-0.5 rounded-full uppercase">
              Gemini
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Drawer / Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[calc(100vw-2.5rem)] sm:w-[420px] h-[580px] max-h-[82vh] bg-[#FFFFFF] dark:bg-[#050505] border border-black/15 dark:border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-[#050505] dark:text-[#FFFFFF]"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-[#FAFAFA] dark:bg-[#101010] border-b border-black/10 dark:border-white/12 flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#FFD000]/15 border border-[#FFD000]/40 text-[#050505] dark:text-[#FFD000]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-display font-bold text-sm text-[#050505] dark:text-[#FFFFFF]">
                      Shiwanshu AI Assistant
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#FFD000] text-[#050505] font-bold rounded">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1] mt-0.5 flex items-center">
                    Gemini Intelligence · Cloud & ML Expert
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  id="clear-chat-btn"
                  onClick={handleClearHistory}
                  title="Clear conversation"
                  className="p-1.5 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  id="close-chat-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Controls Bar (Role Selector & Model Mode) */}
            <div className="px-3.5 py-2 bg-[#FAFAFA] dark:bg-[#101010] border-b border-black/10 dark:border-white/10 flex items-center justify-between text-xs relative z-20">
              {/* Role Selector */}
              <div className="relative">
                <button
                  id="select-role-btn"
                  onClick={() => {
                    setShowRoleDropdown(!showRoleDropdown);
                    setShowModelDropdown(false);
                  }}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#171717] text-[#050505] dark:text-[#FFFFFF] border border-black/10 dark:border-white/12 hover:border-[#FFD000] transition-colors cursor-pointer"
                >
                  <RoleIcon className="h-3.5 w-3.5 text-[#FFD000]" />
                  <span className="truncate max-w-[120px] font-medium text-[11px]">
                    {selectedRole.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-[#525252] dark:text-[#A1A1A1]" />
                </button>

                {/* Role Dropdown */}
                <AnimatePresence>
                  {showRoleDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-1 w-64 p-1.5 bg-[#FFFFFF] dark:bg-[#101010] border border-black/10 dark:border-white/12 rounded-xl shadow-2xl space-y-1 z-30"
                    >
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1]">
                        Select Chatbot Persona
                      </div>
                      {BOT_ROLES.map((role) => {
                        const Icon = role.icon;
                        const isSelected = role.id === selectedRole.id;
                        return (
                          <button
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role);
                              setShowRoleDropdown(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg flex items-start space-x-2.5 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40'
                                : 'hover:bg-black/5 dark:hover:bg-[#171717] text-[#050505] dark:text-[#FFFFFF]'
                            }`}
                          >
                            <Icon className="h-4 w-4 text-[#FFD000] mt-0.5 shrink-0" />
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-xs">{role.name}</span>
                                <span className="text-[9px] px-1.5 py-0.5 bg-black/5 dark:bg-white/10 text-[#525252] dark:text-[#A1A1A1] rounded-full">
                                  {role.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#525252] dark:text-[#A1A1A1] leading-tight mt-0.5">
                                {role.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Model Mode Selector */}
              <div className="relative">
                <button
                  id="select-model-btn"
                  onClick={() => {
                    setShowModelDropdown(!showModelDropdown);
                    setShowRoleDropdown(false);
                  }}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#171717] text-[#050505] dark:text-[#FFFFFF] border border-black/10 dark:border-white/12 hover:border-[#FFD000] transition-colors cursor-pointer"
                >
                  <ModelIcon className={`h-3.5 w-3.5 ${selectedModel.color}`} />
                  <span className="font-mono text-[11px] font-medium">{selectedModel.name}</span>
                  <ChevronDown className="h-3 w-3 text-[#525252] dark:text-[#A1A1A1]" />
                </button>

                {/* Model Dropdown */}
                <AnimatePresence>
                  {showModelDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-1 w-56 p-1.5 bg-[#FFFFFF] dark:bg-[#101010] border border-black/10 dark:border-white/12 rounded-xl shadow-2xl space-y-1 z-30"
                    >
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#525252] dark:text-[#A1A1A1]">
                        Select Model Speed
                      </div>
                      {MODEL_MODES.map((m) => {
                        const Icon = m.icon;
                        const isSelected = m.id === selectedModel.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModel(m);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40'
                                : 'hover:bg-black/5 dark:hover:bg-[#171717] text-[#050505] dark:text-[#FFFFFF]'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                              <span className="font-mono text-xs">{m.name}</span>
                            </div>
                            <span className="text-[10px] text-[#525252] dark:text-[#A1A1A1] font-sans">
                              {m.speed}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2.5 max-w-[85%] ${
                        isUser ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                          isUser
                            ? 'bg-[#FFD000] text-[#050505]'
                            : 'bg-[#FAFAFA] dark:bg-[#171717] text-[#050505] dark:text-[#FFD000] border border-black/10 dark:border-white/12'
                        }`}
                      >
                        {isUser ? <UserCheck className="h-3.5 w-3.5" /> : <Bot className="h-4 w-4" />}
                      </div>

                      {/* Bubble */}
                      <div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                            isUser
                              ? 'bg-[#FFD000] text-[#050505] font-medium rounded-tr-none'
                              : 'bg-[#FAFAFA] dark:bg-[#101010] text-[#050505] dark:text-[#FFFFFF] border border-black/10 dark:border-white/12 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span
                          className={`text-[9px] text-[#525252] dark:text-[#A1A1A1] mt-1 block px-1 ${
                            isUser ? 'text-right' : 'text-left'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-center space-x-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAFAFA] dark:bg-[#171717] border border-black/10 dark:border-white/12 flex items-center justify-center text-[#FFD000]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3 bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 rounded-2xl rounded-tl-none flex items-center space-x-2 text-xs text-[#525252] dark:text-[#A1A1A1]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FFD000]" />
                    <span>Gemini is thinking ({selectedModel.name})...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Prompts (when message count is low) */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-3 py-2 bg-[#FAFAFA] dark:bg-[#101010] border-t border-black/10 dark:border-white/10 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 px-2.5 py-1 text-[10px] bg-white dark:bg-[#171717] hover:border-[#FFD000] text-[#050505] dark:text-[#FFFFFF] border border-black/10 dark:border-white/12 rounded-full transition-colors truncate max-w-[200px] cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#FAFAFA] dark:bg-[#101010] border-t border-black/10 dark:border-white/12 flex items-center space-x-2 relative z-20"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${selectedRole.name}...`}
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-[#050505] border border-black/10 dark:border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-[#050505] dark:text-[#FFFFFF] placeholder-[#525252] dark:placeholder-[#A1A1A1] focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-[#FFD000] hover:brightness-105 disabled:bg-black/10 dark:disabled:bg-white/10 disabled:text-[#525252] text-[#050505] rounded-xl transition-all shrink-0 flex items-center justify-center cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
