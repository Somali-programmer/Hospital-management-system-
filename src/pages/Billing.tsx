import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { cn } from '../lib/utils';
import { Search, Plus, CreditCard, DollarSign, Download, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Billing() {
  const { billing: bills, patients, addBill, updateBill } = useData();
  const [search, setSearch] = useState('');
  const [isInvoicing, setIsInvoicing] = useState(false);
  const [newBill, setNewBill] = useState({
    patientId: '',
    amount: 0,
    currency: 'ETB',
    type: 'other' as const,
    description: 'Manual Invoice'
  });

  const getPatientName = (id: string) => {
    const p = patients.find(p => p.id === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown Patient';
  };

  const filteredBills = bills.filter(b => 
    getPatientName(b.patientId).toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = bills.filter(b => b.status === 'unpaid').reduce((acc, b) => acc + b.amount, 0);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    addBill({
      ...newBill,
      status: 'unpaid',
      issuedDate: new Date().toISOString()
    });
    setIsInvoicing(false);
    setNewBill({ patientId: '', amount: 0, currency: 'ETB', type: 'other', description: 'Manual Invoice' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full pb-12 relative px-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Financial Ledger</h2>
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mt-1">Billing & Revenue Management</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Outstanding</p>
              <p className="text-xl font-black text-rose-600 font-mono tracking-tighter uppercase">{totalOutstanding.toLocaleString()} ETB</p>
           </div>
           <button 
             onClick={() => setIsInvoicing(true)}
             className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
           >
             <Plus className="w-5 h-5" /> Generate Invoice
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by patient name or invoice ID #..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/80 rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 focus:outline-none transition-all shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
            />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Billing ID</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Patient Candidate</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Issued Date</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Amount</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBills.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-7 font-black text-slate-400 font-mono text-[11px] tracking-widest group-hover:text-primary-600">#{b.id}</td>
                    <td className="px-8 py-7">
                       <p className="font-black text-slate-800 uppercase tracking-tight leading-none truncate mb-1">{getPatientName(b.patientId)}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]" title={b.description}>{b.description || b.type}</p>
                    </td>
                    <td className="px-8 py-7">
                       <p className="font-bold text-slate-500 uppercase text-[11px] font-mono tracking-tighter">{new Date(b.issuedDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <p className="font-black text-slate-900 font-mono text-base tracking-tighter">
                         {b.amount.toFixed(2)} <span className="text-[10px] text-slate-400 uppercase font-bold">{b.currency}</span>
                       </p>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm inline-flex items-center gap-2",
                        b.status === 'paid' ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-rose-100 text-rose-800 border-rose-200"
                      )}>
                        {b.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <button className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-primary-600 hover:text-white transition-all active:scale-95">
                         <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/10">
              <CreditCard className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Payment Gateways</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10 leading-relaxed italic">Synchronized transaction processing for insurance & direct patient billing.</p>
              
              <div className="space-y-4 pt-6 border-t border-slate-800">
                 <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Insurance</span>
                    <span className="text-xs font-black text-white uppercase tracking-tight tracking-widest">14 Providers</span>
                 </div>
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-2 tracking-widest text-center">Daily Collection Efficiency</p>
                    <div className="flex items-center justify-center gap-4">
                       <span className="text-3xl font-black text-white font-mono leading-none">92%</span>
                       <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h4>
              <div className="space-y-4">
                 {bills.slice(0, 3).map(b => (
                   <div key={b.id} className="flex items-center justify-between gap-4 p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="min-w-0">
                         <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">{getPatientName(b.patientId)}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{b.status === 'paid' ? 'Payment Verified' : 'Awaiting Funds'}</p>
                      </div>
                      <p className={cn("text-xs font-black font-mono", b.status === 'paid' ? 'text-emerald-600' : 'text-rose-600')}>
                         {b.amount.toFixed(0)}
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {isInvoicing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">New Patient Invoice</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Hospital Revenue Unit</p>
              </div>
              <button 
                onClick={() => setIsInvoicing(false)}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleIssue} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Patient Candidate</label>
                <select 
                  required
                  value={newBill.patientId}
                  onChange={e => setNewBill({...newBill, patientId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                >
                  <option value="">Select Patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Invoice Amount (ETB)</label>
                <input 
                  type="number"
                  required
                  placeholder="0.00"
                  value={newBill.amount}
                  onChange={e => setNewBill({...newBill, amount: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsInvoicing(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-using TrendingUp for styling in the card above
function TrendingUp({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
