
import React, { useState, useEffect } from 'react';
import { HealthMetrics, RiskAssessmentResult, AppNotification, MedicalHistory, AppView, Language } from '../types.ts';
import { analyzeRisk, extractMetricsFromAudio } from '../services/geminiService.ts';
import { useAudioRecorder } from '../hooks/useAudioRecorder.ts';
import { 
  AlertTriangle, CheckCircle, Loader2, Mic, StopCircle, Wand2, Activity, Shield, FileText, Save, AlertCircle, PhoneCall, History, Info, ChevronRight, Sparkles, RefreshCcw, Zap, MicOff, Droplet, UserCheck
} from 'lucide-react';

interface RiskAssessmentProps {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  changeView: (view: AppView) => void;
  consultDoctorWithReason?: (reason: string) => void;
  language: Language;
  metrics: HealthMetrics;
  history: MedicalHistory;
  onUpdateMetrics: (metrics: HealthMetrics) => void;
  onUpdateHistory: (history: MedicalHistory) => void;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ 
  addNotification, changeView, consultDoctorWithReason, language, 
  metrics, history, onUpdateMetrics, onUpdateHistory 
}) => {
  const [loading, setLoading] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [result, setResult] = useState<RiskAssessmentResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  
  const getTranslations = (lang: Language) => {
    const en = {
      title: "Risk Analysis AI",
      subtitle: "High-precision diagnostic tool for detecting antenatal complications.",
      vitals: "Physical Metrics",
      medHistory: "Clinical History",
      voice: "Voice Dictation",
      voiceDesc: "Speak your vitals and medical history. Our AI will automatically populate the fields.",
      analyze: "Perform AI Diagnosis",
      analyzing: "Scanning Health Profile...",
      result: "Diagnosis Result",
      reasoning: "Clinical Reasoning",
      rec: "Protocol Recommendations",
      save: "Archive Assessment",
      consult: "Clinical Tele-Consult",
      score: "Risk Index",
      recent: "Diagnostic Archive",
      clear: "Reset Fields",
      systolic: "Systolic BP",
      diastolic: "Diastolic BP",
      sugar: "Glucose (Fasting)",
      hb: "Hemoglobin",
      weight: "Weight (KG)",
      age: "Age",
      week: "Gestational Week",
      hiv: "HIV Status",
      rh: "Rh Factor",
      permError: "Microphone Blocked",
      notifTitle: "Analysis Complete",
      voiceSuccess: "AI Extraction Successful",
      voiceSuccessMsg: "Metrics updated from your voice input."
    };

    const hi = {
      title: "जोखिम विश्लेषण एआई",
      subtitle: "प्रसव पूर्व जटिलताओं का पता लगाने के लिए उच्च-सटीक नैदानिक उपकरण।",
      vitals: "शारीरिक मेट्रिक्स",
      medHistory: "नैदानिक इतिहास",
      voice: "वॉइस डिक्टेशन",
      voiceDesc: "अपने महत्वपूर्ण संकेत और चिकित्सा इतिहास बोलें। हमारा एआई स्वचालित रूप से विवरण भर देगा।",
      analyze: "एआई निदान करें",
      analyzing: "स्वास्थ्य प्रोफ़ाइल स्कैन कर रहा है...",
      result: "निदान परिणाम",
      reasoning: "नैदानिक तर्क",
      rec: "प्रोटोकॉल सिफारिशें",
      save: "आकलन आर्काइव करें",
      consult: "क्लिनिकल टेली-परामर्श",
      score: "जोखिम सूचकांक",
      recent: "नैदानिक आर्काइव",
      clear: "फ़ील्ड रीसेट करें",
      systolic: "सिस्टोलिक बीपी",
      diastolic: "डायस्टोलिक बीपी",
      sugar: "ग्लूकोज (खाली पेट)",
      hb: "हीमोग्लोबिन",
      weight: "वजन (किलो)",
      age: "आयु",
      week: "गर्भावस्था सप्ताह",
      hiv: "एचआईवी स्थिति",
      rh: "आरएच फैक्टर",
      permError: "माइक्रोफ़ोन अवरुद्ध",
      notifTitle: "विश्लेषण पूर्ण",
      voiceSuccess: "एआई निष्कर्षण सफल",
      voiceSuccessMsg: "आपके वॉइस इनपुट से मेट्रिक्स अपडेट किए गए।"
    };

    const mr = {
      title: "जोखिम विश्लेषण AI",
      subtitle: "प्रसूतीपूर्व गुंतागुंत शोधण्यासाठी उच्च-परिशुद्धता निदान साधन.",
      vitals: "शारीरिक मेट्रिक्स",
      medHistory: "वैद्यकीय इतिहास",
      voice: "आवाज डिक्टेशन",
      voiceDesc: "तुमचे महत्त्वाचे आकडे आणि वैद्यकीय इतिहास बोला. आमचे AI आपोआप फील्ड भरतील.",
      analyze: "AI निदान करा",
      analyzing: "आरोग्य प्रोफाइल स्कॅन करत आहे...",
      result: "निदान निकाल",
      reasoning: "वैद्यकीय तर्क",
      rec: "प्रोटोकॉल शिफारसी",
      save: "मूल्यांकन संग्रहित करा",
      consult: "वैद्यकीय टेली-सल्ला",
      score: "जोखीम निर्देशांक",
      recent: "निदान संग्रहण",
      clear: "फील्ड रिसेट करा",
      systolic: "सिस्टोलिक बीपी",
      diastolic: "डायस्टोलिक बीपी",
      sugar: "ग्लुकोज (उपाशी)",
      hb: "हिमोग्लोबिन",
      weight: "वजन (किलो)",
      age: "वय",
      week: "गर्भावस्थेचा आठवडा",
      hiv: "HIV स्थिती",
      rh: "Rh फॅक्टर",
      permError: "मायक्रोफोन ब्लॉक",
      notifTitle: "विश्लेषण पूर्ण",
      voiceSuccess: "AI माहिती मिळवणे यशस्वी",
      voiceSuccessMsg: "तुमच्या आवाजावरून आरोग्य माहिती अपडेट केली आहे."
    };

    const dict: Record<Language, any> = {
      English: en,
      Hindi: hi,
      Marathi: mr,
      Bengali: en,
      Telugu: en,
      Tamil: en,
      Gujarati: en,
      Kannada: en,
      Malayalam: en,
      Punjabi: en
    };

    return dict[lang] || en;
  };

  const t = getTranslations(language);
  const { isRecording, permissionDenied, startRecording, stopRecording } = useAudioRecorder();

  useEffect(() => {
    const saved = localStorage.getItem('master_gn7_risk_history');
    if (saved) setAssessmentHistory(JSON.parse(saved));
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeRisk(metrics, history, language);
      setResult(analysis);
      addNotification({
        title: t.notifTitle,
        message: `Status: ${analysis.riskLevel}. Score: ${analysis.riskScore}/100.`,
        type: analysis.riskLevel === 'Critical' || analysis.riskLevel === 'High Risk' ? 'critical' : 'info'
      });
    } catch (error) {
      console.error(error);
      addNotification({
        title: "Error",
        message: "Failed to perform AI analysis. Check your connection.",
        type: "warning"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setProcessingVoice(true);
      const audioBase64 = await stopRecording();
      if (audioBase64) {
        try {
          const extracted = await extractMetricsFromAudio(audioBase64);
          if (extracted.metrics) onUpdateMetrics({ ...metrics, ...extracted.metrics });
          if (extracted.history) onUpdateHistory({ ...history, ...extracted.history });
          addNotification({ 
            title: t.voiceSuccess, 
            message: t.voiceSuccessMsg, 
            type: 'success' 
          });
        } catch (e) { 
          console.error("Extraction failed", e);
          addNotification({ 
            title: "Voice Error", 
            message: "AI could not process the voice data correctly.", 
            type: 'warning' 
          });
        }
      }
      setProcessingVoice(false);
    } else { startRecording(); }
  };

  const saveAssessment = () => {
    if (!result) return;
    const item = { timestamp: new Date().toISOString(), metrics, result };
    const newHistory = [item, ...assessmentHistory].slice(0, 10);
    setAssessmentHistory(newHistory);
    localStorage.setItem('master_gn7_risk_history', JSON.stringify(newHistory));
    addNotification({ title: 'Assessment Saved', message: 'Results archived for medical records.', type: 'success' });
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'High Risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Moderate Risk': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const handleClear = () => {
    onUpdateMetrics({
      systolicBP: 120,
      diastolicBP: 80,
      bloodSugar: 95,
      hemoglobin: 11.5,
      weight: 60,
      age: 25,
      weekOfPregnancy: 12,
      hivStatus: 'Negative',
      rhFactor: 'Rh+'
    });
    onUpdateHistory({
      conditions: '',
      surgeries: '',
      allergies: ''
    });
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-40"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-teal-900 text-white rounded-2xl shadow-xl"><Shield className="w-8 h-8" /></div>
            {t.title}
          </h2>
          <p className="text-slate-500 mt-3 text-lg font-medium max-w-xl">{t.subtitle}</p>
        </div>
        <div className="flex gap-3 relative z-10">
             <button onClick={handleClear} className="px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" /> {t.clear}
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group transition-all duration-500 ${permissionDenied ? 'bg-rose-950' : 'bg-slate-950'}`}>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
               <button onClick={handleVoiceInput} disabled={processingVoice}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${permissionDenied ? 'bg-rose-900' : isRecording ? 'bg-rose-500 ring-8 ring-rose-500/20' : 'bg-teal-500 hover:bg-teal-400 ring-8 ring-white/5'}`}>
                 {processingVoice ? <Loader2 className="w-10 h-10 animate-spin" /> : permissionDenied ? <MicOff className="w-10 h-10 text-rose-500" /> : isRecording ? <StopCircle className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
               </button>
               <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-black mb-1 flex items-center justify-center md:justify-start gap-2">
                    {permissionDenied ? t.permError : t.voice} {!permissionDenied && <Sparkles className="w-4 h-4 text-teal-400" />}
                  </h3>
                  <p className="text-teal-100/60 text-sm font-medium">{permissionDenied ? "Microphone access is blocked." : t.voiceDesc}</p>
               </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-10">
            <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Activity className="w-4 h-4 text-teal-600" /> {t.vitals}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { key: 'systolicBP', label: t.systolic, unit: 'mmHg' },
                        { key: 'diastolicBP', label: t.diastolic, unit: 'mmHg' },
                        { key: 'bloodSugar', label: t.sugar, unit: 'mg/dL' },
                        { key: 'hemoglobin', label: t.hb, unit: 'g/dL' },
                        { key: 'weight', label: t.weight, unit: 'KG' },
                        { key: 'age', label: t.age, unit: 'Yrs' },
                        { key: 'weekOfPregnancy', label: t.week, unit: 'Wk' }
                    ].map((f) => (
                        <div key={f.key} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                            <input type="number" value={(metrics as any)[f.key]} onChange={e => onUpdateMetrics({...metrics, [f.key]: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none pr-12" />
                        </div>
                    ))}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.hiv}</label>
                        <select value={metrics.hivStatus} onChange={e => onUpdateMetrics({...metrics, hivStatus: e.target.value as any})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none">
                            <option value="Negative">Negative</option>
                            <option value="Positive">Positive</option>
                            <option value="Unknown">Unknown</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.rh}</label>
                        <select value={metrics.rhFactor} onChange={e => onUpdateMetrics({...metrics, rhFactor: e.target.value as any})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none">
                            <option value="Rh+">Rh+</option>
                            <option value="Rh-">Rh-</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" /> {t.medHistory}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['conditions', 'surgeries', 'allergies'].map((k) => (
                        <div key={k} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 capitalize">{k}</label>
                            <textarea value={(history as any)[k]} onChange={e => onUpdateHistory({...history, [k]: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-medium h-24 outline-none resize-none" placeholder={`Enter ${k}...`} />
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleAnalyze} disabled={loading} className="w-full py-6 bg-teal-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-teal-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                {loading ? t.analyzing : t.analyze}
            </button>
          </div>
        </div>

        <div className="space-y-8">
            {result ? (
                <div className={`p-10 rounded-[3rem] border-2 shadow-2xl animate-fade-in relative overflow-hidden ${getRiskColor(result.riskLevel)}`}>
                    <div className="relative z-10 space-y-8">
                        <div>
                           <h3 className="text-4xl font-black tracking-tight leading-none mb-4">{result.riskLevel}</h3>
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 rounded-full text-sm font-black">{t.score}: {result.riskScore}/100</div>
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t.reasoning}</h4>
                           <p className="text-lg leading-relaxed font-bold italic">"{result.reasoning}"</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                            <button onClick={saveAssessment} className="w-full py-4 bg-white text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-3"><Save className="w-5 h-5" /> {t.save}</button>
                            {(result.riskLevel === 'High Risk' || result.riskLevel === 'Critical') && (
                                <button onClick={() => consultDoctorWithReason?.(`${result.riskLevel}: ${result.reasoning}`)} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 animate-bounce mt-2"><PhoneCall className="w-5 h-5" /> {t.consult}</button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{t.recent}</h3>
                    <div className="space-y-4">
                        {assessmentHistory.length === 0 ? <p className="text-center opacity-30 text-xs font-black">No diagnostics recorded</p> : assessmentHistory.map((item, idx) => (
                            <div key={idx} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-teal-500 transition-all">
                                <div><p className="text-[10px] font-black text-slate-400 mb-1">{new Date(item.timestamp).toLocaleDateString()}</p><p className="text-sm font-black text-slate-800">{item.result.riskLevel}</p></div>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${item.result.riskLevel === 'Critical' ? 'bg-rose-500' : 'bg-teal-500'}`}><ChevronRight className="w-5 h-5" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;