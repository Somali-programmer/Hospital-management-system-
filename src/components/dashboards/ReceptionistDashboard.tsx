import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { UserPlus, CreditCard, ChevronRight, CheckCircle, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function ReceptionistDashboard() {
  const { profile } = useAuth();
  const { patients, billing, appointments, updateBill } = useData();
  
  const todayAppointments = appointments.filter(a => 
    new Date(a.date).toDateString() === new Date().toDateString()
  ).sort((a, b) => a.time.localeCompare(b.time));

  const pendingBills = billing.filter(b => b.status === 'pending');

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const handlePayBill = (id: string) => {
    updateBill(id, { status: 'paid' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
      
      {/* Today's Appointments */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Today's Schedule</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{format(new Date(), 'EEEE, MMMM do')}</p>
            </div>
          </div>
          <Link to="/appointments" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All Schedule</Link>
        </div>
        
        <div className="space-y-4 overflow-y-auto pr-2 max-h-[500px]">
          {todayAppointments.map((apt) => (
            <div key={apt.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{getPatientName(apt.patientId)}</p>
                    <p className="text-xs font-semibold text-slate-500">Dr. {apt.doctorId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700 font-mono bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                     <Clock className="w-4 h-4 text-slate-400" /> {apt.time}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{apt.type}</span>
                </div>
              </div>
            </div>
          ))}
          {todayAppointments.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <Calendar className="w-12 h-12 mb-3 text-blue-100" />
              <p className="text-slate-500 font-medium">No appointments scheduled for today.</p>
            </div>
          )}
        </div>
      </div>

      {/* Billing */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Billing Console</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Pending Invoices ({pendingBills.length})</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 overflow-y-auto pr-2 max-h-[500px]">
          {pendingBills.map((bill) => {
            const patient = patients.find(p => p.id === bill.patientId);
            const fullName = patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${bill.patientId}`;
            
            return (
              <div key={bill.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg shadow-sm transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg border bg-orange-50 border-orange-200 text-orange-500">
                      <CreditCard className="w-5 h-5" />
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
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mt-1 border bg-orange-100/50 text-orange-700 border-orange-200">
                      {bill.status}
                    </span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handlePayBill(bill.id)}
                    className="w-full sm:w-auto sm:ml-auto block bg-emerald-600 text-white py-2 px-6 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-emerald-100"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            );
          })}
          {pendingBills.length === 0 && (
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
