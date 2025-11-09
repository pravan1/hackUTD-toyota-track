import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Settings, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import SettingsModal from './SettingsModal';
import {
  generateAIResponse,
  getQuickSuggestions,
  type ChatMessage,
  type AIMode
} from '../lib/ai';
import { useProfileStore } from '../store/profile';
import { fetchVehicles } from '../lib/api';
import type { Vehicle } from '../types/vehicle';
import { clsx } from 'clsx';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your Toyota Nexus assistant. Ask me anything about vehicles, comparisons, or financing!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { vehicleProfile, completed } = useProfileStore();

  const mode: AIMode = localStorage.getItem('GEMINI_API_KEY') ? 'gemini' : 'mock';
  const quickSuggestions = getQuickSuggestions(
    completed ? vehicleProfile : undefined
  );

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await fetchVehicles({ limit: 50 });
        setVehicleData(response.data);
      } catch (error) {
        console.error('Failed to load vehicle data for chatbot', error);
      }
    };

    loadVehicles();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate AI response
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || undefined;
      const model = localStorage.getItem('GEMINI_MODEL') || 'gemini-1.5-flash';

      const response = await generateAIResponse(
        textToSend,
        mode,
        {
          profile: completed ? vehicleProfile : undefined,
          vehicles: vehicleData
        },
        apiKey,
        model
      );

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-toyota-red text-white rounded-full shadow-lg flex items-center justify-center hover:bg-toyota-red-dark transition-colors focus:outline-none focus:ring-2 focus:ring-toyota-red focus:ring-offset-2"
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
          >
            <Card padding="none" className="flex flex-col h-[600px] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-toyota-red text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Toyota Nexus</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        {mode === 'gemini' ? 'AI Mode' : 'MOCK Mode'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(true)}
                    className="!text-white hover:bg-white/10 !p-2"
                    aria-label="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="!text-white hover:bg-white/10 !p-2"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-toyota-gray-light">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={clsx(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={clsx(
                        'max-w-[80%] rounded-lg px-4 py-2',
                        message.role === 'user'
                          ? 'bg-toyota-red text-white'
                          : 'bg-white text-toyota-black border border-gray-200'
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content.split('\n').map((line, i) => {
                          // Simple markdown rendering
                          const boldRegex = /\*\*(.*?)\*\*/g
                          const parts = line.split(boldRegex)

                          return (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j}>{part}</strong>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          )
                        })}
                      </div>
                      <div
                        className={clsx(
                          'text-xs mt-1',
                          message.role === 'user' ? 'text-white/70' : 'text-toyota-gray-dark'
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-toyota-black border border-gray-200 rounded-lg px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-toyota-red" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-4 py-2 border-t border-gray-200 bg-white">
                  <div className="text-xs text-toyota-gray-dark mb-2">Quick suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 bg-toyota-gray-light hover:bg-toyota-red/10 text-toyota-black rounded-full transition-colors border border-gray-300 hover:border-toyota-red"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="!px-4"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
