import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, Bot, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { DESIGN_REPORT_CONTEXT } from '../constants';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm your InfoCup Circuit Assistant. Ask me about the design, the uA741 op-amps, or how the Carry/Borrow logic works.",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = ai.models.generateContent;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: input,
        config: {
          systemInstruction: DESIGN_REPORT_CONTEXT
        }
      });
      
      const text = response.text || "I couldn't generate a response. Please check the API key.";

      setMessages(prev => [...prev, { role: 'model', text: text, timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to Gemini.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-xl border border-cyan-400 transition-transform hover:scale-105 z-50 flex items-center gap-2"
      >
        <Bot className="w-6 h-6" />
        <span className="font-bold hidden md:inline">Ask AI Engineer</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border border-cyan-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Bot className="w-5 h-5" />
          <h3>Circuit Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-cyan-900/50 text-cyan-50 border border-cyan-800' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-800 text-slate-400 p-3 rounded-lg text-xs italic border border-slate-700">
               Analyzing circuit parameters...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about resistors, op-amps..."
          className="flex-1 bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white p-2 rounded-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
