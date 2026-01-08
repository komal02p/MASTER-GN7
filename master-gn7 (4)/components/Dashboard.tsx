
import React from 'react';
import { AppView, Language } from '../types';
import { Calendar, AlertCircle, Heart, ArrowRight, Activity, TrendingUp, Zap, Sparkles, PieChart, MessageSquare, ShieldCheck, Waves } from 'lucide-react';

interface DashboardProps {
  changeView: (view: AppView) => void;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ changeView, language }) => {
  const nextApptDate = new Date();
  nextApptDate.setDate(nextApptDate.getDate() + 5);
  const formattedDate = nextApptDate.toLocaleDateString(language === 'Hindi' ? 'hi-IN' : 'en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const translations: Record<Language, any> = {
    English: {
      welcome: "Safeguarding Every Heartbeat",
      empower: "Your dedicated AI companion for safe and healthy maternal journey, specifically optimized for rural healthcare environments.",
      start: "Assess Risk Now",
      bp: "Vitals Check",
      normal: "Optimal Range",
      appt: "Next Visit",
      with: "Community Health Center",
      alerts: "Intelligence Insight",
      active: "Monitoring Active",
      check: "BP check needed",
      diet: "Nutrition Blueprint",
      dietText: "Science-backed nutrition plans tailored to your pregnancy trimester and current health data.",
      genDiet: "Explore Meals",
      chat: "Clinical Support AI",
      chatText: "Instant, empathetic medical guidance for symptoms, medication, and prenatal curiosity.",
      startChat: "Connect with AI"
    },
    Hindi: {
      welcome: "हर धड़कन की सुरक्षा",
      empower: "स्वस्थ प्रसव यात्रा के लिए आपका समर्पित एआई साथी, विशेष रूप से ग्रामीण स्वास्थ्य देखभाल वातावरण के लिए अनुकूलित।",
      start: "जोखिम की जांच करें",
      bp: "महत्वपूर्ण संकेत",
      normal: "अनुकूल रेंज",
      appt: "अगली विज़िट",
      with: "सामुदायिक स्वास्थ्य केंद्र",
      alerts: "इंटेलिजेंस अंतर्दृष्टि",
      active: "निगरानी सक्रिय",
      check: "बीपी जांच की आवश्यकता",
      diet: "पोषण ब्लूप्रिंट",
      dietText: "आपकी गर्भावस्था और स्वास्थ्य डेटा के अनुरूप विज्ञान-आधारित पोषण योजनाएं।",
      genDiet: "भोजन देखें",
      chat: "क्लिनिकल सपोर्ट एआई",
      chatText: "लक्षणों और प्रसव पूर्व जिज्ञासा के लिए त्वरित, सहानुभूतिपूर्ण चिकित्सा मार्गदर्शन।",
      startChat: "एआई से जुड़ें"
    },
    Marathi: {
      welcome: "प्रत्येक हृदयाची सुरक्षा",
      empower: "तुमच्या सुरक्षित प्रवासासाठी समर्पित AI साथीदार, विशेषतः ग्रामीण भागांसाठी तयार केलेला.",
      start: "जोखीम तपासा",
      bp: "महत्वाचे संकेत",
      normal: "योग्य श्रेणी",
      appt: "पुढील भेट",
      with: "आरोग्य केंद्र",
      alerts: "इंटेलिजन्स माहिती",
      active: "देखरेख सक्रिय",
      check: "बीपी तपासणी आवश्यक",
      diet: "आहार योजना",
      dietText: "तुमच्या आरोग्यासाठी आणि प्रसूतीसाठी तयार केलेली आहार योजना.",
      genDiet: "आहार पहा",
      chat: "वैद्यकीय सहाय्यक AI",
      chatText: "तुमच्या लक्षणांसाठी आणि शंकांसाठी त्वरित वैद्यकीय मार्गदर्शन.",
      startChat: "AI सोबत बोला"
    },
    Bengali: {
      welcome: "প্রতিটি হৃদস্পন্দনের সুরক্ষা",
      empower: "আপনার নিরাপদ মাতৃত্বের জন্য নিবেদিত এআই সঙ্গী, বিশেষ করে গ্রামীণ এলাকার জন্য তৈরি।",
      start: "ঝুঁকি যাচাই করুন",
      bp: "শারীরিক লক্ষণ",
      normal: "স্বাভাবিক পরিসর",
      appt: "পরবর্তী ভিজিট",
      with: "স্বাস্থ্য কেন্দ্র",
      alerts: "ইন্টেলিজেন্স ইনসাইট",
      active: "মনিটরিং সক্রিয়",
      check: "বিপি চেক প্রয়োজন",
      diet: "পুষ্টি পরিকল্পনা",
      dietText: "আপনার স্বাস্থ্যের জন্য উপযোগী বিজ্ঞান-ভিত্তিক পুষ্টি পরিকল্পনা।",
      genDiet: "খাবার দেখুন",
      chat: "ক্লিনিকাল সাপোর্ট এআই",
      chatText: "উপসর্গ এবং প্রশ্নের জন্য তাৎক্ষণিক চিকিৎসা নির্দেশিকা।",
      startChat: "এআই-এর সাথে কথা বলুন"
    },
    Telugu: {
      welcome: "ప్రతి హృదయ స్పందన భద్రత",
      empower: "మీ సురక్షిత ప్రయాణం కోసం అంకితమైన AI తోడు, ముఖ్యంగా గ్రామీణ ప్రాంతాల కోసం రూపొందించబడింది.",
      start: "రిస్క్ అంచనా వేయండి",
      bp: "వైటల్ చెక్",
      normal: "సరైన పరిధి",
      appt: "తదుపరి సందర్శన",
      with: "ఆరోగ్య కేంద్రం",
      alerts: "ఇంటెలిజెన్స్ ఇన్సైట్",
      active: "పర్యవేక్షణ క్రియాశీలంగా ఉంది",
      check: "BP తనిఖీ అవసరం",
      diet: "పోషకాహార ప్రణాళిక",
      dietText: "మీ ఆరోగ్యం కోసం రూపొందించబడిన పోషకాహార ప్రణాళికలు.",
      genDiet: "ఆహారం చూడండి",
      chat: "క్లినికల్ సపోర్ట్ AI",
      chatText: "లక్షణాలు మరియు ప్రశ్నల కోసం తక్షణ వైద్య మార్గదర్శకత్వం.",
      startChat: "AI తో మాట్లాడండి"
    },
    Tamil: {
      welcome: "ஒவ்வொரு இதயத் துடிப்பின் பாதுகாப்பு",
      empower: "உங்கள் பாதுகாப்பான பயணத்திற்கான பிரத்யேக AI துணை, குறிப்பாக கிராமப்புற சுகாதாரத்திற்காக மேம்படுத்தப்பட்டது.",
      start: "ஆபத்தை மதிப்பிடு",
      bp: "உடல் அளவீடுகள்",
      normal: "சரியான வரம்பு",
      appt: "அடுத்த வருகை",
      with: "சுகாதார மையம்",
      alerts: "நுண்ணறிவுத் தகவல்",
      active: "கண்காணிப்பு செயலில் உள்ளது",
      check: "பிபி பரிசோதனை தேவை",
      diet: "ஊட்டச்சத்து திட்டம்",
      dietText: "உங்கள் ஆரோக்கியத்திற்காக வடிவமைக்கப்பட்ட ஊட்டச்சத்து திட்டங்கள்.",
      genDiet: "உணவை பார்",
      chat: "மருத்துவ ஆதரவு AI",
      chatText: "அறிகுறிகள் மற்றும் கேள்விகளுக்கு உடனடி மருத்துவ வழிகாட்டுதல்.",
      startChat: "AI உடன் பேசு"
    },
    Gujarati: {
      welcome: "દરેક ધબકારાની સુરક્ષા",
      empower: "તમારી સુરક્ષિત મુસાફરી માટે સમર્પિત AI સાથી, ખાસ કરીને ગ્રામીણ વિસ્તારો માટે તૈયાર કરેલ.",
      start: "જોખમ તપાસો",
      bp: "મહત્વપૂર્ણ સંકેતો",
      normal: "શ્રેષ્ઠ શ્રેણી",
      appt: "આગલી મુલાકાત",
      with: "આરોગ્ય કેન્દ્ર",
      alerts: "ઇન્ટેલિજન્સ માહિતી",
      active: "નિરીક્ષણ સક્રિય છે",
      check: "BP તપાસ જરૂરી",
      diet: "પોષણ યોજના",
      dietText: "તમારા સ્વાસ્થ્ય માટે તૈયાર કરેલી પોષણ યોજનાઓ.",
      genDiet: "ખોરાક જુઓ",
      chat: "ક્લિનિકલ સપોર્ટ AI",
      chatText: "લક્ષણો અને પ્રશ્નો માટે તાત્કાલિક તબીબી માર્ગદર્શન.",
      startChat: "AI સાથે વાત કરો"
    },
    Kannada: {
      welcome: "ಪ್ರತಿ ಹೃದಯ ಬಡಿತದ ರಕ್ಷಣೆ",
      empower: "ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಪ್ರಯಾಣಕ್ಕಾಗಿ ಸಮರ್ಪಿತ AI ಸಂಗಾತಿ, ವಿಶೇಷವಾಗಿ ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
      start: "ಅಪಾಯ ಪರಿಶೀಲಿಸಿ",
      bp: "ವೈಟಲ್ ಚೆಕ್",
      normal: "ಉತ್ತಮ ಶ್ರೇಣಿ",
      appt: "ಮುಂದಿನ ಭೇಟಿ",
      with: "ಆರೋಗ್ಯ ಕೇಂದ್ರ",
      alerts: "ಇಂಟೆಲಿಜೆನ್ಸ್ ಇನ್ಸೈಟ್",
      active: "ಮೇಲ್ವಿಚಾರಣೆ ಸಕ್ರಿಯವಾಗಿದೆ",
      check: "BP ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆ",
      diet: "ಪೌಷ್ಟಿಕಾಂಶ ಯೋಜನೆ",
      dietText: "ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ವಿಜ್ಞಾನ-ಆಧಾರಿತ ಪೌಷ್ಟಿಕಾಂಶ ಯೋಜನೆಗಳು.",
      genDiet: "ಊಟ ನೋಡಿ",
      chat: "ಕ್ಲಿನಿಕಲ್ ಸಪೋರ್ಟ್ AI",
      chatText: "ಲಕ್ಷಣಗಳು ಮತ್ತು ಪ್ರಶ್ನೆಗಳಿಗಾಗಿ ತ್ವರಿತ ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ.",
      startChat: "AI ನೊಂದಿಗೆ ಮಾತನಾಡಿ"
    },
    Malayalam: {
      welcome: "ഓരോ ഹൃദയമിടിപ്പിന്റെയും സുരക്ഷ",
      empower: "നിങ്ങളുടെ സുരക്ഷിതമായ യാത്രയ്ക്കായി സമർപ്പിത AI സഹായി, ഗ്രാമീണ ആരോഗ്യ സംരക്ഷണത്തിനായി പ്രത്യേകം തയ്യാറാക്കിയത്.",
      start: "റിസ്ക് പരിശോധിക്കുക",
      bp: "ശാരീരിക അളവുകൾ",
      normal: "മികച്ച നില",
      appt: "അടുത്ത സന്ദർശനം",
      with: "ആരോഗ്യ കേന്ദ്രം",
      alerts: "ഇന്റലിജൻസ് ഇൻസൈറ്റ്",
      active: "നിരീക്ഷണം സജീവമാണ്",
      check: "BP പരിശോധന ആവശ്യമാണ്",
      diet: "പോഷകാഹാര പദ്ധതി",
      dietText: "നിങ്ങളുടെ ആരോഗ്യത്തിനായി തയ്യാറാക്കിയ പോഷകാഹാര പദ്ധതികൾ.",
      genDiet: "ഭക്ഷണം കാണുക",
      chat: "ക്ലിനിക്കൽ സപ്പോർട്ട് AI",
      chatText: "ലക്ഷണങ്ങൾക്കും ചോദ്യങ്ങൾക്കും ഉടനടി വൈദ്യസഹായം.",
      startChat: "AI യോട് സംസാരിക്കൂ"
    },
    Punjabi: {
      welcome: "ਹਰ ਧੜਕਣ ਦੀ ਸੁਰੱਖਿਆ",
      empower: "ਤੁਹਾਡੀ ਸੁਰੱਖਿਅਤ ਯਾਤਰਾ ਲਈ ਸਮਰਪਿਤ AI ਸਾਥੀ, ਖਾਸ ਤੌਰ 'ਤੇ ਪੇਂਡੂ ਸਿਹਤ ਸੰਭਾਲ ਲਈ ਅਨੁਕੂਲਿਤ।",
      start: "ਜੋਖਮ ਦੀ ਜਾਂਚ ਕਰੋ",
      bp: "ਮਹੱਤਵਪੂਰਨ ਸੰਕੇਤ",
      normal: "ਸਭ ਤੋਂ ਵਧੀਆ ਰੇਂਜ",
      appt: "ਅਗਲੀ ਮੁਲਾਕਾਤ",
      with: "ਸਿਹਤ ਕੇਂਦਰ",
      alerts: "ਇੰਟੈਲੀਜੈਂਸ ਇਨਸਾਈਟ",
      active: "ਨਿਗਰਾਨੀ ਸਰਗਰਮ ਹੈ",
      check: "BP ਜਾਂਚ ਦੀ ਲੋੜ",
      diet: "ਖੁਰਾਕ ਯੋਜਨਾ",
      dietText: "ਤੁਹਾਡੀ ਸਿਹਤ ਲਈ ਵਿਗਿਆਨ-ਅਧਾਰਤ ਪੋਸ਼ਣ ਯੋਜਨਾਵਾਂ।",
      genDiet: "ਖੁਰਾਕ ਦੇਖੋ",
      chat: "ਕਲੀਨਿਕਲ ਸਪੋਰਟ AI",
      chatText: "ਲੱਛਣਾਂ ਅਤੇ ਪ੍ਰਸ਼ਨਾਂ ਲਈ ਤੁਰੰਤ ਡਾਕਟਰੀ ਮਾਰਗਦਰਸ਼ਨ।",
      startChat: "AI ਨਾਲ ਜੁੜੋ"
    }
  };

  const t = translations[language] || translations.English;

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="relative rounded-[3rem] p-8 md:p-20 overflow-hidden bg-slate-950 text-white shadow-2xl premium-shadow">
        <div className="absolute top-0 right-0 w-full h-full opacity-40 bg-[radial-gradient(circle_at_80%_20%,#14b8a6_0%,transparent_50%)]"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-10 left-10 opacity-10 animate-pulse">
           <Waves className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">
            <Sparkles className="w-4 h-4" /> Integrated Intelligence
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400">
              {t.welcome}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              {t.empower}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => changeView(AppView.RISK_ASSESSMENT)}
              className="group px-10 py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 flex items-center gap-4 active:scale-95"
            >
              {t.start} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => changeView(AppView.EDUCATION)}
              className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
            >
              Resources
            </button>
          </div>
        </div>
        
        <div className="hidden xl:block absolute right-20 top-1/2 -translate-y-1/2">
          <div className="relative w-96 h-96">
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-full h-full glass-card rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden">
               <div className="flex flex-col items-center gap-4">
                 <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-teal-400 animate-pulse" />
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">Live Telemetry</p>
                    <p className="text-3xl font-black">72 BPM</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Activity, color: 'rose', bg: 'bg-rose-500', label: t.bp, value: '118/78', sub: t.normal, trend: '+2%' },
          { icon: Calendar, color: 'indigo', bg: 'bg-indigo-500', label: t.appt, value: formattedDate, sub: t.with, trend: 'Confirmed' },
          { icon: ShieldCheck, color: 'emerald', bg: 'bg-emerald-500', label: t.alerts, value: t.active, sub: t.check, trend: 'Secure' }
        ].map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-teal-300 transition-all hover-lift">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 ${stat.bg} text-white rounded-2xl shadow-lg shadow-${stat.color}-100`}>
                  <stat.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full border border-slate-100">{stat.trend}</span>
            </div>
            <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1.5 pt-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${stat.color === 'rose' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <p className="text-xs font-bold text-slate-500">{stat.sub}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
            onClick={() => changeView(AppView.DIET_PLAN)}
            className="group relative cursor-pointer bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:border-teal-500 transition-all hover-lift"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-slate-900 scale-150 transform translate-x-10 -translate-y-10 group-hover:scale-[1.7] transition-transform duration-700">
              <PieChart className="w-64 h-64" />
            </div>
            <div className="relative z-10 space-y-6">
                <div className="w-16 h-1.5 bg-teal-500 rounded-full"></div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-teal-700 transition-colors">{t.diet}</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-sm">{t.dietText}</p>
                <div className="flex items-center gap-4 pt-4">
                  <span className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest group-hover:bg-teal-600 transition-colors flex items-center gap-3 shadow-xl">
                    {t.genDiet} <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
            </div>
        </div>

        <div 
             onClick={() => changeView(AppView.CHATBOT)}
             className="group relative cursor-pointer bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:border-indigo-500 transition-all hover-lift"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-slate-900 scale-150 transform translate-x-10 -translate-y-10 group-hover:scale-[1.7] transition-transform duration-700">
              <MessageSquare className="w-64 h-64" />
            </div>
            <div className="relative z-10 space-y-6">
                <div className="w-16 h-1.5 bg-indigo-500 rounded-full"></div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors">{t.chat}</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-sm">{t.chatText}</p>
                <div className="flex items-center gap-4 pt-4">
                  <span className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest group-hover:bg-indigo-600 transition-colors flex items-center gap-3 shadow-xl">
                    {t.startChat} <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
