import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Microscope, Beaker, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LaboratorianDashboard() {
  const { profile } = useAuth();
  const { labTests } = useData();

  const pendingTests = labTests.filter(t => t.status === 'pending');
  const completedToday = labTests.filter(t => 
    t.status === 'completed' && 
    new Date(t.requestDate).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Laboratory Overview</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time status of lab requests and samples</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Tests</p>
              <p className="text-4xl font-extrabold text-slate-800 tracking-tight mt-2">{pendingTests.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-white shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
             <Link to="/laboratory" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-2">Process Tests &rarr;</Link>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
           <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed Today</p>
              <p className="text-4xl font-extrabold text-emerald-600 tracking-tight mt-2">{completedToday.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-white shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
             <Link to="/laboratory" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2">View Records &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
