
import React, { useState, useEffect } from 'react';
import { getEducationalContent } from '../services/geminiService';
import { EducationalSource, Language } from '../types';
import { Search, BookOpen, ExternalLink, Loader2, Lightbulb, ShieldCheck, HeartPulse, Salad, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EducationProps {
  language: Language;
}

const Education: React.FC<EducationProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [sources, setSources] = useState<EducationalSource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const en = {
    title: "Education Hub",
    subtitle: "Access reliable, AI-grounded medical information and tips for a healthy pregnancy.",
    placeholder: "Search for topics (e.g., Anemia symptoms...)",
    search: "Search",
    article: "Knowledge Article",
    trusted: "Trusted Sources",
    dailyTip: "Daily Tip",
    tipContent: "Staying hydrated is crucial! Aim for 8-10 glasses of water daily.",
    noRef: "No references available.",
    nutrition: "Nutrition",
    safety: "Warning Signs",
    exercise: "Exercise",
    newborn: "Newborn Care"
  };

  const hi = {
    title: "शिक्षा केंद्र",
    subtitle: "स्वस्थ गर्भावस्था के लिए विश्वसनीय, एआई-आधारित चिकित्सा जानकारी और सुझाव प्राप्त करें।",
    placeholder: "विषय खोजें (जैसे, एनीमिया के लक्षण...)",
    search: "खोजें",
    article: "ज्ञान लेख",
    trusted: "विश्वसनीय स्रोत",
    dailyTip: "आज का सुझाव",
    tipContent: "हाइड्रेटेड रहना बहुत जरूरी है! रोजाना 8-10 गिलास पानी पीने का लक्ष्य रखें।",
    noRef: "कोई संदर्भ उपलब्ध नहीं है।",
    nutrition: "पोषण",
    safety: "चेतावनी संकेत",
    exercise: "व्यायाम",
    newborn: "नवजात की देखभाल"
  };

  // Fixed the missing properties from type 'Record<Language, any>'
  const translations: Record<Language, any> = {
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

  const t = translations[language] || translations.English;

  const categories = [
    { id: 'nutrition', name: t.nutrition, icon: Salad, query: 'Healthy diet and nutrition during pregnancy' },
    { id: 'safety', name: t.safety, icon: ShieldCheck, query: 'Emergency warning signs during pregnancy' },
    { id: 'exercise', name: t.exercise, icon: HeartPulse, query: 'Safe exercises during pregnancy' },
    { id: 'newborn', name: t.newborn, icon: Lightbulb, query: 'Newborn care and breastfeeding tips' },
  ];

  const fetchContent = async (searchTerm: string) => {
    setLoading(true);
    const result = await getEducationalContent(searchTerm, language);
    setContent(result.text);
    setSources(result.sources);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActiveCategory(null);
    fetchContent(query);
  };

  const selectCategory = (cat: typeof categories[0]) => {
    setActiveCategory(cat.id);
    fetchContent(cat.query);
  };

  useEffect(() => {
    if (!content) {
      fetchContent('General prenatal care tips for healthy pregnancy');
    }
  }, [language]);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
             <BookOpen className="w-8 h-8 text-teal-600" /> {t.title}
          </h2>
          <p className="text-slate-500 text-lg mb-8">{t.subtitle}</p>
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.placeholder} className="w-full pl-12 pr-32 py-4 bg-slate-50 border rounded-2xl outline-none" />
            <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.search}
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => selectCategory(cat)} className={`p-6 rounded-2xl border flex flex-col items-center gap-3 text-center transition-all ${activeCategory === cat.id ? 'bg-teal-600 text-white scale-105' : 'bg-white text-slate-600'}`}>
            <cat.icon className={`w-8 h-8 ${activeCategory === cat.id ? 'text-white' : 'text-teal-600'}`} />
            <span className="font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{t.article}</h3>
            </div>
            <div className="p-8 prose prose-slate max-w-none">
              {loading ? <div className="space-y-4 animate-pulse"><div className="h-4 bg-slate-100 rounded w-3/4"></div><div className="h-4 bg-slate-100 rounded w-full"></div></div> : content ? <div className="text-slate-700 text-lg"><ReactMarkdown>{content}</ReactMarkdown></div> : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-teal-600" /> {t.trusted}</h4>
            <div className="space-y-3">
              {sources.length > 0 ? sources.map((source, i) => (
                <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-50 rounded-xl hover:bg-teal-50">
                  <span className="text-sm font-semibold text-slate-700 line-clamp-2">{source.title}</span>
                </a>
              )) : <div className="text-center py-8 text-slate-400 text-sm">{t.noRef}</div>}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-teal-600 p-8 rounded-3xl text-white">
             <Lightbulb className="w-6 h-6 mb-4" />
             <h5 className="font-bold text-lg mb-2">{t.dailyTip}</h5>
             <p className="text-teal-50 text-sm">{t.tipContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
