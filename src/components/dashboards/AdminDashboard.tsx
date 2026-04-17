import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, FileText, Activity, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const mockChartData = [
  { name: 'Mon', revenue: 4000, patients: 24 },
  { name: 'Tue', revenue: 3000, patients: 18 },
  { name: 'Wed', revenue: 5500, patients: 32 },
  { name: 'Thu', revenue: 4500, patients: 27 },
  { name: 'Fri', revenue: 6000, patients: 40 },
  { name: 'Sat', revenue: 2000, patients: 12 },
  { name: 'Sun', revenue: 1500, patients: 8 },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ patients: 0, appointments: 0, records: 0, bills: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [patients, appts, records, bills] = await Promise.all([
          fetch('/api/patients', { headers }).then(r => r.json()),
          fetch('/api/appointments', { headers }).then(r => r.json()),
          fetch('/api/records', { headers }).then(r => r.json()),
          fetch('/api/billing', { headers }).then(r => r.json()),
        ]);
        setStats({
          patients: patients.length,
          appointments: appts.length,
          records: records.length,
          bills: bills.length 
        });
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Analytics</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time overview of clinic operations</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 bg-white shadow-sm hover:shadow-md border border-slate-200">
          <TrendingUp className="w-4 h-4" /> Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Patients" 
          value={stats.patients || 124} 
          icon={Users} 
          colorScheme="blue" 
          trend="+12%"
        />
        <StatCard 
          label="Appointments" 
          value={stats.appointments || 45} 
          icon={Activity} 
          colorScheme="primary" 
          trend="+5%"
        />
        <StatCard 
          label="Medical Records" 
          value={stats.records || 312} 
          icon={FileText} 
          colorScheme="purple" 
          trend="+8%"
        />
        <StatCard 
          label="Revenue (Today)" 
          value={`ETB ${(stats.bills * 650) || 12500}`} 
          icon={DollarSign} 
          colorScheme="emerald" 
          trend="+18%"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary-500" /> Revenue Trend
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Weekly aggregate in ETB</p>
            </div>
            <div className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              This Week
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} tickFormatter={v => `ETB ${v}`} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  itemStyle={{ color: '#0d9488', fontWeight: 700, fontSize: '16px' }}
                  labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel p-6 sm:p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800">Patient Intake</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Daily visitors</p>
          </div>
          <div className="h-[320px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
                />
                <Bar dataKey="patients" fill="url(#colorPatients)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, colorScheme, trend }: { label: string, value: string | number, icon: any, colorScheme: 'blue' | 'primary' | 'purple' | 'emerald', trend: string }) {
  const styles = {
    blue: { iconBg: 'bg-blue-50 text-blue-600', trendText: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
    primary: { iconBg: 'bg-primary-50 text-primary-600', trendText: 'text-primary-600', gradient: 'from-primary-500 to-primary-600' },
    purple: { iconBg: 'bg-purple-50 text-purple-600', trendText: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
    emerald: { iconBg: 'bg-emerald-50 text-emerald-600', trendText: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
  };

  const scheme = styles[colorScheme];

  return (
    <div className="glass-panel p-6 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${scheme.gradient} rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-4xl font-extrabold text-slate-800 tracking-tight mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${scheme.iconBg} border border-white shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 relative z-10">
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${scheme.iconBg} bg-opacity-50 border border-white/50`}>
          {trend}
        </span>
        <span className="text-xs font-medium text-slate-400">vs last week</span>
      </div>
    </div>
  );
}
