import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, User, FileEdit, CheckCircle, Activity, ClipboardList, Clock, History, FileText, Bold, Italic, List, X, File } from 'lucide-react';
import { format } from 'date-fns';

export default function DoctorDashboard() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'emr' | 'history'>('emr');
  
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [generateBill, setGenerateBill] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Mock auto-save logic
  useEffect(() => {
    if (!selectedAppt || activeTab !== 'emr') return;
    if (diagnosis || prescription) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAutoSaveStatus('idle');
    }
  }, [diagnosis, prescription, selectedAppt, activeTab]);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const [appts, pats] = await Promise.all([
      fetch('/api/appointments', { headers }).then(r => r.json()),
      fetch('/api/patients', { headers }).then(r => r.json()),
    ]);
    setAppointments(appts);
    setPatients(pats);
  };

  const handleEMRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await fetch('/api/records', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: selectedAppt.patient_id,
        appointment_id: selectedAppt.id,
        diagnosis,
        prescription,
        generateBillAmount: generateBill ? 1200 : null
      })
    });
    
    await fetch(`/api/appointments/${selectedAppt.id}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });

    setDiagnosis('');
    setPrescription('');
    setSelectedAppt(null);
    setActiveTab('emr');
    setGenerateBill(false);
    setIsSaving(false);
    setAutoSaveStatus('idle');
    fetchData();
  };

  const getPatientName = (id: number) => {
    const p = patients.find(p => p.id === id);
    return p ? `${p.first_name} ${p.last_name}` : `ID: ${id}`;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
      <div className="xl:col-span-2 space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-primary-100 text-primary-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 flex-1">Today's Schedule</h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
              {appointments.filter(a => a.status !== 'completed').length} Pending
            </span>
          </div>
          
          <div className="space-y-4">
            {appointments.map(appt => (
              <div 
                key={appt.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 sm:gap-0 ${
                  selectedAppt?.id === appt.id 
                    ? 'border-primary-500 bg-primary-50/50 shadow-[0_0_15px_rgba(20,184,166,0.15)] ring-1 ring-primary-500/20' 
                    : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    appt.status === 'completed' ? 'bg-slate-100 text-slate-400' : 'bg-primary-100 text-primary-700'
                  }`}>
                    {getPatientName(appt.patient_id).charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-base">{getPatientName(appt.patient_id)}</span>
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <Activity className="w-3.5 h-3.5 text-primary-500" />
                      {format(new Date(appt.date), 'h:mm a')} • Standard Consult
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-16 sm:ml-0">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    appt.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 'bg-blue-50 text-blue-600 border border-blue-200/50'
                  }`}>
                    {appt.status}
                  </span>
                  {appt.status !== 'completed' && (
                    <button 
                      onClick={() => { setSelectedAppt(appt); setActiveTab('emr'); }}
                      className={`btn-primary shadow-[0_4px_15px_rgba(33,150,243,0.15)] text-[13px] py-2 px-5 ${selectedAppt?.id === appt.id ? 'opacity-50 cursor-not-allowed hidden sm:block' : ''}`}
                      disabled={selectedAppt?.id === appt.id}
                    >
                      {selectedAppt?.id === appt.id ? 'Selected' : 'Open EMR'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                <CheckCircle className="w-12 h-12 mb-3 text-emerald-400" />
                <p className="text-slate-600 font-medium">All caught up for today!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-1 h-[calc(100vh-12rem)] min-h-[600px]">
        {selectedAppt ? (
          <div className="glass-panel h-full flex flex-col border-primary-100 animate-in slide-in-from-right-4 shadow-[0_8px_40px_rgba(20,184,166,0.08)] bg-gradient-to-br from-white to-primary-50/20 overflow-hidden">
            <div className="p-6 pb-0 flex flex-col shrink-0">
              <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary-700 text-white rounded-xl shadow-md shadow-primary-700/30">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">Patient File</h3>
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-0.5 truncate max-w-[140px]">
                      {getPatientName(selectedAppt.patient_id)}
                    </p>
                  </div>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors ml-auto mr-3"
                >
                  <History className="w-3.5 h-3.5" />
                  Full History
                </button>

                {/* Auto-save indicator */}
                {activeTab === 'emr' && autoSaveStatus !== 'idle' && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {autoSaveStatus === 'saving' && <><Clock className="w-3.5 h-3.5 animate-spin" /> Saving</>}
                    {autoSaveStatus === 'saved' && <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Saved</>}
                  </div>
                )}
              </div>
              
              {/* Internal Tabs */}
              <div className="flex gap-2 mb-6 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('emr')}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'emr' ? 'bg-white text-primary-700 shadow-[0_2px_10px_rgba(44,62,80,0.05)]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                >
                  <span className="flex items-center justify-center gap-1.5"><FileEdit className="w-3.5 h-3.5" /> Encounter</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-primary-700 shadow-[0_2px_10px_rgba(44,62,80,0.05)]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                >
                  <span className="flex items-center justify-center gap-1.5"><History className="w-3.5 h-3.5" /> History</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
              {activeTab === 'emr' ? (
                <form onSubmit={handleEMRSubmit} className="space-y-5 h-full flex flex-col justify-between">
                  <div className="space-y-5">
                    {/* Rich text mock for Diagnosis */}
                    <div>
                      <label className="header-label flex items-center gap-2 mb-1.5">
                        <Activity className="w-4 h-4 text-slate-400" /> Clinical Diagnosis
                      </label>
                      <div className="border border-slate-200/60 rounded-xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden focus-within:ring-2 focus-within:ring-secondary-500/20 focus-within:border-secondary-500 transition-all">
                        <div className="flex items-center gap-1 p-1 border-b border-slate-100 bg-slate-50/50">
                          <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 rounded transition-colors"><Bold className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 rounded transition-colors"><Italic className="w-3.5 h-3.5" /></button>
                          <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 rounded transition-colors"><List className="w-3.5 h-3.5" /></button>
                        </div>
                        <textarea 
                          required
                          rows={4} 
                          placeholder="Enter structured diagnostic findings..."
                          className="w-full p-3 text-sm text-charcoal outline-none resize-none bg-transparent"
                          value={diagnosis}
                          onChange={e => setDiagnosis(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Rich text mock for Prescription */}
                    <div>
                      <label className="header-label flex items-center gap-2 mb-1.5">
                        <FileEdit className="w-4 h-4 text-slate-400" /> Prescription Plan
                      </label>
                      <div className="flex bg-white border border-slate-200/60 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden focus-within:ring-2 focus-within:ring-secondary-500/20 focus-within:border-secondary-500 transition-all">
                        <div className="flex flex-col gap-1 p-2 bg-slate-50/80 border-r border-slate-100 items-center justify-start shrink-0">
                           <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 rounded transition-colors"><List className="w-3.5 h-3.5" /></button>
                        </div>
                        <textarea 
                          required
                          rows={3} 
                          placeholder="Medication, dosage, routing..."
                          className="w-full p-3 text-sm text-charcoal outline-none resize-none bg-transparent"
                          value={prescription}
                          onChange={e => setPrescription(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 mt-2 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                      <div className="relative flex items-center mt-0.5">
                        <input 
                          type="checkbox" 
                          id="bill" 
                          checked={generateBill} 
                          onChange={e => setGenerateBill(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer shadow-sm"
                        />
                      </div>
                      <div className="flex flex-col cursor-pointer flex-1" onClick={() => setGenerateBill(!generateBill)}>
                        <label htmlFor="bill" className="text-sm font-bold text-slate-800 cursor-pointer">Auto-bill standard consult</label>
                        <span className="text-xs font-medium text-slate-500 mt-0.5">Generates a ETB 1200 invoice instantly</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-100 shrink-0">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="w-full btn-primary py-3.5 text-base shadow-lg shadow-secondary-500/25 flex items-center justify-center gap-2"
                    >
                      {isSaving ? <Activity className="w-5 h-5 animate-pulse" /> : <CheckCircle className="w-5 h-5" />}
                      {isSaving ? 'Finalizing Record...' : 'Save & Close Record'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {appointments.filter(a => a.patient_id === selectedAppt.patient_id && a.status === 'completed').length > 0 ? (
                    appointments.filter(a => a.patient_id === selectedAppt.patient_id && a.status === 'completed').map((a, idx) => (
                      <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-sm font-bold text-slate-800">{format(new Date(a.date), 'MMM do, yyyy')}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Finalized</span>
                        </div>
                        <div className="text-xs font-medium text-slate-500 space-y-1.5 flex flex-col">
                           <span className="flex items-center gap-1.5 group-hover:text-primary-600 transition-colors"><FileText className="w-3.5 h-3.5"/> Standard Consultation</span>
                           <span className="flex items-center gap-1.5 pl-5 text-slate-400">Dr. {a.doctor_id}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                       <History className="w-8 h-8 text-slate-300 mb-3" />
                       <p className="text-sm font-medium text-slate-500">No past encounters on record.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 flex flex-col items-center justify-center h-full border-dashed border-2 bg-slate-50/50">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400 text-center uppercase tracking-wider leading-relaxed">
              Select an appointment<br/>to review file
            </p>
          </div>
        )}
      </div>

      {/* History Modal */}
      {showHistoryModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Complete Medical History</h3>
                  <p className="text-xs text-slate-500 font-medium">Patient: {getPatientName(selectedAppt.patient_id)}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {appointments.filter(a => a.patient_id === selectedAppt.patient_id && a.status === 'completed').length > 0 ? (
                  appointments.filter(a => a.patient_id === selectedAppt.patient_id && a.status === 'completed').map((a, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary-100 text-primary-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-800">{format(new Date(a.date), 'MMMM do, yyyy')}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Dr. {a.doctor_id}</span>
                        </div>
                        <div className="space-y-3 mt-3">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis / Notes</p>
                            <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">Standard consultation completed. Vitals normal. Patient reported mild symptoms.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <History className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">No previous medical history found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
