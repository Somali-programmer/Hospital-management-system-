import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  CreditCard, 
  ChevronRight, 
  Clock,
  ArrowLeft,
  Activity,
  UserCircle,
  Stethoscope,
  Droplet,
  Info,
  ShieldAlert,
  MapPin,
  Phone,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  MOCK_PATIENTS, 
  MOCK_APPOINTMENTS, 
  MOCK_RECORDS, 
  MOCK_BILLING,
  Patient,
  Appointment,
  MedicalRecord,
  Billing as Bill
} from '../lib/mockData';

interface PatientHistory {
  patient: Patient;
  appointments: Appointment[];
  records: MedicalRecord[];
  billing: Bill[];
}

// --- Components ---

const StatusBadge = ({ status }: { status?: string }) => {
  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    stable: "bg-blue-50 text-blue-700 border-blue-100",
    critical: "bg-rose-50 text-rose-700 border-rose-100 animate-pulse",
  };
  
  const currentStatus = status || 'active';
  
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
      styles[currentStatus] || "bg-slate-100 text-slate-600 border-slate-200"
    )}>
      {currentStatus}
    </span>
  );
};

const FormatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(amount);
};

export default function Patients() {
  const { user: currentUser } = useAuth();
  
  // Use local state initialized from mock data to simulate "database"
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [billing, setBilling] = useState<Bill[]>(MOCK_BILLING);

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [history, setHistory] = useState<PatientHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'clinical' | 'appointments' | 'billing' | 'info'>('clinical');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCreatingAppt, setIsCreatingAppt] = useState(false);
  const [apptForm, setApptForm] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    diagnosis: '',
    prescription: '',
    presentingComplaint: '',
    familyHistory: '',
    socialHistory: '',
    vitalsBp: '',
    vitalsTemp: '',
    vitalsPulse: '',
    generateBillAmount: '500',
  });

  useEffect(() => {
    // Initial load simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      setIsEditing(false);
      
      const p = patients.find(p => p.id === selectedPatientId);
      if (p) {
        setHistory({
          patient: p,
          appointments: appointments.filter(a => a.patientId === selectedPatientId),
          records: medicalRecords.filter(r => r.patientId === selectedPatientId),
          billing: billing.filter(b => b.patientId === selectedPatientId)
        });
      }
    } else {
      setHistory(null);
      setIsEditing(false);
    }
  }, [selectedPatientId, patients, appointments, medicalRecords, billing]);

  const handleEditInit = () => {
    if (history?.patient) {
      setEditForm({
        firstName: history.patient.firstName,
        lastName: history.patient.lastName,
        dob: history.patient.dob,
        contact: history.patient.contact,
        address: history.patient.address,
      });
      setValidationError(null);
      setIsEditing(true);
    }
  };

  const validateForm = () => {
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    
    if (!editForm.contact) {
      setValidationError("Contact number is required.");
      return false;
    }
    
    if (!phoneRegex.test(editForm.contact)) {
      setValidationError("Invalid phone format. (e.g., +251 91 123 4567)");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSaveAttempt = () => {
    if (validateForm()) {
      setShowSaveConfirm(true);
    }
  };

  const performSave = async () => {
    if (!selectedPatientId || !history) return;
    
    setPatients(prev => prev.map(p => 
      p.id === selectedPatientId ? { ...p, ...editForm } : p
    ));
    
    setIsEditing(false);
    setShowSaveConfirm(false);
  };

  const handleCreateAppointment = async () => {
    if (!selectedPatientId || !currentUser) return;
    
    const newAppt: Appointment = {
      id: `A-${Math.random().toString(36).substr(2, 9)}`,
      patientId: selectedPatientId,
      date: apptForm.date,
      notes: apptForm.notes,
      doctorId: currentUser.id,
      status: 'scheduled'
    };
    
    setAppointments(prev => [...prev, newAppt]);
    setIsCreatingAppt(false);
    setApptForm({
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleCreateRecord = async () => {
    if (!selectedPatientId || !currentUser) return;
    
    const newRecord: MedicalRecord = {
      id: `R-${Math.random().toString(36).substr(2, 9)}`,
      patientId: selectedPatientId,
      doctorId: currentUser.id,
      diagnosis: recordForm.diagnosis,
      prescription: recordForm.prescription,
      clinicalHistory: {
        presentingComplaint: recordForm.presentingComplaint,
        familyHistory: recordForm.familyHistory,
        socialHistory: recordForm.socialHistory,
        vitals: {
          bp: recordForm.vitalsBp,
          temp: recordForm.vitalsTemp,
          pulse: recordForm.vitalsPulse,
        }
      },
      createdAt: new Date().toISOString()
    };

    setMedicalRecords(prev => [...prev, newRecord]);

    if (recordForm.generateBillAmount) {
      const newBill: Bill = {
        id: `B-${Math.random().toString(36).substr(2, 9)}`,
        patientId: selectedPatientId,
        amount: parseFloat(recordForm.generateBillAmount),
        status: 'unpaid',
        issuedDate: new Date().toISOString(),
        currency: 'ETB'
      };
      setBilling(prev => [...prev, newBill]);
    }

    setIsCreatingRecord(false);
    setRecordForm({
      diagnosis: '',
      prescription: '',
      presentingComplaint: '',
      familyHistory: '',
      socialHistory: '',
      vitalsBp: '',
      vitalsTemp: '',
      vitalsPulse: '',
      generateBillAmount: '500',
    });
  };

  const handlePayBill = (billId: string) => {
    setBilling(prev => prev.map(b => 
      b.id === billId ? { ...b, status: 'paid' } : b
    ));
  };

  const handleCompleteAppt = (apptId: string) => {
    setAppointments(prev => prev.map(a => 
      a.id === apptId ? { ...a, status: 'completed' } : a
    ));
  };

  const filteredPatients = patients.filter(p => {
    const query = search.toLowerCase();
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(query) || 
           p.id.toString().includes(query) || 
           (p.bloodGroup || '').toLowerCase().includes(query) ||
           (p.status || '').toLowerCase().includes(query);
  });

  if (loading) return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-50/50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Initializing Nexus Registry...</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
      
      {/* Registry Sidebar */}
      <div className={cn(
        "flex-col lg:w-96 bg-white border border-slate-200/60 rounded-3xl shrink-0 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300",
        selectedPatientId ? "hidden lg:flex" : "flex w-full"
      )}>
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Patient Registry</h3>
               <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hospital Management Unit</p>
             </div>
             {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && (
               <button className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95">
                 <Plus className="w-5 h-5" />
               </button>
             )}
          </div>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Deep Search: Name, ID, Blood, Status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-slate-50/10">
          {filteredPatients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group",
                selectedPatientId === p.id 
                  ? "bg-primary-50 border-primary-200 shadow-sm" 
                  : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-colors",
                selectedPatientId === p.id ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
              )}>
                {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{p.firstName} {p.lastName}</h4>
                  <span className="text-[10px] font-mono text-slate-400 font-bold tracking-tighter">#{p.id.toString().substring(0, 6).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{p.bloodGroup || 'N/A'}</span>
                </div>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-all opacity-0 group-hover:opacity-100", selectedPatientId === p.id ? "text-primary-600 opacity-100 translate-x-1" : "text-slate-300")} />
            </button>
          ))}
        </div>
      </div>

      {/* Profile Detail Pane */}
      <div className={cn(
        "flex-1 bg-white border border-slate-200/60 rounded-3xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300",
        !selectedPatientId ? "hidden lg:flex" : "flex h-full"
      )}>
        <AnimatePresence mode="wait">
          {!selectedPatientId ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 border border-slate-100 rounded-full rotate-45 scale-110"></div>
                 <div className="absolute inset-0 border border-slate-100 rounded-full -rotate-12 scale-125"></div>
                 <Stethoscope className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Hospital Information System</h3>
              <p className="text-slate-500 max-w-sm text-sm font-medium">Select a patient from the registry to access their clinical records, history, and financial billing profile.</p>
              
              <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                  <Droplet className="w-5 h-5 text-rose-500 mb-3" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Blood Registry</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Integrated cross-match verification enabled for all surgical candidates.</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                  <ShieldAlert className="w-5 h-5 text-amber-500 mb-3" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Clinical Alerts</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Real-time monitoring for critical status and severe allergy markers.</p>
                </div>
              </div>
            </motion.div>
          ) : !history ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
               <div className="w-8 h-8 border-4 border-slate-100 border-t-primary-500 rounded-full animate-spin"></div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Retrieving Health Data...</p>
            </div>
          ) : (
            <motion.div 
               key={selectedPatientId}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 flex flex-col h-full"
            >
              {/* Profile Header */}
              <header className="p-8 border-b border-slate-100 bg-slate-50/50 relative">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary-500/30">
                      {history.patient.firstName.charAt(0)}{history.patient.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                          {history.patient.firstName} {history.patient.lastName}
                        </h2>
                        <StatusBadge status={history.patient.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary-500" /> {history.patient.address}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary-500" /> {history.patient.contact}</span>
                        <span className="text-primary-600">MRN: {history.patient.id.toString().substring(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="sm:hidden p-3 bg-white border border-slate-200 rounded-xl" onClick={() => setSelectedPatientId(null)}>
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="hidden sm:flex p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {(history.patient.status === 'critical' || (history.patient.allergies && history.patient.allergies.length > 0)) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pt-6 overflow-hidden"
                    >
                      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-600/20">
                            <ShieldAlert className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-rose-800 font-bold text-base tracking-tight mb-1">Critical Clinical Alerts</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {history.patient.status === 'critical' && (
                                <span className="text-rose-700 text-xs font-bold flex items-center gap-1.5">
                                  <Activity className="w-3.5 h-3.5" /> PATIENT IS IN CRITICAL CONDITION
                                </span>
                              )}
                              {history.patient.allergies && history.patient.allergies.length > 0 && (
                                <span className="text-rose-700 text-xs font-bold flex items-center gap-1.5">
                                  <Droplet className="w-3.5 h-3.5" /> SEVERE ALLERGIES DETECTED: {history.patient.allergies.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/80 p-4 rounded-2xl border border-rose-100/50 backdrop-blur-sm">
                          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                             <Phone className="w-3 h-3" /> Emergency Contact
                          </p>
                          <p className="text-sm font-black text-rose-800 tracking-tight">
                            {history.patient.emergencyContact || 'None Recorded'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-1 mt-10 p-1 bg-slate-200/50 rounded-2xl w-fit border border-slate-200/50 overflow-x-auto max-w-full custom-scrollbar-hide">
                  {[
                    { id: 'clinical', label: 'Clinical History', icon: Stethoscope },
                    { id: 'appointments', label: 'Appointments', icon: Calendar },
                    { id: 'billing', label: 'Financial Records', icon: CreditCard },
                    { id: 'info', label: 'Identity & Bios', icon: Info },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-tight uppercase transition-all whitespace-nowrap",
                        activeTab === tab.id 
                          ? "bg-white text-primary-700 shadow-sm shadow-slate-200/50" 
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary-500" : "text-slate-400")} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </header>

              {/* View Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                
                {/* --- Clinical History --- */}
                {activeTab === 'clinical' && (
                  <div className="space-y-10 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                              <Droplet className="w-3 h-3 text-rose-500" /> Blood Group
                            </p>
                            <p className="text-2xl font-black text-rose-600">{history.patient.blood_group || 'O+'}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-emerald-600 uppercase mb-0.5 tracking-tighter">Verified</p>
                             <div className="w-2 h-2 bg-emerald-500 rounded-full ml-auto"></div>
                          </div>
                       </div>
                       <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <ShieldAlert className="w-3 h-3 text-amber-500" /> Allergies
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {history.patient.allergies && history.patient.allergies.length > 0 ? history.patient.allergies.map(a => (
                              <span key={a} className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-100 uppercase tracking-wide">{a}</span>
                            )) : <span className="text-xs font-bold text-slate-400 italic">No allergies documented</span>}
                          </div>
                       </div>
                       <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Vitals Check</p>
                          <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary-500" /> 2026-04-16
                          </p>
                       </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-lg tracking-tight flex items-center gap-3">
                          <Activity className="w-5 h-5 text-primary-500" />
                          EMR Clinical History
                        </h4>
                        {currentUser?.role === 'doctor' && (
                          <button 
                            onClick={() => setIsCreatingRecord(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 shadow-xl shadow-slate-900/10 text-white text-[11px] font-bold rounded-xl active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Start New Consultation
                          </button>
                        )}
                      </div>

                      <div className="relative border-l-2 border-slate-100 ml-5 pl-10 space-y-12">
                        {history.records.length === 0 ? (
                          <div className="text-slate-300 text-sm py-12 italic font-medium">Nexus EMR initialized: No previous clinical records detected.</div>
                        ) : [...history.records].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((record) => (
                          <div key={record.id} className="relative">
                            <div className="absolute -left-[51px] top-4 w-6 h-6 bg-white border-4 border-primary-500 rounded-full z-10 shadow-sm shadow-primary-500/20"></div>
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.04)] transition-all duration-300">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                                <div>
                                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-2">Diagnosis</span>
                                  <h5 className="font-black text-slate-900 text-2xl tracking-tighter decoration-primary-500 underline underline-offset-4 decoration-2">{record.diagnosis}</h5>
                                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-4">
                                    <Clock className="w-3.5 h-3.5" /> Session Date: {new Date(record.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="md:text-right flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                   <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                      <Stethoscope className="w-5 h-5" />
                                   </div>
                                   <div className="text-left">
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Medical Officer</p>
                                      <p className="text-xs font-bold text-slate-800">Assigned Practitioner</p>
                                   </div>
                                </div>
                              </div>
                              
                              {record.clinicalHistory && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                  <div className="space-y-6">
                                    <div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">History of Presenting Complaint</p>
                                      <p className="text-sm text-slate-700 leading-relaxed font-semibold italic border-l-4 border-slate-200 pl-4 py-1">"{record.clinicalHistory.presentingComplaint}"</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Family History</p>
                                        <p className="text-xs font-bold text-slate-600 leading-normal">{record.clinicalHistory.familyHistory || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Social History</p>
                                        <p className="text-xs font-bold text-slate-600 leading-normal">{record.clinicalHistory.socialHistory || 'N/A'}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white shadow-xl shadow-slate-900/10 h-fit">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                                      <Activity className="w-3.5 h-3.5" /> Vital Signs Assessment (Metric)
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                       <div className="text-center group">
                                         <p className="text-[9px] text-slate-500 uppercase font-black mb-1 group-hover:text-primary-400 transition-colors">BP (Sys/Dia)</p>
                                         <p className="text-lg font-black text-white font-mono tracking-tighter">{record.clinicalHistory.vitals.bp}</p>
                                       </div>
                                       <div className="text-center border-x border-slate-800 px-2 group">
                                         <p className="text-[9px] text-slate-500 uppercase font-black mb-1 group-hover:text-primary-400 transition-colors">Temp (°C)</p>
                                         <p className="text-lg font-black text-white font-mono tracking-tighter">{record.clinicalHistory.vitals.temp}</p>
                                       </div>
                                       <div className="text-center group">
                                         <p className="text-[9px] text-slate-500 uppercase font-black mb-1 group-hover:text-primary-400 transition-colors">Pulse (BPM)</p>
                                         <p className="text-lg font-black text-white font-mono tracking-tighter">{record.clinicalHistory.vitals.pulse}</p>
                                       </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-3 mb-4">
                                   <FileText className="w-4 h-4 text-emerald-500" />
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Prescription / Protocol</p>
                                </div>
                                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                                  <span className="text-sm font-black text-emerald-800 tracking-tight">{record.prescription}</span>
                                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg uppercase">Pharma Confirmed</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Appointments --- */}
                {activeTab === 'appointments' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="font-bold text-slate-800 text-lg flex items-center gap-3">
                         <Calendar className="w-5 h-5 text-primary-500" /> Clinic Scheduling Management
                       </h4>
                       {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && (
                         <button 
                           onClick={() => setIsCreatingAppt(true)}
                           className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-[11px] font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-primary-500/20"
                         >
                           Create Appointment
                         </button>
                       )}
                    </div>
                    {history.appointments.length === 0 ? (
                      <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest italic">No clinical sessions on record</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[...history.appointments].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(appt => (
                          <div key={appt.id} className="p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex items-center justify-between group hover:border-primary-200 transition-all">
                            <div className="flex items-center gap-5">
                              <div className={cn(
                                "w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm transition-all",
                                appt.status === 'completed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-primary-50 text-primary-600 border border-primary-100"
                              )}>
                                <span className="text-[10px] uppercase font-black">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-xl leading-none font-black">{new Date(appt.date).getDate()}</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{appt.notes || 'Routine Medical Visit'}</p>
                                <p className="text-xs text-slate-400 font-bold font-mono mt-1">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className={cn(
                                "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                appt.status === 'completed' ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                              )}>
                                {appt.status}
                              </span>
                              {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist' || currentUser?.role === 'doctor') && appt.status !== 'completed' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCompleteAppt(appt.id); }}
                                  className="text-[9px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest underline decoration-primary-300 underline-offset-2"
                                >
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* --- Billing --- */}
                {activeTab === 'billing' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="font-bold text-slate-800 text-lg flex items-center gap-3">
                         <CreditCard className="w-5 h-5 text-primary-500" /> Fiscal Ledger (ETB Currency)
                       </h4>
                       <div className="px-6 py-3 bg-slate-900 shadow-2xl shadow-slate-900/10 text-white rounded-2xl flex flex-col items-end">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Accounts Receivable</span>
                         <span className="text-xl font-black font-mono tracking-tighter text-primary-400">
                           {FormatCurrency(history.billing.reduce((acc, b) => acc + b.amount, 0))}
                         </span>
                       </div>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Fisc. Trans. ID</th>
                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Issue Date</th>
                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Value (Birr)</th>
                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</th>
                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Action</th>                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {history.billing.length === 0 ? (
                            <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px] italic">No financial transactions detected</td></tr>
                          ) : [...history.billing].sort((a,b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()).map(bill => (
                            <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6 font-mono font-black text-slate-900 text-xs tracking-tighter">#NEX-{bill.id.toString().substring(0, 6).toUpperCase()}</td>
                              <td className="px-8 py-6 font-bold text-slate-500">{new Date(bill.issuedDate).toLocaleDateString()}</td>
                              <td className="px-8 py-6 text-right font-black text-slate-900 font-mono text-base tracking-tighter">
                                {FormatCurrency(bill.amount)}
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className={cn(
                                  "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                  bill.status === 'paid' ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-rose-100 text-rose-800 border-rose-200 animate-pulse"
                                )}>
                                  {bill.status}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && bill.status === 'unpaid' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handlePayBill(bill.id); }}
                                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- Identity & Bios --- */}
                {activeTab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                     <section>
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
                           Demographic Profile
                           <div className="flex gap-2">
                             {isEditing ? (
                               <>
                                 <button 
                                   onClick={() => setIsEditing(false)} 
                                   className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-200 transition-colors"
                                 >
                                   Cancel
                                 </button>
                                 <button 
                                   onClick={handleSaveAttempt} 
                                   className="px-3 py-1 bg-primary-600 text-white rounded-lg text-[10px] font-bold uppercase shadow-sm hover:bg-primary-700 transition-colors"
                                 >
                                   Save Changes
                                 </button>
                               </>
                             ) : (
                               (currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && (
                                 <button 
                                   onClick={handleEditInit} 
                                   className="px-3 py-1 bg-white border border-slate-200 text-primary-600 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 transition-colors"
                                 >
                                   Edit
                                 </button>
                               )
                             )}
                             <User className="w-3.5 h-3.5 ml-2 self-center" />
                           </div>
                        </h5>
                        <div className="space-y-6">
                           {[
                             { label: 'Legal Given Name', key: 'first_name', value: history.patient.first_name, mono: false },
                             { label: 'Legal Family Name', key: 'last_name', value: history.patient.last_name, mono: false },
                             { label: 'Temporal Marker (DOB)', key: 'dob', value: history.patient.dob, mono: true, type: 'date' },
                             { label: 'Gender Marker', value: history.patient.gender === 'M' ? 'Male (M)' : 'Female (F)', mono: false, readOnly: true },
                             { label: 'Primary Blood Group', value: history.patient.blood_group || 'O+', mono: true, highlight: 'text-rose-600', readOnly: true }
                           ].map((item, i) => (
                             <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 group hover:border-primary-100 transition-colors">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
                               {isEditing && !item.readOnly ? (
                                 <input 
                                   type={item.type || 'text'}
                                   value={(editForm as any)[item.key!] || ''}
                                   onChange={e => setEditForm({ ...editForm, [item.key!]: e.target.value })}
                                   className="text-sm font-black text-slate-800 tracking-tight text-right bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-full max-w-[180px]"
                                 />
                               ) : (
                                 <span className={cn("text-sm font-black text-slate-800 tracking-tight text-right", item.mono && "font-mono", item.highlight)}>{item.value}</span>
                               )}
                             </div>
                           ))}
                        </div>
                     </section>
                     
                     <section>
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-3 flex items-center justify-between">
                           Communications & Logistics
                           <Phone className="w-3.5 h-3.5" />
                        </h5>
                        <div className="space-y-6 mb-10">
                           <div className="flex justify-between items-start py-2 border-b border-slate-50 group hover:border-primary-100 transition-colors">
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-tight mt-1">Residential Address</span>
                             {isEditing ? (
                               <textarea 
                                 value={editForm.address || ''}
                                 onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                 className="text-sm font-bold text-slate-800 tracking-tight text-right bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-full max-w-[220px] h-24 resize-none"
                               />
                             ) : (
                               <span className="text-sm font-bold text-slate-800 tracking-tight text-right max-w-[220px] leading-relaxed uppercase">{history.patient.address}</span>
                             )}
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-slate-50 group hover:border-primary-100 transition-colors">
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Direct Contact Dial</span>
                             {isEditing ? (
                               <div className="flex flex-col items-end gap-1.5 w-full max-w-[180px]">
                                 <input 
                                   type="text"
                                   value={editForm.contact || ''}
                                   onChange={e => setEditForm({ ...editForm, contact: e.target.value })}
                                   className={cn(
                                     "text-sm font-black text-slate-800 tracking-tight text-right bg-slate-50 px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 font-mono w-full",
                                     validationError ? "border-rose-300 ring-rose-500/10 focus:ring-rose-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                   )}
                                 />
                                 {validationError && (
                                   <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                     {validationError}
                                   </span>
                                 )}
                               </div>
                             ) : (
                               <span className="text-sm font-black text-slate-800 font-mono">{history.patient.contact}</span>
                             )}
                           </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                           <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"></div>
                           <h6 className="text-sm font-black mb-2 uppercase tracking-tight">Hospital System Action</h6>
                           <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-6 leading-relaxed">Secure data export: Unified Medical Record (UMR) generation for legal or transfer documentation.</p>
                           <button className="w-full py-3.5 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-50 hover:text-primary-700 transition-all shadow-xl shadow-black/20 active:scale-95">
                              Generate Clinical Portfolio
                           </button>
                        </div>
                     </section>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl shadow-black/30 border border-slate-100"
            >
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2 tracking-tight">Confirm Data Integrity</h3>
              <p className="text-slate-500 text-center text-sm font-medium mb-8">
                Are you sure you want to commit these demographic modifications to the central clinical registry? This action is permanent.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowSaveConfirm(false)}
                  className="py-3 px-4 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={performSave}
                  className="py-3 px-4 bg-primary-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
                >
                  Verify & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment Creation Modal */}
      <AnimatePresence>
        {isCreatingAppt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingAppt(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-black/30 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Schedule Session</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Patient MRN: #{selectedPatientId?.toString().padStart(6, '0')}</p>
                 </div>
                 <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                 </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Appointment Date</label>
                  <input 
                    type="date"
                    value={apptForm.date}
                    onChange={e => setApptForm({ ...apptForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Notes / Reason</label>
                  <textarea 
                    placeholder="Brief description of consultation reason..."
                    value={apptForm.notes}
                    onChange={e => setApptForm({ ...apptForm, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all h-32 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button 
                  onClick={() => setIsCreatingAppt(false)}
                  className="py-3.5 px-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleCreateAppointment}
                  className="py-3.5 px-4 bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
                >
                  Confirm Slot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Doctor Consultation EMR Modal */}
      <AnimatePresence>
        {isCreatingRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingRecord(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-slate-100 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                 <div>
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Consultation Form</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Patient MRN: #{selectedPatientId?.toString().padStart(6, '0')}</p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIsCreatingRecord(false)}
                      className="py-2.5 px-6 bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={handleCreateRecord}
                      className="py-2.5 px-6 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5" /> Finalize Record
                    </button>
                 </div>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2"><FileText className="w-3.5 h-3.5" /> Diagnosis</label>
                      <input 
                        type="text"
                        placeholder="e.g., Acute Bronchitis"
                        value={recordForm.diagnosis}
                        onChange={e => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">History of Presenting Complaint</label>
                      <textarea 
                        placeholder="Details of symptoms..."
                        value={recordForm.presenting_complaint}
                        onChange={e => setRecordForm({ ...recordForm, presenting_complaint: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all h-28 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Family History</label>
                        <textarea 
                          value={recordForm.family_history}
                          onChange={e => setRecordForm({ ...recordForm, family_history: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all h-20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Social History</label>
                        <textarea 
                          value={recordForm.social_history}
                          onChange={e => setRecordForm({ ...recordForm, social_history: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 transition-all h-20 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" /> Vital Signs Assessment
                      </h4>
                      <div className="grid grid-cols-3 gap-3 relative z-10">
                        <div>
                           <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">BP (Sys/Dia)</label>
                           <input 
                             type="text"
                             placeholder="120/80"
                             value={recordForm.vitals_bp}
                             onChange={e => setRecordForm({ ...recordForm, vitals_bp: e.target.value })}
                             className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:bg-white/20 transition-all font-mono text-center placeholder:text-white/20"
                           />
                        </div>
                        <div>
                           <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 flex items-center gap-1 justify-center"><Droplet className="w-3 h-3" /> Temp (°C)</label>
                           <input 
                             type="number"
                             step="0.1"
                             placeholder="36.5"
                             value={recordForm.vitals_temp}
                             onChange={e => setRecordForm({ ...recordForm, vitals_temp: e.target.value })}
                             className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:bg-white/20 transition-all font-mono text-center placeholder:text-white/20"
                           />
                        </div>
                        <div>
                           <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 flex items-center gap-1 justify-end">Pulse <Clock className="w-3 h-3" /></label>
                           <input 
                             type="number"
                             placeholder="72"
                             value={recordForm.vitals_pulse}
                             onChange={e => setRecordForm({ ...recordForm, vitals_pulse: e.target.value })}
                             className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:bg-white/20 transition-all font-mono text-center placeholder:text-white/20"
                           />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-2"><FileText className="w-3.5 h-3.5" /> Digital Prescription</label>
                      <textarea 
                        placeholder="Rx Details..."
                        value={recordForm.prescription}
                        onChange={e => setRecordForm({ ...recordForm, prescription: e.target.value })}
                        className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-bold text-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all h-28 resize-none placeholder:text-emerald-300/50"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-[11px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" /> Auto-Generate Consultation Bill
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          value={recordForm.generateBillAmount}
                          onChange={e => setRecordForm({ ...recordForm, generateBillAmount: e.target.value })}
                          className="bg-amber-50 border border-amber-200 text-amber-900 font-black font-mono w-24 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                        <span className="text-xs font-bold text-amber-700 uppercase">ETB (Ethiopian Birr)</span>
                      </div>
                      <p className="text-[10px] text-amber-600/60 font-semibold mt-1">Set to 0 to skip automatic billing for this session.</p>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
