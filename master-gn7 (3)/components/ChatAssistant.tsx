import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, transcribeAudio } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2, Mic, StopCircle } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const ChatAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am your MASTER GN7 Maternal Health Assistant. How can I help you today? You can ask me about diet, symptoms, or general pregnancy care.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getChatResponse(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
        const audioBase64 = await stopRecording();
        if (audioBase64) {
            setIsTranscribing(true);
            const text = await transcribeAudio(audioBase64);
            setInput(text);
            setIsTranscribing(false);
        }
    } else {
        startRecording();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-teal-700 p-4 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-6 h-6" />
        </div>
        <div>
            <h2 className="font-semibold">Maternal Health AI Chatbot</h2>
            <p className="text-xs text-teal-200">Ask about symptoms, diet, or care</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 relative">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-xl transition-all ${
                isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600'
            }`}
            title={isRecording ? "Stop Recording" : "Speak"}
          >
            {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTranscribing ? "Processing audio..." : isRecording ? "Listening..." : "Type your question here..."}
            className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            disabled={isRecording || isTranscribing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isRecording}
            className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;