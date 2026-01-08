
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, transcribeAudio } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { Send, User, Bot, Loader2, Mic, RefreshCw, Check, MicOff, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface ChatAssistantProps {
  language: Language;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ language }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isRecording, permissionDenied, startRecording, stopRecording } = useAudioRecorder();

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: language === 'English' 
        ? "Namaste! I am Janaki, your maternal health companion. I'm here to listen and help with any health questions you have. How are you feeling today?" 
        : "नमस्ते! मैं जानकी हूँ, आपकी मातृ स्वास्थ्य साथी। मैं आपकी बात सुनने और आपके स्वास्थ्य संबंधी किसी भी प्रश्न में मदद करने के लिए यहाँ हूँ। आज आप कैसा महसूस कर रही हैं?",
      timestamp: new Date()
    }]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await getChatResponse(history, userMsg.text, language);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: new Date() }]);
    } catch (e) { 
      console.error(e); 
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", timestamp: new Date() }]);
    }
    finally { setIsTyping(false); }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsTranscribing(true);
      const audio = await stopRecording();
      if (audio) { 
        const text = await transcribeAudio(audio);
        if (text) setInput(text); 
      }
      setIsTranscribing(false);
    } else { 
      startRecording(); 
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
      
      {/* Simple Clean Header */}
      <div className="bg-white px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Janaki</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Always here for you</p>
            </div>
          </div>
        </div>
        <button onClick={() => setMessages(messages.slice(0,1))} className="p-3 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide bg-slate-50/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-teal-100 text-teal-600'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div className={`relative max-w-[85%] md:max-w-[75%] rounded-[1.5rem] px-6 py-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              <div className="text-sm md:text-base leading-relaxed">
                {msg.text}
              </div>
              <div className={`text-[9px] font-bold uppercase tracking-widest opacity-30 mt-3 flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.role === 'model' && <Check className="w-3 h-3 text-teal-500" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-4 animate-fade-in">
             <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
               <Sparkles className="w-5 h-5" />
             </div>
             <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl flex gap-1.5 items-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={language === 'English' ? "Type a message..." : "एक संदेश लिखें..."} 
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-teal-400 transition-all font-medium text-slate-800" 
            />
            <button 
              onClick={handleVoiceInput} 
              disabled={isTranscribing}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'}`}
            >
              {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : permissionDenied ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping} 
            className="p-4 bg-teal-500 text-white rounded-2xl shadow-lg hover:bg-teal-600 disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-3 opacity-30">
          <AlertCircle className="w-3 h-3" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 text-center">
            Janaki provides health support. For emergencies, please call your doctor or CHC immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
