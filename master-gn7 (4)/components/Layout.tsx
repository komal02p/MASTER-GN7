
import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, Calendar, FileText, PieChart, Menu, X, HeartPulse, Bell, Check, Stethoscope, Pill, BookOpen, PhoneCall, Globe, ChevronDown, Sparkles, Trash2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { AppView, AppNotification, Language, UserProfile } from '../types.ts';
import { requestNotificationPermission } from '../services/notificationService.ts';
import { generateAppLogo } from '../services/geminiService.ts';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  userProfile: UserProfile;
}

const LANGUAGES_DATA: { id: Language; label: string; logo: string; color: string }[] = [
  { id: 'English', label: 'English', logo: 'EN', color: 'bg-indigo-500' },
  { id: 'Hindi', label: 'हिन्दी', logo: 'HI', color: 'bg-orange-500' },
  { id: 'Marathi', label: 'मराठी', logo: 'MR', color: 'bg-red-500' },
  { id: 'Bengali', label: 'বাংলা', logo: 'BN', color: 'bg-yellow-600' },
  { id: 'Telugu', label: 'తెలుగు', logo: 'TE', color: 'bg-blue-500' },
  { id: 'Tamil', label: 'தமிழ்', logo: 'TA', color: 'bg-teal-600' },
  { id: 'Gujarati', label: 'ગુજરાતી', logo: 'GU', color: 'bg-pink-500' },
  { id: 'Kannada', label: 'ಕನ್ನಡ', logo: 'KN', color: 'bg-green-600' },
  { id: 'Malayalam', label: 'മലയാളം', logo: 'ML', color: 'bg-emerald-600' },
  { id: 'Punjabi', label: 'ਪੰਜਾਬੀ', logo: 'PA', color: 'bg-rose-500' },
];

const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  setCurrentView, 
  children, 
  notifications, 
  markAsRead, 
  markAllAsRead,
  language,
  setLanguage,
  userProfile
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("https://img.icons8.com/ios-filled/100/14b8a6/mother-and-child.png");
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    requestNotificationPermission();
    const fetchLogo = async () => {
      const generated = await generateAppLogo();
      setLogoUrl(generated);
      setLogoLoading(false);
    };
    fetchLogo();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentLangObj = LANGUAGES_DATA.find(l => l.id === language) || LANGUAGES_DATA[0];

  const getLabel = (view: AppView) => {
    const labels: Record<Language, any> = {
      English: {
        [AppView.DASHBOARD]: 'Overview',
        [AppView.RISK_ASSESSMENT]: 'Risk Tracker',
        [AppView.CALL_SCHEDULER]: 'Tele-Consult',
        [AppView.EDUCATION]: 'Health Hub',
        [AppView.MEDICATION_TRACKER]: 'Pill Box',
        [AppView.DIET_PLAN]: 'Diet Plan',
        [AppView.CHATBOT]: 'Assistant',
        [AppView.APPOINTMENTS]: 'Visits',
        [AppView.REPORTS]: 'Analytics',
      },
      Hindi: {
        [AppView.DASHBOARD]: 'अवलोकन',
        [AppView.RISK_ASSESSMENT]: 'जोखिम जांच',
        [AppView.CALL_SCHEDULER]: 'टेली-परामर्श',
        [AppView.EDUCATION]: 'स्वास्थ्य केंद्र',
        [AppView.MEDICATION_TRACKER]: 'दवाएं',
        [AppView.DIET_PLAN]: 'आहार योजना',
        [AppView.CHATBOT]: 'सहायक',
        [AppView.APPOINTMENTS]: 'नियुक्ति',
        [AppView.REPORTS]: 'एनालिटिक्स',
      },
      Marathi: {
        [AppView.DASHBOARD]: 'आढावा',
        [AppView.RISK_ASSESSMENT]: 'जोखीम तपासणी',
        [AppView.CALL_SCHEDULER]: 'टेली-सल्ला',
        [AppView.EDUCATION]: 'आरोग्य केंद्र',
        [AppView.MEDICATION_TRACKER]: 'औषध पेटी',
        [AppView.DIET_PLAN]: 'आहार योजना',
        [AppView.CHATBOT]: 'सहायक',
        [AppView.APPOINTMENTS]: 'भेटी',
        [AppView.REPORTS]: 'विश्लेषण',
      },
      Bengali: {
        [AppView.DASHBOARD]: 'ওভারভিউ',
        [AppView.RISK_ASSESSMENT]: 'ঝুঁকি ট্র্যাকার',
        [AppView.CALL_SCHEDULER]: 'টেলি-পরামর্শ',
        [AppView.EDUCATION]: 'স্বাস্থ্য কেন্দ্র',
        [AppView.MEDICATION_TRACKER]: 'ওষুধের বক্স',
        [AppView.DIET_PLAN]: 'ডায়েট প্ল্যান',
        [AppView.CHATBOT]: 'সহকারী',
        [AppView.APPOINTMENTS]: 'সাক্ষাৎ',
        [AppView.REPORTS]: 'বিশ্লেষণ',
      },
      Telugu: {
        [AppView.DASHBOARD]: 'అవలోకనం',
        [AppView.RISK_ASSESSMENT]: 'రిస్క్ ట్రాకర్',
        [AppView.CALL_SCHEDULER]: 'టెలీ-కన్సల్ట్',
        [AppView.EDUCATION]: 'ఆరోగ్య కేంద్రం',
        [AppView.MEDICATION_TRACKER]: 'మందుల పెట్టె',
        [AppView.DIET_PLAN]: 'ఆహార ప్రణాళిక',
        [AppView.CHATBOT]: 'సహాయకుడు',
        [AppView.APPOINTMENTS]: 'నియామకాలు',
        [AppView.REPORTS]: 'విశ్లేషణలు',
      },
      Tamil: {
        [AppView.DASHBOARD]: 'கண்ணோட்டம்',
        [AppView.RISK_ASSESSMENT]: 'ஆபத்து கண்காணிப்பு',
        [AppView.CALL_SCHEDULER]: 'டெலி-ஆலோசனை',
        [AppView.EDUCATION]: 'சுகாதார மையம்',
        [AppView.MEDICATION_TRACKER]: 'மருந்து பெட்டி',
        [AppView.DIET_PLAN]: 'உணவு திட்டம்',
        [AppView.CHATBOT]: 'உதவியாளர்',
        [AppView.APPOINTMENTS]: 'சந்திப்புகள்',
        [AppView.REPORTS]: 'பகுப்பாய்வு',
      },
      Gujarati: {
        [AppView.DASHBOARD]: 'ઝાંખી',
        [AppView.RISK_ASSESSMENT]: 'જોખમ ટ્રેકર',
        [AppView.CALL_SCHEDULER]: 'ટેલી-પરામર્શ',
        [AppView.EDUCATION]: 'આરોગ્ય કેન્દ્ર',
        [AppView.MEDICATION_TRACKER]: 'દવા પેટી',
        [AppView.DIET_PLAN]: 'આહાર યોજના',
        [AppView.CHATBOT]: 'સહાયક',
        [AppView.APPOINTMENTS]: 'મુલાકાતો',
        [AppView.REPORTS]: 'વિશ્લેષણ',
      },
      Kannada: {
        [AppView.DASHBOARD]: 'ಅವಲೋಕನ',
        [AppView.RISK_ASSESSMENT]: 'ಅಪಾಯ ಟ್ರ್ಯಾಕರ್',
        [AppView.CALL_SCHEDULER]: 'ಟೆಲಿ-ಸಮಾಲೋಚನೆ',
        [AppView.EDUCATION]: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ',
        [AppView.MEDICATION_TRACKER]: 'ಔಷಧಿ ಪೆಟ್ಟಿಗೆ',
        [AppView.DIET_PLAN]: 'ಆಹಾರ ಯೋಜನೆ',
        [AppView.CHATBOT]: 'ಸಹಾಯಕ',
        [AppView.APPOINTMENTS]: 'ಭೇಟಿಗಳು',
        [AppView.REPORTS]: 'ವಿಶ್ಲೇಷಣೆ',
      },
      Malayalam: {
        [AppView.DASHBOARD]: 'അവലോകനം',
        [AppView.RISK_ASSESSMENT]: 'റിസ്ക് ട്രാക്കർ',
        [AppView.CALL_SCHEDULER]: 'ടെലി-കൺസൾട്ടേഷൻ',
        [AppView.EDUCATION]: 'ആരോഗ്യ കേന്ദ്രം',
        [AppView.MEDICATION_TRACKER]: 'മരുന്ന് പെട്ടി',
        [AppView.DIET_PLAN]: 'ഭക്ഷണക്രമം',
        [AppView.CHATBOT]: 'സഹായി',
        [AppView.APPOINTMENTS]: 'സന്ദർശനങ്ങൾ',
        [AppView.REPORTS]: 'ವಿശകലനം',
      },
      Punjabi: {
        [AppView.DASHBOARD]: 'ਸੰਖੇਪ',
        [AppView.RISK_ASSESSMENT]: 'ਜੋਖਮ ਟ੍ਰੈਕਰ',
        [AppView.CALL_SCHEDULER]: 'ਟੈਲੀ-ਸਲਾਹ',
        [AppView.EDUCATION]: 'ਸਿਹਤ ਕੇਂਦਰ',
        [AppView.MEDICATION_TRACKER]: 'ਦਵਾਈਆਂ',
        [AppView.DIET_PLAN]: 'ਖੁਰਾਕ ਯੋਜਨਾ',
        [AppView.CHATBOT]: 'ਸਹਾਇਕ',
        [AppView.APPOINTMENTS]: 'ਮੁਲਾਕਾਤਾਂ',
        [AppView.REPORTS]: 'ਵਿਸ਼ਲੇਸ਼ਣ',
      },
    };
    const currentLang = labels[language] || labels.English;
    return currentLang[view] || labels.English[view];
  };

  const navItems = [
    { view: AppView.DASHBOARD, icon: Activity },
    { view: AppView.RISK_ASSESSMENT, icon: HeartPulse },
    { view: AppView.CALL_SCHEDULER, icon: PhoneCall },
    { view: AppView.EDUCATION, icon: BookOpen },
    { view: AppView.MEDICATION_TRACKER, icon: Pill },
    { view: AppView.DIET_PLAN, icon: PieChart },
    { view: AppView.CHATBOT, icon: MessageSquare },
    { view: AppView.APPOINTMENTS, icon: Calendar },
    { view: AppView.REPORTS, icon: FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transition-all duration-500 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full border-r border-white/5">
          <div className="p-8 pb-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20 overflow-hidden border-2 border-teal-500/10 shrink-0">
               {logoLoading ? (
                 <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
               ) : (
                 <img src={logoUrl} alt="MASTER GN7" className="w-full h-full object-cover rounded-full" />
               )}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight leading-none uppercase truncate">MASTER</h1>
              <p className="text-[9px] font-black text-teal-500 uppercase tracking-[0.2em] mt-1.5">Antenatal AI</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide py-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { setCurrentView(item.view); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  currentView === item.view
                    ? 'bg-white/10 text-teal-400 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {currentView === item.view && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-50 rounded-full"></div>}
                <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${currentView === item.view ? 'text-teal-400' : 'text-slate-500'}`} />
                <span className="text-sm tracking-wide">{getLabel(item.view)}</span>
              </button>
            ))}
          </nav>

          <div className="p-6">
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <Globe className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interface</p>
                   <p className="text-xs font-bold">{currentLangObj.label}</p>
                 </div>
               </div>
               <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="w-full py-2.5 px-4 bg-teal-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
               >
                 Switch Language <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
               </button>
            </div>
          </div>
        </div>

        {isLangMenuOpen && (
          <div className="absolute bottom-24 left-8 right-8 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-4 space-y-1 animate-fade-in z-[60]">
             {LANGUAGES_DATA.map(lang => (
               <button 
                  key={lang.id} 
                  onClick={() => { setLanguage(lang.id); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs flex items-center justify-between transition-colors ${language === lang.id ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5'}`}
               >
                 {lang.label}
                 {language === lang.id && <Check className="w-3 h-3" />}
               </button>
             ))}
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="h-20 px-6 md:px-12 flex items-center justify-between bg-white/50 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="hidden md:block text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                 {getLabel(currentView)}
              </h2>
           </div>

           <div className="flex items-center gap-4 md:gap-8">
              <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-3 text-slate-600 hover:bg-slate-100 rounded-2xl relative transition-all">
                   <Bell className="w-6 h-6" />
                   {unreadCount > 0 && (
                     <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-rose-500 text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                        {unreadCount}
                     </span>
                   )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-fade-in">
                       <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Alerts & Status</h3>
                          <button onClick={markAllAsRead} className="text-[10px] font-bold text-teal-600 hover:underline">Mark all as read</button>
                       </div>
                       <div className="max-h-[450px] overflow-y-auto scrollbar-hide">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-6 border-b border-slate-50 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-teal-50/30' : ''}`}>
                                 <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                   n.type === 'critical' ? 'bg-rose-100 text-rose-600' :
                                   n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                   n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                   'bg-blue-100 text-blue-600'
                                 }`}>
                                    {n.type === 'critical' ? <ShieldAlert className="w-5 h-5" /> : 
                                     n.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                                     n.type === 'success' ? <Check className="w-5 h-5" /> : 
                                     <Bell className="w-5 h-5" />}
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-800">{n.title}</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                    <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                 </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-12 text-center text-slate-400">
                               <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                               <p className="text-xs font-bold uppercase tracking-widest">No notifications</p>
                            </div>
                          )}
                       </div>
                    </div>
                  </>
                )}
              </div>

              <div className="h-10 w-[1px] bg-slate-200"></div>

              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{userProfile.role}</p>
                   <p className="text-sm font-black text-slate-800 tracking-tight">{userProfile.name}</p>
                 </div>
                 <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-teal-400 font-black shadow-lg shadow-slate-900/10">
                    {userProfile.name.substring(0,2).toUpperCase()}
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-6 md:px-12 py-10">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

const ShieldAlert = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default Layout;
