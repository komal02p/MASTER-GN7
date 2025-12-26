
import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, Calendar, FileText, PieChart, Menu, X, HeartPulse, ShieldAlert, Bell, Check, Stethoscope, Pill, BookOpen } from 'lucide-react';
import { AppView, AppNotification } from '../types.ts';
import { requestNotificationPermission } from '../services/notificationService.ts';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  setCurrentView, 
  children, 
  notifications, 
  markAsRead, 
  markAllAsRead 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: Activity },
    { view: AppView.RISK_ASSESSMENT, label: 'Prediction Model', icon: HeartPulse },
    { view: AppView.SYMPTOM_CHECKER, label: 'Symptom Checker', icon: Stethoscope },
    { view: AppView.EDUCATION, label: 'Education Hub', icon: BookOpen },
    { view: AppView.MEDICATION_TRACKER, label: 'Meds Tracker', icon: Pill },
    { view: AppView.DIET_PLAN, label: 'AI Diet Plan', icon: PieChart },
    { view: AppView.CHATBOT, label: 'AI Chatbot', icon: MessageSquare },
    { view: AppView.APPOINTMENTS, label: 'Appointments', icon: Calendar },
    { view: AppView.REPORTS, label: 'Reports', icon: FileText },
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
        case 'critical': return <ShieldAlert className="w-5 h-5 text-red-500" />;
        case 'success': return <Check className="w-5 h-5 text-green-500" />;
        case 'warning': return <Activity className="w-5 h-5 text-amber-500" />;
        default: return <Bell className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-teal-900 text-white shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-teal-800">
          <div className="bg-white p-2 rounded-full">
            <ShieldAlert className="w-6 h-6 text-teal-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MASTER GN7</h1>
            <p className="text-xs text-teal-300">Maternal Health AI</p>
          </div>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentView === item.view
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-teal-100 hover:bg-teal-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 bg-teal-950 text-xs text-teal-400 text-center">
           v1.2.0 | Admin: Komal & Vanshika
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-teal-900 text-white z-30 flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-2">
           <ShieldAlert className="w-6 h-6" />
           <span className="font-bold text-lg">MASTER GN7</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-1">
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-teal-900">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {isNotifOpen && (
                    <div className="absolute right-0 top-10 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                         <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <span className="font-semibold text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs text-teal-600 font-medium">Mark all read</button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 text-sm">No notifications</div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-teal-50/50' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className="mt-1">{getNotificationIcon(n.type)}</div>
                                            <div>
                                                <h4 className={`text-sm font-semibold ${n.type === 'critical' ? 'text-red-700' : 'text-slate-800'}`}>{n.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 text-right">{n.timestamp.toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-teal-900 pt-20 px-4">
           <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border border-teal-700 ${
                  currentView === item.view
                    ? 'bg-teal-800 text-white'
                    : 'bg-teal-900 text-teal-100'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="md:hidden h-16 flex-shrink-0" />
        
        <header className="hidden md:flex justify-between items-center px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
            <div>
                 <h2 className="text-xl font-bold text-slate-800">
                    {navItems.find(i => i.view === currentView)?.label || 'Dashboard'}
                 </h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
                    >
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </button>

                    {isNotifOpen && (
                         <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in-down">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Notifications</h3>
                                <div className="flex gap-3">
                                    <button onClick={markAllAsRead} className="text-xs text-teal-600 font-medium hover:underline">Mark all read</button>
                                    <button onClick={() => setIsNotifOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                                </div>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center flex flex-col items-center gap-2">
                                        <Bell className="w-8 h-8 text-slate-200" />
                                        <p className="text-slate-400 text-sm">You're all caught up!</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            onClick={() => markAsRead(n.id)}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-teal-50/30' : ''}`}
                                        >
                                            <div className="mt-1 flex-shrink-0">{getNotificationIcon(n.type)}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-bold ${n.type === 'critical' ? 'text-red-700' : 'text-slate-800'}`}>{n.title}</h4>
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1 leading-snug">{n.message}</p>
                                            </div>
                                            {!n.read && (
                                                <div className="self-center w-2 h-2 bg-teal-500 rounded-full"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                         </div>
                    )}
                </div>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-slate-800">Komal P. & Vanshika T.</p>
                        <p className="text-xs text-slate-500">Administrators</p>
                    </div>
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                        KV
                    </div>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
