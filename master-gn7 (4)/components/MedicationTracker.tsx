
import React, { useState, useEffect } from 'react';
import { Medication, AppNotification, Language } from '../types';
import { Plus, Trash2, Check, Clock, Pill, AlertCircle } from 'lucide-react';

interface MedicationTrackerProps {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  language: Language;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ addNotification, language }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('');

  const en = {
    title: "Medication Tracker",
    subtitle: "Track your daily supplements and medicines.",
    local: "Data stored locally on device",
    add: "Add Medication",
    name: "Medicine Name",
    dosage: "Dosage",
    time: "Time",
    btn: "Add Reminder",
    none: "No medications added yet",
    noneSub: "Add your prescriptions to get reminders."
  };

  const hi = {
    title: "दवा ट्रैकर",
    subtitle: "अपने दैनिक सप्लीमेंट और दवाओं को ट्रैक करें।",
    local: "डेटा डिवाइस पर स्थानीय रूप से संग्रहीत है",
    add: "दवा जोड़ें",
    name: "दवा का नाम",
    dosage: "खुराक (Dosage)",
    time: "समय",
    btn: "अनुस्मारक (Reminder) जोड़ें",
    none: "अभी तक कोई दवा नहीं जोड़ी गई है",
    noneSub: "रिमाइंडर पाने के लिए अपनी नुस्खे जोड़ें।"
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

  useEffect(() => {
    const savedMeds = localStorage.getItem('master_gn7_medications');
    if (savedMeds) {
      try { setMedications(JSON.parse(savedMeds)); } catch (e) { console.error("Failed to parse medications"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('master_gn7_medications', JSON.stringify(medications));
  }, [medications]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDosage || !newTime) return;
    const newMed: Medication = { id: Date.now().toString(), name: newName, dosage: newDosage, time: newTime };
    setMedications([...medications, newMed]);
    setNewName(''); setNewDosage(''); setNewTime('');
    addNotification({ title: 'Medication Added', message: `Reminder set for ${newMed.name} at ${newMed.time}.`, type: 'success' });
  };

  const handleDelete = (id: string) => { setMedications(medications.filter(m => m.id !== id)); };
  const toggleTaken = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setMedications(medications.map(m => {
        if (m.id === id) {
            const isTakenToday = m.lastTakenDate === today;
            return { ...m, lastTakenDate: isTakenToday ? undefined : today };
        }
        return m;
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
            <p className="text-slate-500">{t.subtitle}</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> <span>{t.local}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-teal-600" /> {t.add}</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div><label className="text-sm font-medium text-slate-600 mb-1 block">{t.name}</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Iron Tablet" className="w-full p-3 bg-slate-50 border rounded-lg outline-none" required /></div>
                    <div><label className="text-sm font-medium text-slate-600 mb-1 block">{t.dosage}</label><input type="text" value={newDosage} onChange={(e) => setNewDosage(e.target.value)} placeholder="e.g. 100mg" className="w-full p-3 bg-slate-50 border rounded-lg outline-none" required /></div>
                    <div><label className="text-sm font-medium text-slate-600 mb-1 block">{t.time}</label><input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-lg outline-none" required /></div>
                    <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">{t.btn}</button>
                </form>
            </div>
        </div>
        <div className="md:col-span-2 space-y-4">
            {medications.length === 0 ? <div className="bg-slate-50 rounded-2xl p-12 text-center border-dashed border">
                    <Pill className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-600 font-medium">{t.none}</h3>
                    <p className="text-slate-400 text-sm mt-1">{t.noneSub}</p>
                </div> : medications.sort((a,b) => a.time.localeCompare(b.time)).map((med) => {
                    const isTaken = med.lastTakenDate === today;
                    return (
                        <div key={med.id} className={`p-4 rounded-xl border flex items-center gap-4 ${isTaken ? 'bg-green-50 opacity-75' : 'bg-white shadow-sm'}`}>
                            <button onClick={() => toggleTaken(med.id)} className={`w-12 h-12 rounded-full flex items-center justify-center ${isTaken ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300'}`}><Check className="w-6 h-6" /></button>
                            <div className="flex-1"><h4 className={`font-bold text-lg ${isTaken ? 'text-green-800 line-through' : 'text-slate-800'}`}>{med.name}</h4><div className="flex items-center gap-4 text-sm mt-1"><span className="flex items-center gap-1 text-slate-500"><Pill className="w-4 h-4" /> {med.dosage}</span><span className="flex items-center gap-1 text-teal-600 font-medium"><Clock className="w-4 h-4" /> {med.time}</span></div></div>
                            <button onClick={() => handleDelete(med.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    );
                })}
        </div>
      </div>
    </div>
  );
};

export default MedicationTracker;
