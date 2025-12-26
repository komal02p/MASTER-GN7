
import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import RiskAssessment from './components/RiskAssessment.tsx';
import DietPlan from './components/DietPlan.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';
import Reports from './components/Reports.tsx';
import AppointmentScheduler from './components/AppointmentScheduler.tsx';
import SymptomChecker from './components/SymptomChecker.tsx';
import MedicationTracker from './components/MedicationTracker.tsx';
import Education from './components/Education.tsx';
import { AppView, AppNotification } from './types.ts';
import { sendNativeNotification } from './services/notificationService.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'welcome-msg',
      title: 'Welcome to MASTER GN7',
      message: 'System initialized successfully.',
      type: 'info',
      timestamp: new Date(),
      read: false
    }
  ]);

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

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard changeView={setCurrentView} />;
      case AppView.RISK_ASSESSMENT:
        return <RiskAssessment addNotification={addNotification} />;
      case AppView.SYMPTOM_CHECKER:
        return <SymptomChecker />;
      case AppView.EDUCATION:
        return <Education />;
      case AppView.MEDICATION_TRACKER:
        return <MedicationTracker addNotification={addNotification} />;
      case AppView.DIET_PLAN:
        return <DietPlan />;
      case AppView.CHATBOT:
        return <ChatAssistant />;
      case AppView.REPORTS:
        return <Reports />;
      case AppView.APPOINTMENTS:
        return <AppointmentScheduler addNotification={addNotification} />;
      default:
        return <Dashboard changeView={setCurrentView} />;
    }
  };

  return (
    <Layout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        notifications={notifications}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
