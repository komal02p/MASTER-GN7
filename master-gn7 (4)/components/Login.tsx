
import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, HeartPulse, Globe, ChevronRight, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Language } from '../types.ts';
import { generateAppLogo } from '../services/geminiService.ts';

interface LoginProps {
  onLogin: (name: string, role: 'patient' | 'doctor' | 'asha') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, language, setLanguage }) => {
  const [role, setRole] = useState<'patient' | 'doctor' | 'asha'>('patient');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("https://img.icons8.com/ios-filled/100/14b8a6/mother-and-child.png");
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      const generated = await generateAppLogo();
      setLogoUrl(generated);
      setLogoLoading(false);
    };
    fetchLogo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onLogin(name, role);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Branding Section */}
      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col p-12 md:p-20 text-white">
        <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_80%_20%,#14b8a6_0%,transparent_50%)]"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col h-full">
           <div className="flex items-center gap-6 mb-16">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-2 border-teal-400/20 relative">
                  {logoLoading ? (
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                  ) : (
                    <img src={logoUrl} alt="MASTER GN7 AI Logo" className="w-full h-full object-cover rounded-full" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight leading-none uppercase">Master <span className="text-teal-400">GN7</span></h1>
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mt-2">Precision Antenatal AI</p>
              </div>
           </div>

           <div className="flex-1 flex flex-col justify-center space-y-10 max-w-xl">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">
                    <Sparkles className="w-4 h-4" /> Generative Branding Active
                 </div>
                 <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                    Safeguarding <span className="text-teal-400">Every</span> Heartbeat.
                 </h2>
                 <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                    A first-of-its-kind AI detection system for rural antenatal care, providing clinical precision through multi-modal diagnostics.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/5">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 border border-teal-400/20">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-snug">Secure &<br/>Private</p>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-400/20">
                       <HeartPulse className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-snug">Clinical<br/>Accuracy</p>
                 </div>
              </div>
           </div>

           <div className="pt-20 opacity-40 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              v2.5.0 Clinical Edition
              <div className="h-px flex-1 bg-white/10"></div>
           </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-[600px] bg-white p-12 md:p-24 flex flex-col justify-center relative">
        <div className="max-w-md mx-auto w-full space-y-12">
           <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Access Portal</h3>
              <p className="text-slate-500 font-medium">Select your role and enter your credentials to continue.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Role</label>
                 <div className="grid grid-cols-3 gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    {[
                      { id: 'patient', label: 'Patient', icon: User },
                      { id: 'doctor', label: 'Doctor', icon: ShieldCheck },
                      { id: 'asha', label: 'ASHA', icon: HeartPulse }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setRole(btn.id as any)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2 transition-all ${
                          role === btn.id ? 'bg-white text-teal-900 shadow-xl shadow-slate-200 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <btn.icon className="w-5 h-5" />
                        {btn.label}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                 <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                    <input 
                       type="text" 
                       value={name}
                       onChange={e => setName(e.target.value)}
                       placeholder="e.g. Priya Sharma" 
                       className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-teal-500 focus:ring-8 focus:ring-teal-500/5 transition-all font-black text-slate-800 placeholder:text-slate-300" 
                    />
                 </div>
              </div>

              <button 
                 type="submit" 
                 disabled={!name.trim() || loading}
                 className="w-full py-6 bg-teal-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-teal-900/20 hover:bg-teal-900/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98] transform group"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                 {loading ? 'Authenticating...' : 'Enter System'}
              </button>
           </form>

           <div className="pt-8 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-4 text-slate-400 hover:text-slate-800 cursor-pointer transition-colors">
                 <Globe className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>
              </div>
              <button onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">
                 Change
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
