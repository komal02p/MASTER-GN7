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
  Bar
} from 'recharts';
import { Download, Upload, FileSpreadsheet, Eye } from 'lucide-react';

const mockHealthData = [
  { month: 'Month 3', systolic: 110, diastolic: 70, sugar: 85, weight: 60 },
  { month: 'Month 4', systolic: 115, diastolic: 72, sugar: 88, weight: 62 },
  { month: 'Month 5', systolic: 118, diastolic: 75, sugar: 92, weight: 64 },
  { month: 'Month 6', systolic: 122, diastolic: 78, sugar: 95, weight: 66 },
  { month: 'Month 7', systolic: 125, diastolic: 82, sugar: 105, weight: 69 },
  { month: 'Month 8', systolic: 130, diastolic: 85, sugar: 110, weight: 71 },
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

const Reports: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Patient Reports & Analytics</h2>
            <p className="text-slate-500">Visualizing maternal health trends over time.</p>
          </div>
          <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">
                  <Upload className="w-4 h-4" /> Upload Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
                  <Download className="w-4 h-4" /> Export Excel
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BP Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-lg mb-6 text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
            Blood Pressure Trends
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#0f766e" strokeWidth={2} name="Systolic" dot={{r: 4}} />
                <Line type="monotone" dataKey="diastolic" stroke="#f43f5e" strokeWidth={2} name="Diastolic" dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sugar/Weight Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-lg mb-6 text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Sugar & Weight Correlation
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} label={{ value: 'Sugar', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#94a3b8', fontSize: 10} }} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} label={{ value: 'Weight', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fill: '#94a3b8', fontSize: 10} }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="right" dataKey="weight" barSize={20} fill="#cbd5e1" name="Weight (kg)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="sugar" stroke="#6366f1" strokeWidth={3} name="Sugar (mg/dL)" dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Excel Sheet / Table View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-800">Patient Report Management (Excel View)</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Report ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {mockPatientReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{report.id}</td>
                            <td className="px-6 py-4">{report.date}</td>
                            <td className="px-6 py-4">{report.type}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    report.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center gap-1">
                                    <Eye className="w-4 h-4" /> View
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