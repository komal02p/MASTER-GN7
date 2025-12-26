import React, { useState } from 'react';
import { Appointment, AppNotification } from '../types';
import { Calendar as CalendarIcon, Clock, Check, X } from 'lucide-react';

interface AppointmentSchedulerProps {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ addNotification }) => {
  // Helper to get dynamic dates
  const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const today = new Date().toISOString().split('T')[0];

  const [appointments, setAppointments] = useState<Appointment[]>([
    { 
      id: '1', 
      patientName: 'You', 
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
      patientName: 'You',
      date: newAppt.date,
      time: newAppt.time,
      type: newAppt.type,
      status: 'Scheduled'
    };
    setAppointments([...appointments, appt]);
    setShowForm(false);
    setNewAppt({ date: today, time: '', type: 'Routine Checkup' });

    // 1. Notify immediate success
    addNotification({
        title: 'Appointment Scheduled',
        message: `Your ${appt.type} on ${appt.date} at ${appt.time} has been confirmed.`,
        type: 'success'
    });

    // 2. Simulate a reminder push notification after 5 seconds
    setTimeout(() => {
        addNotification({
            title: 'Appointment Reminder',
            message: `Reminder: You have a ${appt.type} coming up soon. Please bring your previous reports.`,
            type: 'info'
        });
    }, 5000);
  };

  const inputClassName = "w-full p-2 bg-slate-100 border border-slate-200 text-slate-900 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
            <p className="text-slate-500">Manage your prenatal visits and checkups.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-lg animate-fade-in">
          <h3 className="text-lg font-bold mb-4">Schedule New Visit</h3>
          <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                required
                min={today}
                className={inputClassName}
                value={newAppt.date}
                onChange={e => setNewAppt({...newAppt, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input 
                type="time" 
                required
                className={inputClassName}
                value={newAppt.time}
                onChange={e => setNewAppt({...newAppt, time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                className={inputClassName}
                value={newAppt.type}
                onChange={e => setNewAppt({...newAppt, type: e.target.value})}
              >
                <option>Routine Checkup</option>
                <option>Ultrasound</option>
                <option>Blood Test</option>
                <option>Consultation</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-teal-600 text-white px-8 py-2 rounded-lg font-medium">Confirm Booking</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-teal-50 p-3 rounded-lg text-teal-700">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{appt.type}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {appt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {appt.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {appt.status}
                </span>
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
            <div className="text-center py-12 text-slate-400">
                No upcoming appointments.
            </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;