import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { 
  MOCK_PATIENTS, 
  MOCK_BILLING,
  Patient,
  Billing as Bill
} from '../../lib/mockData';

export default function ReceptionistDashboard() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLING);
  
  // Forms
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [dob, setDob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPatient: Patient = {
      id: `P-${Math.random().toString(36).substr(2, 9)}`,
      firstName: fName,
      lastName: lName,
      dob,
      gender: 'Other', // Mocking
      contact: '000-000-0000',
      address: 'Addis Ababa',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setPatients(prev => [...prev, newPatient]);
    setFName(''); setLName(''); setDob('');
    setIsSubmitting(false);
  };

  const handlePayBill = (id: string) => {
    setBills(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'paid' as const } : b
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
      
      {/* Patient Registration */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Fast Registration</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">New Patient Intake</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleRegisterPatient} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="header-label mb-1.5 block">First Name</label>
              <input required type="text" placeholder="John" value={fName} onChange={e=>setFName(e.target.value)} className="input-field border py-2 px-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            <div>
              <label className="header-label mb-1.5 block">Last Name</label>
              <input required type="text" placeholder="Doe" value={lName} onChange={e=>setLName(e.target.value)} className="input-field border py-2 px-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
          </div>
          <div>
            <label className="header-label mb-1.5 block">Date of Birth</label>
            <input required type="date" value={dob} onChange={e=>setDob(e.target.value)} className="input-field border py-2 px-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"/>
          </div>
          
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3.5 flex justify-center gap-2 items-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Registering...' : 'Register Patient File'}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100/60 flex-1">
          <h3 className="header-label mb-4 flex items-center justify-between">
            Recent Intakes 
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {patients.slice(-5).reverse().map((p, idx) => (
              <div key={p.id} className="group flex justify-between items-center py-2 px-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                    {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{p.firstName} {p.lastName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-xs font-mono font-medium">{p.dob}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="glass-panel p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Billing Console</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Pending Invoices</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {bills.map((bill, index) => {
            const patient = patients.find(p => p.id === bill.patientId);
            const fullName = patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${bill.patientId}`;
            const isPaid = bill.status === 'paid';
            
            return (
              <div key={bill.id} className={`p-5 rounded-2xl border transition-all ${
                isPaid ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg shadow-sm'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg border ${isPaid ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-orange-50 border-orange-200 text-orange-500'}`}>
                      {isPaid ? <CheckCircle className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">{fullName}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
                        <span>INV-{bill.id.substring(0,6).toUpperCase()}</span>
                        <span>•</span>
                        <span>{bill.issuedDate ? format(new Date(bill.issuedDate), 'MMM do, yyyy') : 'No Date'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-slate-800 text-xl tracking-tight">ETB {bill.amount?.toFixed(2)}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mt-1 border ${
                      isPaid ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' : 'bg-orange-100/50 text-orange-700 border-orange-200'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
                {!isPaid && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handlePayBill(bill.id)}
                      className="w-full sm:w-auto sm:ml-auto block bg-emerald-600 text-white py-2 px-6 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-emerald-100"
                    >
                      Record Payment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {bills.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <CreditCard className="w-12 h-12 mb-3 text-emerald-100" />
              <p className="text-slate-500 font-medium">No pending invoices.</p>
            </div>
          )}
        </div>
      </div>
    
    </div>
  );
}
