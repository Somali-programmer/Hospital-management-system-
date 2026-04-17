// --- Mock Data Layer for Frontend-only Project ---

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  contact: string;
  address: string;
  bloodGroup?: string;
  allergies?: string[];
  status: 'active' | 'stable' | 'critical';
  emergencyContact?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  diagnosis: string;
  prescription: string;
  createdAt: string;
  clinicalHistory: {
    presentingComplaint: string;
    familyHistory: string;
    socialHistory: string;
    vitals: {
      bp: string;
      temp: string;
      pulse: string;
    };
  };
}

export interface Billing {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  status: 'paid' | 'unpaid';
  issuedDate: string;
  currency: string;
}

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: 'P001', 
    firstName: 'Abdifatah', 
    lastName: 'Abdi Maygag', 
    dob: '1985-03-12', 
    gender: 'M', 
    contact: '+251 91 123 4567', 
    address: 'Bole Road, Addis Ababa',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    status: 'active',
    emergencyContact: 'Mariam Maygag (+251 91 000 1111)'
  },
  { 
    id: 'P002', 
    firstName: 'Abdirahman', 
    lastName: 'Omer Aden', 
    dob: '1990-11-20', 
    gender: 'M', 
    contact: '+251 92 234 5678', 
    address: 'Kazanchis, Addis Ababa',
    bloodGroup: 'A-',
    allergies: ['Peanuts'],
    status: 'active',
    emergencyContact: 'Ahmed Omer (+251 92 000 2222)'
  },
  { 
    id: 'P003', 
    firstName: 'Suber', 
    lastName: 'Dini Abdulahi', 
    dob: '1978-05-30', 
    gender: 'M', 
    contact: '+251 93 345 6789', 
    address: 'Sarbet, Addis Ababa',
    bloodGroup: 'B+',
    allergies: ['Dust', 'Pollen'],
    status: 'critical',
    emergencyContact: 'Samira Dini (+251 93 000 3333)'
  },
  { 
    id: 'P004', 
    firstName: 'Mohamed', 
    lastName: 'Bade Nour', 
    dob: '1995-07-15', 
    gender: 'M', 
    contact: '+251 94 456 7890', 
    address: 'Piazza, Addis Ababa',
    bloodGroup: 'AB+',
    allergies: [],
    status: 'active',
    emergencyContact: 'Fatumo Bade (+251 94 000 4444)'
  },
  { 
    id: 'P005', 
    firstName: 'Mohamed', 
    lastName: 'Abdi Kayre', 
    dob: '1982-12-05', 
    gender: 'M', 
    contact: '+251 95 567 8901', 
    address: 'Old Airport, Addis Ababa',
    bloodGroup: 'O-',
    allergies: ['Dairy'],
    status: 'stable',
    emergencyContact: 'Hassan Abdi (+251 95 000 5555)'
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'A001', patientId: 'P001', doctorId: 'D001', date: '2026-04-10T09:00:00Z', status: 'completed', notes: 'Hypertension follow-up' },
  { id: 'A002', patientId: 'P002', doctorId: 'D001', date: '2026-04-12T10:30:00Z', status: 'completed', notes: 'Persistent cough and fever' },
  { id: 'A003', patientId: 'P003', doctorId: 'D001', date: '2026-04-15T14:00:00Z', status: 'completed', notes: 'Emergency abdominal pain' },
  { id: 'A004', patientId: 'P004', doctorId: 'D001', date: '2026-04-16T11:00:00Z', status: 'completed', notes: 'Routine wellness check' },
  { id: 'A005', patientId: 'P005', doctorId: 'D001', date: '2026-04-14T08:30:00Z', status: 'completed', notes: 'Diabetes management' },
  { id: 'A006', patientId: 'P001', doctorId: 'D001', date: '2026-04-25T10:00:00Z', status: 'scheduled', notes: 'Follow-up BP check' },
];

export const MOCK_RECORDS: MedicalRecord[] = [
  { 
    id: 'R001', 
    patientId: 'P001', 
    doctorId: 'D001', 
    appointmentId: 'A001', 
    diagnosis: 'Hypertension Stage 2', 
    prescription: 'Amlodipine 5mg QD, Lisinopril 10mg QD', 
    createdAt: '2026-04-10T10:00:00Z',
    clinicalHistory: {
      presentingComplaint: 'Routine follow-up for chronic high blood pressure. Occasional dizziness.',
      familyHistory: 'Father had early onset heart disease and stroke.',
      socialHistory: 'Sedentary desk job, high salt intake, moderate caffeine.',
      vitals: { bp: '155/98', temp: '36.6°C', pulse: '78 bpm' }
    }
  },
  { 
    id: 'R002', 
    patientId: 'P002', 
    doctorId: 'D001', 
    appointmentId: 'A002', 
    diagnosis: 'Acute Bronchitis', 
    prescription: 'Amoxicillin 500mg TID, Salbutamol Inhaler PRN', 
    createdAt: '2026-04-12T11:30:00Z',
    clinicalHistory: {
      presentingComplaint: 'Non-productive cough for 5 days, chest tightness, low grade fever.',
      familyHistory: 'Sister has bronchial asthma.',
      socialHistory: 'Current smoker (5/day), works in a warehouse with dust exposure.',
      vitals: { bp: '122/82', temp: '38.2°C', pulse: '88 bpm' }
    }
  },
];

export const MOCK_BILLING: Billing[] = [
  { id: 'B001', patientId: 'P001', appointmentId: 'A001', amount: 650.00, status: 'paid', issuedDate: '2026-04-10T10:05:00Z', currency: 'ETB' },
  { id: 'B002', patientId: 'P002', appointmentId: 'A002', amount: 950.00, status: 'paid', issuedDate: '2026-04-12T11:40:00Z', currency: 'ETB' },
  { id: 'B003', patientId: 'P003', appointmentId: 'A003', amount: 15400.00, status: 'unpaid', issuedDate: '2026-04-15T16:30:00Z', currency: 'ETB' },
  { id: 'B004', patientId: 'P004', appointmentId: 'A004', amount: 450.00, status: 'paid', issuedDate: '2026-04-16T12:15:00Z', currency: 'ETB' },
  { id: 'B005', patientId: 'P005', appointmentId: 'A005', amount: 1200.00, status: 'unpaid', issuedDate: '2026-04-14T10:00:00Z', currency: 'ETB' },
];
