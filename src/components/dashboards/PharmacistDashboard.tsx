import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Package, Pill, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PharmacistDashboard() {
  const { profile } = useAuth();
  const { medicines, prescriptions } = useData();

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const lowStockMedicines = medicines.filter(m => m.stock < 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pharmacy Overview</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time status of prescriptions and stock</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Prescriptions</p>
              <p className="text-4xl font-extrabold text-slate-800 tracking-tight mt-2">{pendingPrescriptions.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary-50 text-primary-600 border border-white shadow-sm">
              <Pill className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
             <Link to="/pharmacy" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-2">View Prescriptions &rarr;</Link>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
           <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
              <p className="text-4xl font-extrabold text-rose-600 tracking-tight mt-2">{lowStockMedicines.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 border border-white shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
             <Link to="/pharmacy" className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-2">Manage Inventory &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
