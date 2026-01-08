
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { Download, Upload, FileSpreadsheet, Eye, TrendingUp, Activity, Droplet } from 'lucide-react';
import { Language } from '../types';

interface ReportsProps {
  language: Language;
}

const mockHealthData = [
  { month: 'Month 3', systolic: 110, diastolic: 70, sugar: 85, weight: 60, hemoglobin: 11.2 },
  { month: 'Month 4', systolic: 115, diastolic: 72, sugar: 88, weight: 62, hemoglobin: 11.0 },
  { month: 'Month 5', systolic: 118, diastolic: 75, sugar: 92, weight: 64, hemoglobin: 10.8 },
  { month: 'Month 6', systolic: 122, diastolic: 78, sugar: 95, weight: 66, hemoglobin: 11.4 },
  { month: 'Month 7', systolic: 125, diastolic: 82, sugar: 105, weight: 69, hemoglobin: 11.1 },
  { month: 'Month 8', systolic: 130, diastolic: 85, sugar: 110, weight: 71, hemoglobin: 10.9 },
];

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

const mockPatientReports = [
    { id: 'R001', date: getPastDate(45), type: 'Blood Test', status: 'Normal', link: '#' },
    { id: 'R002', date: getPastDate(30), type: 'Ultrasound', status: 'Normal', link: '#' },
    { id: 'R003', date: getPastDate(5), type: 'Glucose Tolerance', status: 'High Risk', link: '#' },
];

const Reports: React.FC<ReportsProps> = ({ language }) => {
  const en = {
    title: "Patient Reports & Analytics",
    subtitle: "Visualizing maternal health trends over time.",
    upload: "Upload Report",
    export: "Export Data",
    bpTrend: "Blood Pressure Trends",
    hbTrend: "Hemoglobin Trends",
    target: "Target: 11.0+",
    sugarWeight: "Glucose & Weight Correlation",
    lab: "Laboratory Records",
    viewAll: "View All Records"
  };

  const hi = {
    title: "रोगी रिपोर्ट और विश्लेषण",
    subtitle: "समय के साथ मातृ स्वास्थ्य रुझानों की कल्पना करना।",
    upload: "रिपोर्ट अपलोड करें",
    export: "डेटा निर्यात करें",
    bpTrend: "ब्लड प्रेशर रुझान",
    hbTrend: "हीमोग्लोबिन रुझान",
    target: "लक्ष्य: 11.0+",
    sugarWeight: "ग्लूकोज और वजन संबंध",
    lab: "प्रयोगशाला रिकॉर्ड",
    viewAll: "सभी रिकॉर्ड देखें"
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

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
            <p className="text-slate-500">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors">
                  <Upload className="w-4 h-4" /> {t.upload}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-shadow shadow-md">
                  <Download className="w-4 h-4" /> {t.export}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" /> {t.bpTrend}
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 160]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="systolic" stroke="#0f766e" strokeWidth={3} name="Systolic" dot={{r: 4}} />
                <Line type="monotone" dataKey="diastolic" stroke="#f43f5e" strokeWidth={3} name="Diastolic" dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-500" /> {t.hbTrend}
            </h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">{t.target}</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[8, 14]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="hemoglobin" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={3} name="Hemoglobin" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="font-semibold text-lg mb-6 text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> {t.sugarWeight}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar yAxisId="right" dataKey="weight" barSize={32} fill="#e2e8f0" name="Weight" radius={[6, 6, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="sugar" stroke="#6366f1" strokeWidth={3} name="Blood Sugar" dot={{r: 5, fill: '#6366f1'}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-slate-800">{t.lab}</h3>
            </div>
            <button className="text-xs font-bold text-teal-600 hover:underline">{t.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {mockPatientReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4 font-bold text-slate-900">{report.id}</td>
                            <td className="px-6 py-4 text-slate-500">{report.date}</td>
                            <td className="px-6 py-4 font-medium text-slate-700">{report.type}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    report.status === 'Normal' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-teal-600 hover:text-teal-800 font-bold text-xs inline-flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg">
                                    <Eye className="w-3.5 h-3.5" /> View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
