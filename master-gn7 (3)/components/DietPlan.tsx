import React, { useState } from 'react';
import { generateDietPlan } from '../services/geminiService';
import { HealthMetrics, DietDay } from '../types';
import { Utensils, Loader2, Leaf, Beef, FileSpreadsheet, Download, RefreshCw, Coffee, Sun, Moon, Apple } from 'lucide-react';

const DietPlan: React.FC = () => {
  const [plan, setPlan] = useState<DietDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState('Vegetarian');
  
  // Simplified metrics for Diet Plan generation
  const [metrics, setMetrics] = useState<HealthMetrics>({
    systolicBP: 120,
    diastolicBP: 80,
    bloodSugar: 95,
    hemoglobin: 11,
    weight: 65,
    age: 26,
    weekOfPregnancy: 20
  });

  const handleGenerate = async () => {
    setLoading(true);
    setPlan([]);
    try {
      const result = await generateDietPlan(metrics, preference);
      setPlan(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (plan.length === 0) return;
    
    const headers = ['Day', 'Breakfast', 'Lunch', 'Snack', 'Dinner', 'Calories'];
    const csvContent = [
      headers.join(','),
      ...plan.map(day => 
        [day.day, `"${day.breakfast}"`, `"${day.lunch}"`, `"${day.snack}"`, `"${day.dinner}"`, day.calories].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'weekly_diet_plan.csv';
    link.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6 max-w-7xl mx-auto w-full">
      {/* Configuration Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                        <Utensils className="w-6 h-6" />
                    </div>
                    AI Diet Planner
                </h2>
                <p className="text-slate-500 mt-1">
                    Generate a personalized 7-day nutrition plan based on your health metrics.
                </p>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
                 {plan.length > 0 && (
                    <button 
                        onClick={handleDownloadCSV}
                        className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                )}
                 <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 lg:flex-none justify-center px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-200 disabled:opacity-70 disabled:shadow-none flex items-center gap-2 transition-all transform active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                  {loading ? 'Generating...' : 'Generate Plan'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Diet Preference</label>
                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button
                    onClick={() => setPreference('Vegetarian')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${preference === 'Vegetarian' ? 'bg-white text-green-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                    <Leaf className="w-3.5 h-3.5" /> Vegetarian
                    </button>
                    <button
                    onClick={() => setPreference('Non-Vegetarian')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${preference === 'Non-Vegetarian' ? 'bg-white text-rose-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                    <Beef className="w-3.5 h-3.5" /> Non-Veg
                    </button>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Blood Sugar</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={metrics.bloodSugar}
                        onChange={(e) => setMetrics({...metrics, bloodSugar: Number(e.target.value)})}
                        className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mg/dL</span>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hemoglobin</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={metrics.hemoglobin}
                        onChange={(e) => setMetrics({...metrics, hemoglobin: Number(e.target.value)})}
                         className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">g/dL</span>
                </div>
             </div>
        </div>
      </div>

      {/* Excel-like Sheet Display */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-400"></div>
        
        <div className="flex-1 overflow-auto bg-slate-50/50">
            {plan.length > 0 ? (
                <div className="min-w-[1000px] h-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-200 shadow-sm">
                                <th className="p-5 font-bold text-slate-700 text-sm w-40 sticky left-0 bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                                    Day
                                </th>
                                <th className="p-5 font-semibold text-slate-600 text-sm border-r border-slate-100 min-w-[200px]">
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <Coffee className="w-4 h-4" /> Breakfast
                                    </div>
                                </th>
                                <th className="p-5 font-semibold text-slate-600 text-sm border-r border-slate-100 min-w-[200px]">
                                     <div className="flex items-center gap-2 text-yellow-500">
                                        <Sun className="w-4 h-4" /> Lunch
                                    </div>
                                </th>
                                <th className="p-5 font-semibold text-slate-600 text-sm border-r border-slate-100 min-w-[200px]">
                                     <div className="flex items-center gap-2 text-green-500">
                                        <Apple className="w-4 h-4" /> Snack
                                    </div>
                                </th>
                                <th className="p-5 font-semibold text-slate-600 text-sm border-r border-slate-100 min-w-[200px]">
                                    <div className="flex items-center gap-2 text-indigo-500">
                                        <Moon className="w-4 h-4" /> Dinner
                                    </div>
                                </th>
                                <th className="p-5 font-semibold text-slate-600 text-sm w-32">
                                     <div className="flex items-center gap-2 text-slate-500">
                                        <Utensils className="w-4 h-4" /> Calories
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {plan.map((day, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-5 text-slate-800 font-bold text-sm border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                                        {day.day}
                                    </td>
                                    <td className="p-5 text-slate-600 text-sm border-r border-slate-100 leading-relaxed">{day.breakfast}</td>
                                    <td className="p-5 text-slate-600 text-sm border-r border-slate-100 leading-relaxed">{day.lunch}</td>
                                    <td className="p-5 text-slate-600 text-sm border-r border-slate-100 leading-relaxed">{day.snack}</td>
                                    <td className="p-5 text-slate-600 text-sm border-r border-slate-100 leading-relaxed">{day.dinner}</td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                            {day.calories}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                    {loading ? (
                         <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-teal-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Utensils className="w-6 h-6 text-teal-500" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Generating Diet Plan</h3>
                                <p className="text-slate-500">Consulting AI nutritionist...</p>
                            </div>
                         </div>
                    ) : (
                        <div className="max-w-md space-y-4">
                            <div className="w-24 h-24 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform rotate-3">
                                <FileSpreadsheet className="w-12 h-12 text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Ready to plan your week?</h3>
                            <p className="text-slate-500 text-lg">
                                Configure your preferences above and click <span className="font-semibold text-teal-700">"Generate Plan"</span> to create a personalized, downloadable diet sheet tailored to your pregnancy needs.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DietPlan;