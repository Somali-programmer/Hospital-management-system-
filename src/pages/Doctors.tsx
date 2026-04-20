import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { cn } from '../lib/utils';
import { Search, Plus, User, Phone, Briefcase, Calendar, ChevronRight, X } from 'lucide-react';

export default function Doctors() {
  const { doctors, addDoctor } = useData();
  const [search, setSearch] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    specialization: '',
    contact: '',
    status: 'active' as const,
    availability: ''
  });

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor(newStaff);
    setIsAdding(false);
    setNewStaff({ name: '', specialization: '', contact: '', status: 'active', availability: '' });
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Search & List */}
      <div className={cn(
        "flex-col lg:w-96 bg-white border border-slate-200/60 rounded-3xl shrink-0 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300",
        selectedDoctorId ? "hidden lg:flex" : "flex w-full"
      )}>
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Staff Management</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Clinical Personnel</p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/10">
          {filteredDoctors.map(doctor => (
            <button
              key={doctor.id}
              onClick={() => setSelectedDoctorId(doctor.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group",
                selectedDoctorId === doctor.id 
                  ? "bg-primary-50 border-primary-200 shadow-sm" 
                  : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-colors uppercase",
                selectedDoctorId === doctor.id ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
              )}>
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{doctor.name}</h4>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{doctor.specialization}</p>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-all opacity-0 group-hover:opacity-100", selectedDoctorId === doctor.id ? "text-primary-600 opacity-100" : "text-slate-300")} />
            </button>
          ))}
        </div>
      </div>

      {/* Detail Pane */}
      <div className={cn(
        "flex-1 bg-white border border-slate-200/60 rounded-3xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300",
        !selectedDoctorId ? "hidden lg:flex" : "flex h-full"
      )}>
        {selectedDoctor ? (
          <div className="flex flex-col h-full">
            <header className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary-500/30">
                  {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">{selectedDoctor.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-primary-200">
                      {selectedDoctor.specialization}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-widest border",
                      selectedDoctor.status === 'active' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"
                    )}>
                      {selectedDoctor.status}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-600 flex items-center gap-2"
                onClick={() => setSelectedDoctorId(null)}
              >
                Back To List
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Professional Contact Info
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Direct Phone</p>
                      <p className="text-sm font-black text-slate-800 font-mono tracking-tight">{selectedDoctor.contact}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Internal Extension</p>
                      <p className="text-sm font-black text-slate-800 font-mono tracking-tight">#EXT-{(Math.random() * 9000 + 1000).toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Duty Schedule
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Weekly Availability</p>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{selectedDoctor.availability || 'Subject to Rota'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Clinic Hours</p>
                      <p className="text-sm font-black text-slate-800 font-mono tracking-tight">08:00 - 17:00</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Performance & Logs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                    <p className="text-3xl font-black text-slate-900 mb-1">{(Math.random() * 100 + 150).toFixed(0)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Patients</p>
                  </div>
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                    <p className="text-3xl font-black text-primary-600 mb-1">4.9</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Satisfaction Score</p>
                  </div>
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                    <p className="text-3xl font-black text-slate-900 mb-1">{(Math.random() * 5 + 10).toFixed(0)}y</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Hospital Personnel Directory</h3>
             <p className="text-slate-500 max-w-sm text-sm font-medium italic">Select a doctor or staff member from the ledger to view professional credentials, availability patterns, and clinic performance data.</p>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Staff Registration</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Personnel Management Unit</p>
              </div>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Legal Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Dr. Alice Johnson"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Medical Specialization</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Cardiology, Surgery..."
                  value={newStaff.specialization}
                  onChange={e => setNewStaff({...newStaff, specialization: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Contact</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+251 ..."
                    value={newStaff.contact}
                    onChange={e => setNewStaff({...newStaff, contact: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Duty Patterns</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., Mon-Fri..."
                    value={newStaff.availability}
                    onChange={e => setNewStaff({...newStaff, availability: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-primary-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-900/20 hover:bg-primary-800 transition-all"
                >
                  Register Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
