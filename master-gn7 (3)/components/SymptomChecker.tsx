import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { SymptomAnalysis } from '../types';
import { Stethoscope, Send, AlertCircle, Home, Phone, Loader2 } from 'lucide-react';

const SymptomChecker: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);

  const handleCheck = async () => {
    if (!symptomInput.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeSymptoms(symptomInput);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Immediate Emergency': return 'bg-red-50 border-red-200 text-red-800';
      case 'Consult Doctor': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Self-Care': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
      switch(severity) {
        case 'Immediate Emergency': return <Phone className="w-8 h-8 text-red-600" />;
        case 'Consult Doctor': return <Stethoscope className="w-8 h-8 text-amber-600" />;
        case 'Self-Care': return <Home className="w-8 h-8 text-green-600" />;
        default: return <AlertCircle className="w-8 h-8" />;
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-violet-100 text-violet-700 rounded-xl">
                <Stethoscope className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">AI Symptom Checker</h2>
                <p className="text-slate-500 text-sm">Describe your symptoms to check if you need urgent care.</p>
            </div>
        </div>

        <div className="space-y-4">
            <textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="E.g., I have a persistent headache and some swelling in my feet..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none transition-all text-slate-700"
            />
            <div className="flex justify-end">
                <button
                    onClick={handleCheck}
                    disabled={loading || !symptomInput.trim()}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold shadow-md shadow-violet-200 hover:bg-violet-700 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {loading ? 'Analyzing...' : 'Check Symptoms'}
                </button>
            </div>
        </div>
      </div>

      {analysis && (
        <div className={`rounded-2xl shadow-md border p-6 animate-fade-in ${getSeverityStyles(analysis.severity)}`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 p-4 bg-white/60 rounded-full">
                    {getSeverityIcon(analysis.severity)}
                </div>
                <div className="flex-1">
                    <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Assessment Result</span>
                        <h3 className="text-2xl font-bold">{analysis.severity}</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-white/50 p-4 rounded-xl">
                            <h4 className="font-semibold mb-2">Recommended Action</h4>
                            <p className="leading-relaxed">{analysis.actionRequired}</p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Possible Causes
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.possibleCauses.map((cause, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/60 border border-current rounded-full text-sm font-medium">
                                        {cause}
                                    </span>
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