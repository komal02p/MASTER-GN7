
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import RiskAssessment from './components/RiskAssessment.tsx';
import DietPlan from './components/DietPlan.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';
import Reports from './components/Reports.tsx';
import AppointmentScheduler from './components/AppointmentScheduler.tsx';
import MedicationTracker from './components/MedicationTracker.tsx';
import Education from './components/Education.tsx';
import CallScheduler from './components/CallScheduler.tsx';
import Login from './components/Login.tsx';
import { AppView, AppNotification, Language, UserProfile, HealthMetrics, MedicalHistory } from './types.ts';
import { sendNativeNotification } from './services/notificationService.ts';

const DEFAULT_METRICS: HealthMetrics = {
  systolicBP: 120,
  diastolicBP: 80,
  bloodSugar: 95,
  hemoglobin: 11.5,
  weight: 62,
  age: 26,
  weekOfPregnancy: 12,
  hivStatus: 'Negative',
  rhFactor: 'Rh+'
};

const DEFAULT_HISTORY: MedicalHistory = {
  conditions: '',
  surgeries: '',
  allergies: ''
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [language, setLanguage] = useState<Language>('English');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Priya S.',
    role: 'patient',
    metrics: DEFAULT_METRICS,
    history: DEFAULT_HISTORY
  });
  const [pendingCallReason, setPendingCallReason] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const updateMetrics = (metrics: HealthMetrics) => {
    setUserProfile(prev => ({ ...prev, metrics }));
  };

  const handleLogin = (name: string, role: 'patient' | 'doctor' | 'asha') => {
    setUserProfile(prev => ({ ...prev, name, role }));
    setIsLoggedIn(true);
    setCurrentView(AppView.DASHBOARD);
    
    // Initial notification
    addNotification({
      title: language === 'English' ? 'Authentication Successful' : 'प्रमाणीकरण सफल',
      message: language === 'English' ? `Welcome back, ${name}. Your clinical dashboard is ready.` : `स्वागत है, ${name}। आपका डैशबोर्ड तैयार है।`,
      type: 'success'
    });
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    sendNativeNotification(newNotif.title, newNotif.message);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navigateToCallWithReason = (reason: string) => {
    setPendingCallReason(reason);
    setCurrentView(AppView.CALL_SCHEDULER);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} language={language} setLanguage={setLanguage} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard changeView={setCurrentView} language={language} />;
      case AppView.RISK_ASSESSMENT:
        return (
          <RiskAssessment 
            addNotification={addNotification} 
            changeView={setCurrentView} 
            consultDoctorWithReason={navigateToCallWithReason}
            language={language}
            metrics={userProfile.metrics}
            history={userProfile.history}
            onUpdateMetrics={updateMetrics}
            onUpdateHistory={(h) => updateProfile({ history: h })}
          />
        );
      case AppView.CALL_SCHEDULER:
        return (
          <CallScheduler 
            addNotification={addNotification} 
            prefilledReason={pendingCallReason}
            clearPrefilledReason={() => setPendingCallReason(null)}
            language={language}
            userProfile={userProfile}
          />
        );
      case AppView.EDUCATION:
        return <Education language={language} />;
      case AppView.MEDICATION_TRACKER:
        return <MedicationTracker addNotification={addNotification} language={language} />;
      case AppView.DIET_PLAN:
        return <DietPlan language={language} metrics={userProfile.metrics} />;
      case AppView.CHATBOT:
        return <ChatAssistant language={language} />;
      case AppView.REPORTS:
        return <Reports language={language} />;
      case AppView.APPOINTMENTS:
        return <AppointmentScheduler addNotification={addNotification} language={language} />;
      default:
        return <Dashboard changeView={setCurrentView} language={language} />;
    }
  };

  return (
    <Layout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        notifications={notifications}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
        language={language}
        setLanguage={setLanguage}
        userProfile={userProfile}
    >
      {renderView()}
    </Layout>
  );
};

export default App;