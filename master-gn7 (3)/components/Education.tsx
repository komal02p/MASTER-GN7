
import React, { useState, useEffect } from 'react';
import { getEducationalContent } from '../services/geminiService';
import { EducationalSource } from '../types';
import { Search, BookOpen, ExternalLink, Loader2, Lightbulb, ShieldCheck, HeartPulse, Salad, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const categories = [
  { id: 'nutrition', name: 'Nutrition', icon: Salad, query: 'Healthy diet and nutrition during pregnancy' },
  { id: 'safety', name: 'Warning Signs', icon: ShieldCheck, query: 'Emergency warning signs during pregnancy and when to see a doctor' },
  { id: 'exercise', name: 'Exercise', icon: HeartPulse, query: 'Safe exercises and physical activity during pregnancy' },
  { id: 'newborn', name: 'Newborn Care', icon: Lightbulb, query: 'Early newborn care and breastfeeding tips for new mothers' },
];

const Education: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [sources, setSources] = useState<EducationalSource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fetchContent = async (searchTerm: string) => {
    setLoading(true);
    const result = await getEducationalContent(searchTerm);
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

  // Default initial content
  useEffect(() => {
    if (!content) {
      fetchContent('General prenatal care tips for healthy pregnancy');
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Search */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
             <BookOpen className="w-8 h-8 text-teal-600" /> Education Hub
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Access reliable, AI-grounded medical information and tips for a healthy pregnancy.
          </p>

          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for topics (e.g., Anemia symptoms, morning sickness tips...)"
              className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-slate-700 shadow-inner"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat)}
            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center ${
              activeCategory === cat.id 
                ? 'bg-teal-600 border-teal-600 text-white shadow-lg scale-105' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-teal-200 hover:bg-teal-50/30'
            }`}
          >
            <cat.icon className={`w-8 h-8 ${activeCategory === cat.id ? 'text-white' : 'text-teal-600'}`} />
            <span className="font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Knowledge Article</h3>
              {loading && <Loader2 className="w-5 h-5 animate-spin text-teal-600" />}
            </div>
            <div className="p-8 prose prose-slate max-w-none">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  <div className="mt-8 space-y-2">
                    <div className="h-24 bg-slate-50 rounded-xl"></div>
                  </div>
                </div>
              ) : content ? (
                <div className="text-slate-700 leading-relaxed text-lg">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Search for a topic to see detailed information.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Sources */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-teal-600" /> Trusted Sources
            </h4>
            <div className="space-y-3">
              {sources.length > 0 ? (
                sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-slate-50 rounded-xl hover:bg-teal-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700 line-clamp-2">
                        {source.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 mt-1 flex-shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block mt-2">{source.uri}</span>
                  </a>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  {loading ? 'Searching for references...' : 'No references available for this query.'}
                </div>
              )}
            </div>
          </div>

          {/* Pregnancy Tip Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-teal-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                 <Lightbulb className="w-6 h-6" />
               </div>
               <h5 className="font-bold text-lg mb-2">Daily Tip</h5>
               <p className="text-teal-50 text-sm leading-relaxed">
                 Staying hydrated is crucial! Aim for 8-10 glasses of water daily to help form amniotic fluid and support increased blood volume.
               </p>
             </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
