
import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { SymptomAnalysis, Language } from '../types';
import { Stethoscope, Send, AlertCircle, Home, Phone, Loader2, Info, ChevronRight, Activity } from 'lucide-react';

interface SymptomCheckerProps {
  language: Language;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ language }) => {
  const [symptomInput, setSymptomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);

  const getTranslations = (lang: Language) => {
    const dict: Record<Language, any> = {
      English: {
        title: "Symptom Insight AI",
        subtitle: "Describe your clinical symptoms to receive AI-guided severity assessment.",
        placeholder: "E.g., persistent headache, localized swelling, or blurred vision...",
        check: "Analyze Symptoms",
        analyzing: "Processing Data...",
        result: "Clinical Evaluation",
        action: "Recommended Protocol",
        causes: "Potential Etiology",
        disclaimer: "AI evaluation is for screening only. Not a definitive diagnosis."
      },
      Hindi: {
        title: "लक्षण अंतर्दृष्टि एआई",
        subtitle: "एआई-निर्देशित गंभीरता मूल्यांकन प्राप्त करने के लिए अपने नैदानिक लक्षणों का वर्णन करें।",
        placeholder: "जैसे, लगातार सिरदर्द, सूजन, या धुंधली दृष्टि...",
        check: "लक्षणों का विश्लेषण करें",
        analyzing: "प्रसंस्करण डेटा...",
        result: "नैदानिक मूल्यांकन",
        action: "अनुशंसित प्रोटोकॉल",
        causes: "संभावित कारण",
        disclaimer: "एआई मूल्यांकन केवल स्क्रीनिंग के लिए है। निश्चित निदान नहीं है।"
      },
      Marathi: { title: "लक्षण विश्लेषण", check: "विश्लेषण करा", result: "मूल्यांकन" },
      Bengali: { title: "উপসর্গ বিশ্লেষণ", check: "বিশ্লেষণ করুন", result: "মূল্যায়ন" },
      Telugu: { title: "లక్షణ విశ్లేషణ", check: "విశ్లేషించు", result: "క్లినికల్ మూల్యాంకనం" },
      Tamil: { title: "அறிகுறி பகுப்பாய்வு", check: "பகுப்பாய்வு செய்", result: "மதிப்பீடு" },
      Gujarati: { title: "લક્ષણ વિશ્લેષણ", check: "વિશ્લેષણ કરો", result: "મૂલ્યાંકન" },
      Kannada: { title: "ಲಕ್ಷಣ ವಿಶ್ಲೇಷಣೆ", check: "ವಿಶ್ಲೇಷಿಸಿ", result: "ಮೌಲ್ಯಮಾಪನ" },
      Malayalam: { title: "ലക്ഷണ വിശകലനം", check: "വിശകലനം ചെയ്യുക", result: "വിലയിരുത്തൽ" },
      Punjabi: { title: "ਲੱਛਣ ਵਿਸ਼ਲੇਸ਼ਣ", check: "ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ", result: "ਮੁਲਾਂਕਣ" }
    };
    const base = dict.English;
    const target = dict[lang] || base;
    return { ...base, ...target };
  };

  const t = getTranslations(language);

  const handleCheck = async () => {
    if (!symptomInput.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeSymptoms(symptomInput, language);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Immediate Emergency': return 'bg-slate-950 text-white border-rose-500/50';
      case 'Consult Doctor': return 'bg-white text-slate-800 border-amber-200 shadow-xl';
      case 'Self-Care': return 'bg-white text-slate-800 border-emerald-200 shadow-xl';
      default: return 'bg-white text-slate-800 border-slate-100 shadow-xl';
    }
  };

  const getSeverityIcon = (severity: string) => {
      switch(severity) {
        case 'Immediate Emergency': return <div className="p-4 bg-rose-500 rounded-2xl shadow-lg shadow-rose-500/20 animate-pulse"><Phone className="w-10 h-10 text-white" /></div>;
        case 'Consult Doctor': return <div className="p-4 bg-amber-100 rounded-2xl"><Stethoscope className="w-10 h-10 text-amber-600" /></div>;
        case 'Self-Care': return <div className="p-4 bg-emerald-100 rounded-2xl"><Home className="w-10 h-10 text-emerald-600" /></div>;
        default: return <div className="p-4 bg-slate-100 rounded-2xl"><AlertCircle className="w-10 h-10 text-slate-400" /></div>;
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-0 opacity-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 mb-12">
            <div className="p-5 bg-teal-900 text-white rounded-[2rem] shadow-2xl shadow-teal-900/20">
                <Activity className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.title}</h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{t.subtitle}</p>
            </div>
        </div>

        <div className="relative z-10 space-y-8">
            <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block ml-2">Symptom Description</label>
                <textarea
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none resize-none transition-all text-slate-700 text-lg font-medium shadow-inner"
                />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-100/50 rounded-2xl text-slate-400">
                   <Info className="w-5 h-5" />
                   <p className="text-[10px] font-black uppercase tracking-widest">{t.disclaimer}</p>
                </div>
                <button
                    onClick={handleCheck}
                    disabled={loading || !symptomInput.trim()}
                    className="w-full md:w-auto px-12 py-5 bg-teal-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-teal-900/20 hover:bg-teal-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 transform active:scale-95 group"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    {loading ? t.analyzing : t.check}
                </button>
            </div>
        </div>
      </div>

      {analysis && (
        <div className={`rounded-[3rem] border-2 p-10 md:p-14 animate-fade-in transition-all duration-700 shadow-2xl ${getSeverityStyles(analysis.severity)}`}>
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-shrink-0">
                    {getSeverityIcon(analysis.severity)}
                </div>
                <div className="flex-1 space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-1 bg-current rounded-full opacity-20"></div>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{t.result}</span>
                        </div>
                        <h3 className="text-4xl font-black tracking-tight leading-none">{analysis.severity}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{t.action}</h4>
                            <div className={`p-8 rounded-[2rem] border transition-all ${analysis.severity === 'Immediate Emergency' ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-lg leading-relaxed font-bold italic">"{analysis.actionRequired}"</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{t.causes}</h4>
                            <div className="flex flex-wrap gap-3">
                                {analysis.possibleCauses.map((cause, i) => (
                                    <div key={i} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border transition-all hover:scale-105 ${analysis.severity === 'Immediate Emergency' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-100 shadow-sm text-slate-700'}`}>
                                        <ChevronRight className="w-4 h-4 text-teal-500" />
                                        {cause}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
