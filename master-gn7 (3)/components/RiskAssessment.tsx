
import React, { useState, useEffect } from 'react';
import { HealthMetrics, RiskAssessmentResult, AppNotification, MedicalHistory } from '../types.ts';
import { analyzeRisk, extractMetricsFromAudio } from '../services/geminiService.ts';
import { useAudioRecorder } from '../hooks/useAudioRecorder.ts';
import { AlertTriangle, CheckCircle, Loader2, Mic, StopCircle, Wand2, Activity, Shield, FileText, Save, Trash2, AlertCircle } from 'lucide-react';

interface RiskAssessmentProps {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ addNotification }) => {
  const [loading, setLoading] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [result, setResult] = useState<RiskAssessmentResult | null>(null);
  
  // Vitals State
  const [metrics, setMetrics] = useState<HealthMetrics>({
    systolicBP: 120,
    diastolicBP: 80,
    bloodSugar: 90,
    hemoglobin: 11.5,
    weight: 65,
    age: 28,
    weekOfPregnancy: 24,
  });

  // Medical History State
  const [history, setHistory] = useState<MedicalHistory>({
    conditions: '',
    surgeries: '',
    allergies: ''
  });

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('master_gn7_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history from local storage");
      }
    }
  }, []);

  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [errors, setErrors] = useState<Partial<Record<keyof HealthMetrics, string>>>({});

  const validationRules: Record<keyof HealthMetrics, { min: number; max: number; label: string }> = {
    systolicBP: { min: 50, max: 250, label: "Systolic BP" },
    diastolicBP: { min: 30, max: 150, label: "Diastolic BP" },
    bloodSugar: { min: 30, max: 500, label: "Blood Sugar" },
    hemoglobin: { min: 5, max: 25, label: "Hemoglobin" },
    weight: { min: 30, max: 300, label: "Weight" },
    age: { min: 10, max: 60, label: "Age" },
    weekOfPregnancy: { min: 1, max: 42, label: "Pregnancy Week" },
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof HealthMetrics, string>> = {};
    let isValid = true;

    (Object.keys(validationRules) as Array<keyof HealthMetrics>).forEach((key) => {
      const value = metrics[key];
      const rule = validationRules[key];
      if (value < rule.min || value > rule.max) {
        newErrors[key] = `${rule.label} must be between ${rule.min} and ${rule.max}`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setMetrics(prev => ({
      ...prev,
      [name]: numValue
    }));

    if (errors[name as keyof HealthMetrics]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleHistoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newHistory = { ...history, [name]: value };
    setHistory(newHistory);
    // Auto-save to local storage
    localStorage.setItem('master_gn7_history', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the stored medical history?")) {
        setHistory({ conditions: '', surgeries: '', allergies: '' });
        localStorage.removeItem('master_gn7_history');
        addNotification({
            title: 'History Cleared',
            message: 'Medical history fields have been reset.',
            type: 'info'
        });
    }
  };

  const handleDictate = async () => {
    if (isRecording) {
        setProcessingVoice(true);
        try {
            const audioBase64 = await stopRecording();
            if (audioBase64) {
                // Now extracts both metrics and history
                const { metrics: extractedMetrics, history: extractedHistory } = await extractMetricsFromAudio(audioBase64);
                
                let filledCount = 0;
                let messages = [];

                // Update Metrics
                if (extractedMetrics && Object.keys(extractedMetrics).length > 0) {
                    setMetrics(prev => ({ ...prev, ...extractedMetrics }));
                    filledCount += Object.keys(extractedMetrics).length;
                    messages.push("Vitals updated");
                }

                // Update History
                if (extractedHistory && Object.keys(extractedHistory).length > 0) {
                     setHistory(prev => {
                        const newHistory = { ...prev };
                        if (extractedHistory.conditions) newHistory.conditions = extractedHistory.conditions;
                        if (extractedHistory.surgeries) newHistory.surgeries = extractedHistory.surgeries;
                        if (extractedHistory.allergies) newHistory.allergies = extractedHistory.allergies;
                        
                        // Sync with local storage
                        localStorage.setItem('master_gn7_history', JSON.stringify(newHistory));
                        return newHistory;
                     });
                     
                     // Count only non-empty extracted fields
                     const historyFieldsFound = Object.keys(extractedHistory).filter(k => (extractedHistory as any)[k]).length;
                     if (historyFieldsFound > 0) {
                        filledCount += historyFieldsFound;
                        messages.push("Medical history updated");
                     }
                }

                if (filledCount > 0) {
                    addNotification({
                        title: 'Auto-Fill Successful',
                        message: `${messages.join(' & ')}. (${filledCount} fields total)`,
                        type: 'success'
                    });
                } else {
                    addNotification({
                        title: 'Extraction Failed',
                        message: 'Could not identify clear medical data in audio. Please try speaking clearly.',
                        type: 'warning'
                    });
                }
            }
        } catch (error) {
            console.error(error);
            addNotification({
                title: 'Voice Processing Error',
                message: 'Failed to process audio. Please try again.',
                type: 'warning'
            });
        }
        setProcessingVoice(false);
    } else {
        startRecording();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setResult(null);
    try {
      // Pass both vitals and history to the analysis service
      const analysis = await analyzeRisk(metrics, history);
      setResult(analysis);

      if (analysis.riskLevel === 'Critical' || analysis.riskLevel === 'High Risk') {
        addNotification({
            title: 'Critical Health Alert',
            message: `High risk detected (${analysis.riskLevel}). Immediate attention required.`,
            type: 'critical'
        });
      } else if (analysis.riskLevel === 'Moderate Risk') {
        addNotification({
            title: 'Health Warning',
            message: 'Some values are borderline. Please review recommendations.',
            type: 'warning'
        });
      } else {
        addNotification({
            title: 'Health Check Complete',
            message: 'Vitals are within normal range.',
            type: 'success'
        });
      }

    } catch (error) {
      console.error(error);
      addNotification({
        title: 'Analysis Failed',
        message: 'Could not complete risk analysis. Please try again.',
        type: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const baseInputClass = "w-full p-3 bg-slate-50 border text-slate-900 rounded-lg outline-none transition-all duration-200";

  const getInputClass = (fieldName: keyof HealthMetrics) => {
    const hasError = !!errors[fieldName];
    return `${baseInputClass} ${
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/50' 
        : 'border-slate-300 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20'
    }`;
  };

  const getRiskColor = (level: string) => {
      switch(level) {
          case 'Low Risk': return 'text-green-600 bg-green-50 border-green-200';
          case 'Moderate Risk': return 'text-amber-600 bg-amber-50 border-amber-200';
          case 'High Risk': return 'text-orange-600 bg-orange-50 border-orange-200';
          case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
          default: return 'text-slate-600 bg-slate-50 border-slate-200';
      }
  };

  const getRiskBarColor = (score: number) => {
      if (score < 30) return 'bg-green-500';
      if (score < 60) return 'bg-amber-500';
      if (score < 85) return 'bg-orange-500';
      return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
             <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Advanced Risk Prediction</h2>
                <p className="text-slate-500">
                AI-driven analysis for early detection of Preeclampsia, GDM, and Anemia.
                </p>
             </div>
             <button
                type="button"
                onClick={handleDictate}
                disabled={processingVoice}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all shadow-md transform active:scale-95 ${
                    isRecording 
                        ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse ring-4 ring-rose-200' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
             >
                {processingVoice ? (
                    <>
                         <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                ) : isRecording ? (
                    <>
                        <StopCircle className="w-5 h-5" /> Stop & Auto-Fill
                    </>
                ) : (
                    <>
                        <Mic className="w-5 h-5" /> Dictate Vitals & History
                    </>
                )}
             </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Medical History Section */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative group">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-600" />
                        Patient Medical History
                    </h3>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium bg-white px-2 py-1 rounded-full border border-slate-100">
                            <Save className="w-3 h-3" /> Auto-saved
                        </span>
                        <button 
                            type="button"
                            onClick={handleClearHistory}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Clear History"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Pre-existing Conditions
                        </label>
                        <textarea
                            name="conditions"
                            value={history.conditions}
                            onChange={handleHistoryChange}
                            placeholder="Diabetes, Hypertension..."
                            className="w-full text-sm text-slate-700 outline-none h-20 resize-none placeholder:text-slate-300"
                        />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Previous Surgeries
                        </label>
                        <textarea
                            name="surgeries"
                            value={history.surgeries}
                            onChange={handleHistoryChange}
                            placeholder="C-Section, Appendectomy..."
                            className="w-full text-sm text-slate-700 outline-none h-20 resize-none placeholder:text-slate-300"
                        />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Allergies
                        </label>
                        <textarea
                            name="allergies"
                            value={history.allergies}
                            onChange={handleHistoryChange}
                            placeholder="Penicillin, Peanuts, Latex..."
                            className="w-full text-sm text-slate-700 outline-none h-20 resize-none placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Systolic BP (mmHg)</label>
                <input
                type="number"
                name="systolicBP"
                value={metrics.systolicBP || ''}
                onChange={handleInputChange}
                className={getInputClass('systolicBP')}
                required
                />
                {errors.systolicBP && <p className="text-xs text-red-500 mt-1">{errors.systolicBP}</p>}
            </div>
            
            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Diastolic BP (mmHg)</label>
                <input
                type="number"
                name="diastolicBP"
                value={metrics.diastolicBP || ''}
                onChange={handleInputChange}
                className={getInputClass('diastolicBP')}
                required
                />
                {errors.diastolicBP && <p className="text-xs text-red-500 mt-1">{errors.diastolicBP}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Blood Sugar (mg/dL)</label>
                <input
                type="number"
                name="bloodSugar"
                value={metrics.bloodSugar || ''}
                onChange={handleInputChange}
                className={getInputClass('bloodSugar')}
                required
                />
                {errors.bloodSugar && <p className="text-xs text-red-500 mt-1">{errors.bloodSugar}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Hemoglobin (g/dL)</label>
                <input
                type="number"
                step="0.1"
                name="hemoglobin"
                value={metrics.hemoglobin || ''}
                onChange={handleInputChange}
                className={getInputClass('hemoglobin')}
                required
                />
                {errors.hemoglobin && <p className="text-xs text-red-500 mt-1">{errors.hemoglobin}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Week of Pregnancy</label>
                <input
                type="number"
                name="weekOfPregnancy"
                value={metrics.weekOfPregnancy || ''}
                onChange={handleInputChange}
                className={getInputClass('weekOfPregnancy')}
                required
                />
                {errors.weekOfPregnancy && <p className="text-xs text-red-500 mt-1">{errors.weekOfPregnancy}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Age</label>
                <input
                type="number"
                name="age"
                value={metrics.age || ''}
                onChange={handleInputChange}
                className={getInputClass('age')}
                required
                />
                {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || isRecording}
              className="w-full md:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Analyzing Vitals...
                </>
              ) : (
                <>
                    <Wand2 className="w-5 h-5" /> Run Risk Assessment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className={`rounded-2xl shadow-sm p-6 border animate-fade-in ${getRiskColor(result.riskLevel)}`}>
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Risk Summary Column */}
            <div className="md:w-1/3 flex flex-col items-center justify-center text-center p-4 bg-white/60 rounded-xl">
                 <div className="mb-3">
                    {result.riskLevel === 'Low Risk' ? <CheckCircle className="w-12 h-12 text-green-600" /> : <AlertTriangle className="w-12 h-12 text-current" />}
                 </div>
                 <h3 className="text-2xl font-bold mb-1">{result.riskLevel}</h3>
                 <p className="text-sm font-medium opacity-80 mb-4">Risk Score: {result.riskScore}/100</p>
                 
                 {/* Risk Meter */}
                 <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                     <div 
                        className={`h-full ${getRiskBarColor(result.riskScore)} transition-all duration-1000`} 
                        style={{ width: `${result.riskScore}%` }}
                     ></div>
                 </div>
                 
                 <div className="flex flex-wrap gap-2 justify-center mt-4">
                     {result.potentialConditions.map((cond, i) => (
                         <span key={i} className="px-2 py-1 bg-white border border-current rounded text-xs font-bold uppercase opacity-80">
                             {cond}
                         </span>
                     ))}
                 </div>
            </div>

            {/* Analysis Details Column */}
            <div className="md:w-2/3">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                   <Activity className="w-5 h-5" /> Clinical Reasoning
              </h4>
              <p className="text-slate-700 mb-6 leading-relaxed bg-white/50 p-4 rounded-lg">{result.reasoning}</p>
              
              <div className="bg-white/80 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" /> Recommended Actions
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm p-2 hover:bg-slate-50 rounded transition-colors">
                      <div className="mt-1 w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                      </div>
                      <span className="mt-0.5">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
