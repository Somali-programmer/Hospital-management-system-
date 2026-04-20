import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Patient, 
  Appointment, 
  MedicalRecord, 
  Billing, 
  Doctor, 
  Medicine, 
  LabTest, 
  Staff,
  Prescription,
  MOCK_PATIENTS,
  MOCK_APPOINTMENTS,
  MOCK_RECORDS,
  MOCK_BILLING,
  MOCK_DOCTORS,
  MOCK_MEDICINES,
  MOCK_LAB_TESTS,
  MOCK_STAFF,
  MOCK_PRESCRIPTIONS
} from '../lib/mockData';

interface DataContextType {
  patients: Patient[];
  appointments: Appointment[];
  records: MedicalRecord[];
  billing: Billing[];
  doctors: Doctor[];
  medicines: Medicine[];
  labTests: LabTest[];
  staff: Staff[];
  prescriptions: Prescription[];
  
  // Create actions
  addPatient: (patient: Omit<Patient, 'id'>) => string;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  addBill: (bill: Omit<Billing, 'id'>) => void;
  updateBill: (id: string, data: Partial<Billing>) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateMedicine: (id: string, data: Partial<Medicine>) => void;
  addLabTest: (test: Omit<LabTest, 'id'>) => string;
  updateLabTest: (id: string, data: Partial<LabTest>) => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => string;
  updatePrescription: (id: string, data: Partial<Prescription>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [billing, setBilling] = useState<Billing[]>(MOCK_BILLING);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [labTests, setLabTests] = useState<LabTest[]>(MOCK_LAB_TESTS);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);

  const addPatient = (data: Omit<Patient, 'id'>) => {
    const newId = `P00${patients.length + 1}`;
    const newPatient = { ...data, id: newId };
    setPatients([...patients, newPatient]);
    return newId;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const newApp = { ...data, id: `A00${appointments.length + 1}` };
    setAppointments([...appointments, newApp]);
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const addRecord = (data: Omit<MedicalRecord, 'id'>) => {
    const newRecord = { ...data, id: `R00${records.length + 1}` };
    setRecords([...records, newRecord]);
  };

  const addBill = (data: Omit<Billing, 'id'>) => {
    const newBill = { ...data, id: `B00${billing.length + 1}` };
    setBilling([...billing, newBill]);
  };

  const updateBill = (id: string, data: Partial<Billing>) => {
    setBilling(billing.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const addDoctor = (data: Omit<Doctor, 'id'>) => {
    const newDoc = { ...data, id: `D00${doctors.length + 1}` };
    setDoctors([...doctors, newDoc]);
  };

  const updateMedicine = (id: string, data: Partial<Medicine>) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const addLabTest = (data: Omit<LabTest, 'id'>) => {
    const newId = `L00${labTests.length + 1}`;
    const newTest = { ...data, id: newId };
    setLabTests([...labTests, newTest]);
    return newId;
  };

  const updateLabTest = (id: string, data: Partial<LabTest>) => {
    setLabTests(labTests.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const addPrescription = (data: Omit<Prescription, 'id'>) => {
    const newId = `PR00${prescriptions.length + 1}`;
    const newPrescription = { ...data, id: newId };
    setPrescriptions([...prescriptions, newPrescription]);
    return newId;
  };

  const updatePrescription = (id: string, data: Partial<Prescription>) => {
    setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, ...data } : p));
  };

  return (
    <DataContext.Provider value={{
      patients, appointments, records, billing, doctors, medicines, labTests, staff, prescriptions,
      addPatient, updatePatient, addAppointment, updateAppointment, addRecord, 
      addBill, updateBill, addDoctor, updateMedicine, addLabTest, updateLabTest,
      addPrescription, updatePrescription
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
