
import React, { useState, useEffect } from 'react';
import { generateDietPlan, generateMealImage } from '../services/geminiService';
import { HealthMetrics, DietDay, Language } from '../types';
import { Utensils, Loader2, RefreshCw, Apple, Image as ImageIcon, Sparkles, Wand2, Database, Activity, Droplet, Heart, TrendingUp, ChevronRight, Save, Thermometer, Zap, ShieldAlert, UserCheck } from 'lucide-react';

interface DietPlanProps {
  language: Language;
  metrics: HealthMetrics;
}

const DietPlan: React.FC<DietPlanProps> = ({ language, metrics }) => {
  const [plan, setPlan] = useState<DietDay[]>([]);
  const [mealImage, setMealImage] = useState<string>('');
  const [currentVisualisedMeal, setCurrentVisualisedMeal] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [preference, setPreference] = useState('Vegetarian');
  
  // Local state for editable metrics to allow the user to provide latest data for the diet plan
  const [localHb, setLocalHb] = useState(metrics.hemoglobin);
  const [localSystolic, setLocalSystolic] = useState(metrics.systolicBP);
  const [localDiastolic, setLocalDiastolic] = useState(metrics.diastolicBP);
  const [localSugar, setLocalSugar] = useState(metrics.bloodSugar);
  const [localHiv, setLocalHiv] = useState(metrics.hivStatus);
  const [localRh, setLocalRh] = useState(metrics.rhFactor);

  useEffect(() => {
    setLocalHb(metrics.hemoglobin);
    setLocalSystolic(metrics.systolicBP);
    setLocalDiastolic(metrics.diastolicBP);
    setLocalSugar(metrics.bloodSugar);
    setLocalHiv(metrics.hivStatus);
    setLocalRh(metrics.rhFactor);
  }, [metrics]);

  const getTranslations = (lang: Language) => {
    const en = {
      title: "AI Diet Planner",
      subtitle: `Personalized 7-day nutrition based on your health profile.`,
      generate: "Generate Custom Plan",
      generating: "Optimizing Nutrition...",
      preference: "Diet Preference",
      ready: "Ready to optimize your diet?",
      visual: "Meal Visualization",
      viewing: "Showing",
      predictionMode: "Clinical Sync Active",
      vitals: "Health Input Baseline",
      hb: "Hemoglobin",
      bp: "Blood Pressure",
      sugar: "Blood Sugar",
      hiv: "HIV Status",
      rh: "Rh Factor",
      normal: "Optimal",
      low: "Attention Needed",
      high: "High",
      weekLabel: "Gestational Week",
      inputPrompt: "Provide your latest readings for better accuracy:"
    };

    const hi = {
      title: "एआई आहार योजनाकार",
      subtitle: `आपके स्वास्थ्य प्रोफाइल पर आधारित व्यक्तिगत 7-दिवसीय पोषण।`,
      generate: "कस्टम योजना बनाएं",
      generating: "पोषण को अनुकूलित कर रहा है...",
      preference: "आहार प्राथमिकता",
      ready: "अपने आहार को बेहतर बनाने के लिए तैयार हैं?",
      visual: "भोजन का चित्रण",
      viewing: "दिखा रहा है",
      predictionMode: "क्लिनिकल सिंक सक्रिय",
      vitals: "स्वास्थ्य डेटा इनपुट",
      hb: "हीमोग्लोबिन",
      bp: "ब्लड प्रेशर",
      sugar: "ब्लड शुगर",
      hiv: "एचआईवी स्थिति",
      rh: "आरएच फैक्टर",
      normal: "इष्टतम",
      low: "ध्यान देने की आवश्यकता",
      high: "अधिक",
      weekLabel: "गर्भावस्था सप्ताह",
      inputPrompt: "बेहतर सटीकता के लिए अपनी नवीनतम रीडिंग प्रदान करें:"
    };

    const dict: Record<Language, any> = {
      English: en,
      Hindi: hi,
      Marathi: en,
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

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratingImage(true);
    
    // Create current metrics object based on user input
    const currentMetrics: HealthMetrics = {
      ...metrics,
      hemoglobin: localHb,
      systolicBP: localSystolic,
      diastolicBP: localDiastolic,
      bloodSugar: localSugar,
      hivStatus: localHiv,
      rhFactor: localRh
    };

    try {
      const result = await generateDietPlan(currentMetrics, preference, language);
      setPlan(result);
      if (result.length > 0) {
        const mealText = result[0].lunch;
        setCurrentVisualisedMeal(result[0].day + " Lunch");
        const img = await generateMealImage(`${preference} Indian healthy meal for pregnancy: ${mealText}`);
        setMealImage(img);
      }
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
      setGeneratingImage(false);
    }
  };

  const isHbLow = localHb < 11;
  const isBPHigh = localSystolic > 130 || localDiastolic > 85;
  const isSugarHigh = localSugar > 95;
  const isHivPositive = localHiv === 'Positive';

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-24 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-5">
                    <div className="p-4 bg-teal-900 text-white rounded-[2rem] shadow-2xl shadow-teal-900/20"><Utensils className="w-8 h-8" /></div>
                    {t.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-slate-500 font-medium text-lg">{t.subtitle}</p>
                  <div className="px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">{t.predictionMode}</span>
                  </div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button onClick={() => setPreference('Vegetarian')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${preference === 'Vegetarian' ? 'bg-white text-teal-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Veg</button>
                  <button onClick={() => setPreference('Non-Vegetarian')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${preference === 'Non-Vegetarian' ? 'bg-white text-rose-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Non-Veg</button>
              </div>
              <button 
                onClick={handleGenerate} 
                disabled={loading} 
                className="px-10 py-5 bg-teal-900 hover:bg-teal-800 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-teal-900/20 flex items-center justify-center gap-4 active:scale-95 transition-all group"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />}
                {loading ? t.generating : t.generate}
              </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Enhanced Editable Vitals Section - Matching Screenshot Aesthetic */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-teal-600" /> {t.vitals}
              </h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed text-right md:max-w-[250px]">
                {t.inputPrompt}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               {/* Hemoglobin Input Card */}
               <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isHbLow ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.hb}</p>
                      <p className={`text-[9px] font-black uppercase ${isHbLow ? 'text-rose-500' : 'text-emerald-500'}`}>{isHbLow ? t.low : t.normal}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-center relative">
                    <input 
                      type="number" 
                      step="0.1"
                      value={localHb}
                      onChange={(e) => setLocalHb(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-black text-2xl outline-none text-center" 
                    />
                    <span className="absolute right-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">G/DL</span>
                  </div>
               </div>

               {/* Blood Pressure Input Card */}
               <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isBPHigh ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.bp}</p>
                      <p className={`text-[9px] font-black uppercase ${isBPHigh ? 'text-rose-500' : 'text-emerald-500'}`}>{isBPHigh ? t.high : t.normal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex-1">
                      <input 
                        type="number"
                        value={localSystolic}
                        onChange={(e) => setLocalSystolic(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-black text-2xl outline-none text-center" 
                        placeholder="Sys"
                      />
                    </div>
                    <span className="text-slate-300 font-black text-xl">/</span>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex-1">
                      <input 
                        type="number"
                        value={localDiastolic}
                        onChange={(e) => setLocalDiastolic(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent font-black text-2xl outline-none text-center" 
                        placeholder="Dia"
                      />
                    </div>
                  </div>
               </div>

               {/* Blood Sugar Input Card */}
               <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSugarHigh ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.sugar}</p>
                      <p className={`text-[9px] font-black uppercase ${isSugarHigh ? 'text-rose-500' : 'text-emerald-500'}`}>{isSugarHigh ? t.high : t.normal}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-center relative">
                    <input 
                      type="number" 
                      value={localSugar}
                      onChange={(e) => setLocalSugar(parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent font-black text-2xl outline-none text-center" 
                    />
                    <span className="absolute right-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">MG/DL</span>
                  </div>
               </div>

               {/* HIV and Rh Quick Status Card */}
               <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t.hiv}</p>
                  </div>
                  <select 
                    value={localHiv} 
                    onChange={e => setLocalHiv(e.target.value as any)}
                    className={`w-full p-2 bg-white rounded-xl text-[10px] font-black uppercase border border-slate-100 ${isHivPositive ? 'text-rose-600' : 'text-slate-600'}`}
                  >
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center`}>
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t.rh}</p>
                  </div>
                  <select 
                    value={localRh} 
                    onChange={e => setLocalRh(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-xl text-[10px] font-black uppercase border border-slate-100 text-slate-600"
                  >
                    <option value="Rh+">Rh+</option>
                    <option value="Rh-">Rh-</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Plan Table Section */}
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
              {plan.length > 0 ? (
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                  <th className="p-8">Day</th>
                                  <th className="p-8">Breakfast</th>
                                  <th className="p-8">Lunch</th>
                                  <th className="p-8">Dinner</th>
                                  <th className="p-8 text-center">Calories</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {plan.map((day, idx) => (
                                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                      <td className="p-8 font-black text-slate-900">{day.day}</td>
                                      <td className="p-8 text-sm font-medium text-slate-600 leading-relaxed">{day.breakfast}</td>
                                      <td className="p-8 text-sm font-medium text-slate-600 leading-relaxed">{day.lunch}</td>
                                      <td className="p-8 text-sm font-medium text-slate-600 leading-relaxed">{day.dinner}</td>
                                      <td className="p-8 text-center">
                                        <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">{day.calories}</span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              ) : (
                  <div className="h-[500px] flex flex-col items-center justify-center p-20 text-center">
                     <div className="relative mb-8">
                       <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-2xl animate-pulse"></div>
                       {loading ? <Loader2 className="w-16 h-16 animate-spin text-teal-600 relative z-10" /> : <Utensils className="w-20 h-20 text-slate-200 relative z-10" />}
                     </div>
                     <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">{loading ? t.generating : t.ready}</h3>
                     <p className="text-slate-400 mt-4 max-w-xs mx-auto text-sm font-medium">Update your vitals above and click generate for a diet plan that manages your specific health conditions.</p>
                  </div>
              )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            {/* Visual Inspiration Card */}
            <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-all duration-700"></div>
                
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black tracking-tight">{t.visual}</h3>
                          <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">AI Generated Reference</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Wand2 className={`w-6 h-6 text-teal-400 ${generatingImage ? 'animate-spin' : ''}`} />
                        </div>
                    </div>

                    <div className="aspect-[4/5] bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-inner">
                        {mealImage ? (
                          <img src={mealImage} className="w-full h-full object-cover animate-fade-in" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-10">
                            <ImageIcon className="w-20 h-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Image Yet</p>
                          </div>
                        )}
                        {generatingImage && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
                            <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest animate-pulse">Painting Meal...</p>
                          </div>
                        )}
                    </div>
                    
                    {currentVisualisedMeal && (
                      <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                         <Apple className="w-5 h-5 text-teal-400" />
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none truncate">
                           {t.viewing}: <span className="text-white">{currentVisualisedMeal}</span>
                         </p>
                      </div>
                    )}
                </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-teal-50 p-8 rounded-[2.5rem] border border-teal-100 space-y-4">
               <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h4 className="text-sm font-black text-teal-900 uppercase tracking-widest">Clinical Nutrition Insight</h4>
               </div>
               <div className="space-y-3">
                 <div className="flex gap-3">
                    <div className={`w-1 h-auto rounded-full ${isHbLow ? 'bg-rose-500' : 'bg-teal-500'}`}></div>
                    <p className="text-xs text-teal-800 leading-relaxed font-bold">
                      {isHbLow 
                        ? "Low Hemoglobin detected. Your AI plan will be enriched with iron-heavy foods like jaggery and spinach." 
                        : "Healthy Hemoglobin maintained. Focusing on folate and vitamin-rich balance."
                      }
                    </p>
                 </div>
                 {isBPHigh && (
                   <div className="flex gap-3 pt-2 border-t border-teal-200">
                      <div className="w-1 h-auto rounded-full bg-rose-500"></div>
                      <p className="text-xs text-rose-800 leading-relaxed font-bold">
                        Elevated Blood Pressure. We are excluding high-sodium items and recommending potassium-rich foods.
                      </p>
                   </div>
                 )}
                 {isSugarHigh && (
                   <div className="flex gap-3 pt-2 border-t border-teal-200">
                      <div className="w-1 h-auto rounded-full bg-amber-500"></div>
                      <p className="text-xs text-amber-800 leading-relaxed font-bold">
                        High Blood Sugar detected. Providing low-glycemic, fiber-rich meals to stabilize glucose levels.
                      </p>
                   </div>
                 )}
                 {isHivPositive && (
                   <div className="flex gap-3 pt-2 border-t border-teal-200">
                      <div className="w-1 h-auto rounded-full bg-rose-500"></div>
                      <p className="text-xs text-rose-800 leading-relaxed font-bold">
                        HIV Positive management: Prioritizing nutrient-dense, high-protein options to support your immune system.
                      </p>
                   </div>
                 )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;