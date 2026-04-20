import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { cn } from '../lib/utils';
import { Calendar, Clock, User, Stethoscope, ChevronRight, Search, Plus, Filter, CheckCircle2, XCircle, X } from 'lucide-react';

export default function Appointments() {
  const { appointments, patients, doctors, addAppointment } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [isBooking, setIsBooking] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    doctorId: '',
    date: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  const getPatientName = (id: string) => {
    const p = patients.find(p => p.id === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown Patient';
  };

  const getDoctorName = (id: string) => {
    const d = doctors.find(d => d.id === id);
    return d ? d.name : 'Unknown Doctor';
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = getPatientName(a.patientId).toLowerCase().includes(search.toLowerCase()) ||
                        getDoctorName(a.doctorId).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      ...newAppt,
      date: new Date(newAppt.date).toISOString(),
      status: 'scheduled'
    });
    setIsBooking(false);
    setNewAppt({
      patientId: '',
      doctorId: '',
      date: new Date().toISOString().slice(0, 16),
      notes: ''
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Clinic Schedule</h2>
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mt-1">Visit Coordination & Booking Registry</p>
        </div>
        <button 
          onClick={() => setIsBooking(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Book New Session
        </button>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)] space-y-8">
        {/* ... table content ... */}
      </div>

      {/* Booking Modal */}
      {isBooking && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Book Clinical Session</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Visit Coordination Unit</p>
              </div>
              <button 
                onClick={() => setIsBooking(false)}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleBook} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Patient Candidate</label>
                <select 
                  required
                  value={newAppt.patientId}
                  onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                >
                  <option value="">Select Patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physician Assignment</label>
                <select 
                  required
                  value={newAppt.doctorId}
                  onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                >
                  <option value="">Select Doctor...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Schedule Timestamp</label>
                <input 
                  type="datetime-local"
                  required
                  value={newAppt.date}
                  onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Clinical Brief / Notes</label>
                <textarea 
                  value={newAppt.notes}
                  onChange={e => setNewAppt({...newAppt, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none h-24 resize-none"
                  placeholder="Reason for visit, symptoms, or follow-up details..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsBooking(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-primary-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
