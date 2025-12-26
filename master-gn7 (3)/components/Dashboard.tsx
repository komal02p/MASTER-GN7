import React from 'react';
import { AppView } from '../types';
import { Calendar, AlertCircle, Heart, ArrowRight } from 'lucide-react';

interface DashboardProps {
  changeView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ changeView }) => {
  // Calculate dynamic next appointment date (e.g., 5 days from now)
  const nextApptDate = new Date();
  nextApptDate.setDate(nextApptDate.getDate() + 5);
  const formattedDate = nextApptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Welcome to MASTER GN7</h1>
          <p className="text-teal-100 mb-6 text-lg">
            Empowering rural women with AI-driven early detection and prevention of antenatal complications.
          </p>
          <button 
            onClick={() => changeView(AppView.RISK_ASSESSMENT)}
            className="px-6 py-3 bg-white text-teal-800 rounded-full font-bold hover:bg-teal-50 transition-colors shadow-md flex items-center gap-2"
          >
            Start Risk Screening <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {/* Decorational Circle */}
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-teal-500 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Key Metrics Summary (Mock) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-rose-100 text-rose-600 rounded-xl">
                <Heart className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Last BP Reading</p>
                <p className="text-2xl font-bold text-slate-800">120/80</p>
                <p className="text-xs text-green-600 font-medium">Normal Range</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
                <Calendar className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Next Appointment</p>
                <p className="text-2xl font-bold text-slate-800">{formattedDate}</p>
                <p className="text-xs text-slate-400">with Dr. Sharma</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Alerts</p>
                <p className="text-2xl font-bold text-slate-800">1 Active</p>
                <p className="text-xs text-amber-600 font-medium">Check Sugar Level</p>
            </div>
        </div>
      </div>

      {/* Mission Text from Prompt */}
      <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-700 mb-2 uppercase text-sm tracking-wider">Project Mission</h3>
        <p className="text-slate-600 italic">
          "To develop, validate, and evaluate the AI-powered mobile system (MASTER GN7) for early detection and prevention of antenatal complications among rural women, improving screening and referral compared to conventional care."
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
            onClick={() => changeView(AppView.DIET_PLAN)}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">AI Diet Plan</h3>
            <p className="text-slate-500 mb-4">Get a customized nutrition plan based on your hemoglobin and sugar levels.</p>
            <span className="text-teal-600 font-medium text-sm flex items-center gap-1">Generate Plan &rarr;</span>
        </div>

        <div 
             onClick={() => changeView(AppView.CHATBOT)}
             className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">Ask AI Assistant</h3>
            <p className="text-slate-500 mb-4">Have questions about symptoms? Chat with our AI trained on maternal health guidelines.</p>
            <span className="text-teal-600 font-medium text-sm flex items-center gap-1">Start Chat &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;