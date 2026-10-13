import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatApi } from '../api/chatApi';
import { useNavigation } from '../context/NavigationContext';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MapPin, 
  Navigation, 
  User, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const ChatBotDrawer = ({ isOpen, onClose }) => {
  const { locations, setSourceLocation, setDestinationLocation, calculateRoute } = useNavigation();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm **CampusBot**, your AI campus navigator powered by RAG.\n\nAsk me anything about classrooms, labs, offices, walking directions, or campus amenities!",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    'Where is the Advanced Java Lab?',
    'How do I reach Central Library from Block A?',
    'Where can I get coffee or snacks?',
    'Where is the HOD CSE Office?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(textToSend);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.reply,
        suggestedLocations: response.suggestedLocations,
        suggestedRoute: response.suggestedRoute,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: '⚠️ Sorry, I encountered a temporary error retrieving campus data. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRoute = (route) => {
    if (!route) return;
    const src = locations.find((l) => l.id === route.source.id);
    const dest = locations.find((l) => l.id === route.destination.id);
    if (src && dest) {
      setSourceLocation(src);
      setDestinationLocation(dest);
      calculateRoute(src.id, dest.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slideIn">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-campus-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-sm text-white">CampusBot AI</h3>
              <span className="text-[10px] bg-campus-500/20 text-campus-300 font-semibold px-2 py-0.2 rounded-full border border-campus-500/30">
                RAG Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Smart Campus Navigation Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-campus-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
              }`}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-campus-700">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li>{children}</li>,
                  h3: ({ children }) => <h3 className="font-bold text-sm text-slate-900 mb-1.5">{children}</h3>,
                  h4: ({ children }) => <h4 className="font-semibold text-xs text-slate-900 mb-1">{children}</h4>,
                }}
              >
                {msg.text}
              </ReactMarkdown>

              {/* Bot suggested route widget */}
              {msg.suggestedRoute && (
                <div className="mt-3 p-3 bg-campus-50 border border-campus-200 rounded-xl text-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px] text-campus-800">Directions Computed:</span>
                    <span className="text-[10px] font-semibold text-slate-600">
                      {Math.round(msg.suggestedRoute.totalDistanceMeters)}m (~{msg.suggestedRoute.estimatedWalkingMinutes}m)
                    </span>
                  </div>
                  <button
                    onClick={() => handleApplyRoute(msg.suggestedRoute)}
                    className="w-full py-2 px-3 bg-campus-600 hover:bg-campus-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Display on Interactive Map</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator (Week 7-8 syllabus) */}
        {loading && (
          <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl border border-slate-200/80 w-24">
            <div className="w-2 h-2 rounded-full bg-campus-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-campus-500 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-campus-500 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestion Chips */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-campus-50 hover:text-campus-600 text-slate-600 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CampusBot about locations, directions..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-campus-600 text-white rounded-xl hover:bg-campus-700 disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
