import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ArrowRight, RefreshCw, Zap, Bot, User, Check } from 'lucide-react';
import { ChatMessage } from '../types';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: "Hello! I am the LEE INTEGRATIONS AI Concierge. Ask me about our custom web design systems, Google Business Profile management, 4K aerial photography, or organic local SEO. How can I help you innovate smarter today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickInquiries = [
    'How do I book a drone media shoot?',
    'What features are in the Local Domination package?',
    'How does Google Profile SEO work?',
    'How fast is website template delivery?',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'bot',
        text: "I apologize, but I am having trouble connecting to my cognitive model. Feel free to book direct or check back in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center border border-cyan-400/20 cursor-pointer"
        id="chatbot-launcher"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-pulse" />}
      </button>

      {/* Expandable Chat Widget Container */}
      {isOpen && (
        <div
          id="chatbot-widget-container"
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/20 relative">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">LEE INTEGRATIONS Concierge</h3>
                <span className="text-[10px] text-emerald-400 block font-semibold">Gemini AI Booking assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Message List area */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      isUser ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>

                    <div>
                      <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-500/5'
                          : 'bg-slate-850 text-slate-200 rounded-tl-none border border-slate-800'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-500 mt-1 block px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center text-[10px] shrink-0">
                    <Bot className="h-3 w-3 text-cyan-400" />
                  </div>
                  <div className="p-3 bg-slate-850 text-slate-400 rounded-2xl rounded-tl-none border border-slate-800 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions overlay */}
          {messages.length === 1 && (
            <div className="p-3 border-t border-slate-850 bg-slate-950/80">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-2 px-1">
                Frequent Inquiries
              </span>
              <div className="flex flex-col space-y-1">
                {quickInquiries.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    className="text-left py-1 px-2 hover:bg-slate-900 rounded-lg text-[10px] font-medium text-slate-300 border border-slate-850/60 hover:border-cyan-500/25 transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom input form */}
          <div className="p-3 bg-slate-950 border-t border-slate-850 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-all"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={loading || !inputText.trim()}
              className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all cursor-pointer disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
