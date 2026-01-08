
import React, { useState } from 'react';
import { Appointment, AppNotification, Language } from '../types';
import { Calendar as CalendarIcon, Clock, Check, X, CalendarDays, Plus, MapPin } from 'lucide-react';

interface AppointmentSchedulerProps {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  language: Language;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ addNotification, language }) => {
  const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const today = new Date().toISOString().split('T')[0];

  const getTranslations = (lang: Language) => {
    const dict: Record<Language, any> = {
      English: {
        title: "Clinical Visits",
        subtitle: "Manage your prenatal checkups and upcoming hospital visits.",
        book: "New Booking",
        cancel: "Cancel",
        newVisit: "Schedule Hospital Visit",
        date: "Select Date",
        time: "Preferred Time",
        type: "Visit Type",
        confirm: "Confirm Appointment",
        none: "No upcoming appointments scheduled.",
        location: "Community Health Center",
        status: "Status"
      },
      Hindi: {
        title: "क्लिनिकल विज़िट",
        subtitle: "अपनी प्रसव पूर्व जांच और आगामी अस्पताल यात्राओं का प्रबंधन करें।",
        book: "नई बुकिंग",
        cancel: "रद्द करें",
        newVisit: "अस्पताल विज़िट निर्धारित करें",
        date: "तारीख चुनें",
        time: "पसंदीदा समय",
        type: "विज़िट प्रकार",
        confirm: "नियुक्ति की पुष्टि करें",
        none: "कोई आगामी नियुक्तियां निर्धारित नहीं हैं।",
        location: "सामुदायिक स्वास्थ्य केंद्र",
        status: "स्थिति"
      },
      Marathi: { title: "रुग्णालय भेटी", book: "नवीन बुकिंग", cancel: "रद्द करा", none: "कोणत्याही भेटी नियोजित नाहीत." },
      Bengali: { title: "হাসপাতাল ভিজিট", book: "নতুন বুকিং", cancel: "বাতিল করুন", none: "কোন অ্যাপয়েন্টমেন্ট নির্ধারিত নেই।" },
      Telugu: { title: "క్లినికల్ విజిట్స్", book: "కొత్త బుకింగ్", cancel: "రద్దు చేయి", none: "నియమించబడిన అపాయింట్‌మెంట్‌లు లేవు." },
      Tamil: { title: "மருத்துவமனை வருகைகள்", book: "புதிய முன்பதிவு", cancel: "ரத்து செய்", none: "திட்டமிடப்பட்ட சந்திப்புகள் எதுவும் இல்லை." },
      Gujarati: { title: "ક્લિનિકલ મુલાકાતો", book: "નવું બુકિંગ", cancel: "રદ કરો", none: "કોઈ એપોઇન્ટમેન્ટ નિર્ધારિત નથી." },
      Kannada: { title: "ಚಿಕಿತ್ಸಾಲಯ ಭೇಟಿಗಳು", book: "ಹೊಸ ಬುಕಿಂಗ್", cancel: "ರದ್ದುಗೊಳಿಸಿ", none: "ಯಾವುದೇ ನೇಮಕಾತಿಗಳನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿಲ್ಲ." },
      Malayalam: { title: "ആശുപത്രി സന്ദർശനങ്ങൾ", book: "പുതിയ ബുക്കിംഗ്", cancel: "റദ്ദാക്കുക", none: "അപ്പോയിന്റ്‌മെന്റുകളൊന്നും നിശ്ചയിച്ചിട്ടില്ല." },
      Punjabi: { title: "ਹਸਪਤਾਲ ਦੀਆਂ ਮੁਲਾਕਾਤਾਂ", book: "ਨਵੀਂ ਬੁਕਿੰਗ", cancel: "ਰੱਦ ਕਰੋ", none: "ਕੋਈ ਮੁਲਾਕਾਤ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤੀ ਗਈ।" }
    };
    const base = dict.English;
    const target = dict[lang] || base;
    return { ...base, ...target };
  };

  const t = getTranslations(language);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { 
      id: '1', 
      patientName: 'Priya S.', 
      date: getFutureDate(5), 
      time: '10:00 AM', 
      type: 'Routine Checkup', 
      status: 'Scheduled' 
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ date: today, time: '', type: 'Routine Checkup' });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const appt: Appointment = {
      id: Date.now().toString(),
      patientName: 'Priya S.',
      date: newAppt.date,
      time: newAppt.time,
      type: newAppt.type,
      status: 'Scheduled'
    };
    setAppointments([...appointments, appt]);
    setShowForm(false);
    setNewAppt({ date: today, time: '', type: 'Routine Checkup' });
    addNotification({
        title: 'Appointment Scheduled',
        message: `Your ${appt.type} on ${appt.date} at ${appt.time} has been confirmed.`,
        type: 'success'
    });
  };

  const inputClassName = "w-full p-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:bg-white focus:border-teal-500 font-bold transition-all";

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <CalendarDays className="w-8 h-8" />
              </div>
              {t.title}
            </h2>
            <p className="text-slate-500 text-lg font-medium">{t.subtitle}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3 ${showForm ? 'bg-white border border-slate-200 text-slate-500' : 'bg-teal-900 text-white shadow-teal-900/20 hover:bg-teal-800'}`}>
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? t.cancel : t.book}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-2xl"></div>
          <h3 className="text-xl font-black text-slate-800 mb-8 relative z-10">{t.newVisit}</h3>
          <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.date}</label>
              <input type="date" required min={today} className={inputClassName} value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.time}</label>
              <input type="time" required className={inputClassName} value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.type}</label>
              <select className={inputClassName} value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value})}>
                <option>Routine Checkup</option>
                <option>Ultrasound</option>
                <option>Blood Test</option>
                <option>Specialist Consult</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end pt-4">
              <button type="submit" className="px-10 py-5 bg-teal-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-teal-800 transition-all active:scale-95">
                {t.confirm}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-teal-500 transition-all group">
            <div className="flex items-start gap-6">
              <div className="bg-slate-50 p-5 rounded-3xl text-teal-900 group-hover:bg-teal-50 group-hover:scale-110 transition-all duration-500">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 text-xl tracking-tight">{appt.type}</h4>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-teal-600" /> {appt.date}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-600" /> {appt.time}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> {t.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{t.status}</p>
                   <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">{appt.status}</span>
                </div>
                <button className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                  <X className="w-6 h-6" />
                </button>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="bg-slate-50/50 rounded-[3rem] py-24 text-center border-2 border-dashed border-slate-200">
             <CalendarDays className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest">{t.none}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
