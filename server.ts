import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'super-secret-ahis-key-2026'; // In production, this would be in .env

app.use(express.json());

// ==========================================
// DATA LAYER (Mocks for Relational DB - 3NF Architecture)
// ==========================================
// Representing PostgreSQL/MySQL tables
let users = [
  { id: 1, name: 'Alice Admin', role: 'admin', username: 'admin1', password: 'password' },
  { id: 2, name: 'Dr. Bob Smith', role: 'doctor', username: 'doctor1', password: 'password' },
  { id: 3, name: 'Carol Reception', role: 'receptionist', username: 'rec1', password: 'password' },
];

let patients = [
  { 
    id: 1, 
    first_name: 'Abdifatah', 
    last_name: 'Abdi Maygag', 
    dob: '1985-03-12', 
    gender: 'M', 
    contact: '+251 91 123 4567', 
    address: 'Bole Road, Addis Ababa',
    blood_group: 'O+',
    allergies: ['Penicillin'],
    status: 'active',
    emergency_contact: 'Mariam Maygag (+251 91 000 1111)'
  },
  { 
    id: 2, 
    first_name: 'Abdirahman', 
    last_name: 'Omer Aden', 
    dob: '1990-11-20', 
    gender: 'M', 
    contact: '+251 92 234 5678', 
    address: 'Kazanchis, Addis Ababa',
    blood_group: 'A-',
    allergies: ['Peanuts'],
    status: 'active',
    emergency_contact: 'Ahmed Omer (+251 92 000 2222)'
  },
  { 
    id: 3, 
    first_name: 'Suber', 
    last_name: 'Dini Abdulahi', 
    dob: '1978-05-30', 
    gender: 'M', 
    contact: '+251 93 345 6789', 
    address: 'Sarbet, Addis Ababa',
    blood_group: 'B+',
    allergies: ['Dust', 'Pollen'],
    status: 'critical',
    emergency_contact: 'Samira Dini (+251 93 000 3333)'
  },
  { 
    id: 4, 
    first_name: 'Mohamed', 
    last_name: 'Bade Nour', 
    dob: '1995-07-15', 
    gender: 'M', 
    contact: '+251 94 456 7890', 
    address: 'Piazza, Addis Ababa',
    blood_group: 'AB+',
    allergies: [],
    status: 'active',
    emergency_contact: 'Fatumo Bade (+251 94 000 4444)'
  },
  { 
    id: 5, 
    first_name: 'Mohamed', 
    last_name: 'Abdi Kayre', 
    dob: '1982-12-05', 
    gender: 'M', 
    contact: '+251 95 567 8901', 
    address: 'Old Airport, Addis Ababa',
    blood_group: 'O-',
    allergies: ['Dairy'],
    status: 'stable',
    emergency_contact: 'Hassan Abdi (+251 95 000 5555)'
  },
];

let appointments = [
  { id: 1, patient_id: 1, doctor_id: 2, date: '2026-04-10T09:00:00Z', status: 'completed', notes: 'Hypertension follow-up' },
  { id: 2, patient_id: 2, doctor_id: 2, date: '2026-04-12T10:30:00Z', status: 'completed', notes: 'Persistent cough and fever' },
  { id: 3, patient_id: 3, doctor_id: 2, date: '2026-04-15T14:00:00Z', status: 'completed', notes: 'Emergency abdominal pain' },
  { id: 4, patient_id: 4, doctor_id: 2, date: '2026-04-16T11:00:00Z', status: 'completed', notes: 'Routine wellness check' },
  { id: 5, patient_id: 5, doctor_id: 2, date: '2026-04-14T08:30:00Z', status: 'completed', notes: 'Diabetes management' },
  { id: 6, patient_id: 1, doctor_id: 2, date: '2026-04-25T10:00:00Z', status: 'scheduled', notes: 'Follow-up BP check' },
];

let medical_records = [
  { 
    id: 1, 
    patient_id: 1, 
    doctor_id: 2, 
    appointment_id: 1, 
    diagnosis: 'Hypertension Stage 2', 
    prescription: 'Amlodipine 5mg QD, Lisinopril 10mg QD', 
    created_at: '2026-04-10T10:00:00Z',
    clinical_history: {
      presenting_complaint: 'Routine follow-up for chronic high blood pressure. Occasional dizziness.',
      family_history: 'Father had early onset heart disease and stroke.',
      social_history: 'Sedentary desk job, high salt intake, moderate caffeine.',
      vitals: { bp: '155/98', temp: '36.6°C', pulse: '78 bpm' }
    }
  },
  { 
    id: 2, 
    patient_id: 2, 
    doctor_id: 2, 
    appointment_id: 2, 
    diagnosis: 'Acute Bronchitis', 
    prescription: 'Amoxicillin 500mg TID, Salbutamol Inhaler PRN', 
    created_at: '2026-04-12T11:30:00Z',
    clinical_history: {
      presenting_complaint: 'Non-productive cough for 5 days, chest tightness, low grade fever.',
      family_history: 'Sister has bronchial asthma.',
      social_history: 'Current smoker (5/day), works in a warehouse with dust exposure.',
      vitals: { bp: '122/82', temp: '38.2°C', pulse: '88 bpm' }
    }
  },
  { 
    id: 3, 
    patient_id: 3, 
    doctor_id: 2, 
    appointment_id: 3, 
    diagnosis: 'Acute Appendicitis (Resolved Post-Op)', 
    prescription: 'Ciprofloxacin 500mg BID, Metronidazole 400mg TID, Ibuprofen 400mg PRN', 
    created_at: '2026-04-15T16:00:00Z',
    clinical_history: {
      presenting_complaint: 'Sudden onset periumbilical pain radiating to RLQ, nausea and vomiting.',
      family_history: 'Unremarkable.',
      social_history: 'Active lifestyle, nonsmoker, occasionally consumes alcohol.',
      vitals: { bp: '115/70', temp: '37.8°C', pulse: '92 bpm' }
    }
  },
  { 
    id: 4, 
    patient_id: 4, 
    doctor_id: 2, 
    appointment_id: 4, 
    diagnosis: 'General Health Maintenance & Fatigue', 
    prescription: 'Multivitamins QD, Vitamin D3 2000IU QD', 
    created_at: '2026-04-16T12:00:00Z',
    clinical_history: {
      presenting_complaint: 'Annual check-up. Reports generalized weakness and low energy.',
      family_history: 'Mother has type 2 diabetes.',
      social_history: 'Non-smoker, balanced diet, exercises 3 times a week.',
      vitals: { bp: '110/72', temp: '36.5°C', pulse: '64 bpm' }
    }
  },
  { 
    id: 5, 
    patient_id: 5, 
    doctor_id: 2, 
    appointment_id: 5, 
    diagnosis: 'Type 2 Diabetes Mellitus', 
    prescription: 'Metformin 850mg BID, Gliclazide 30mg QD', 
    created_at: '2026-04-14T09:30:00Z',
    clinical_history: {
      presenting_complaint: 'Increased frequency of urination and excessive thirst over the last 3 weeks.',
      family_history: 'Strong family history of diabetes mellitus on maternal side.',
      social_history: 'Chef by profession, high exposure to sugary foods at workplace.',
      vitals: { bp: '138/86', temp: '36.9°C', pulse: '72 bpm' }
    }
  },
];

let billing = [
  { id: 1, patient_id: 1, appointment_id: 1, amount: 650.00, status: 'paid', issued_date: '2026-04-10T10:05:00Z', currency: 'ETB' },
  { id: 2, patient_id: 2, appointment_id: 2, amount: 950.00, status: 'paid', issued_date: '2026-04-12T11:40:00Z', currency: 'ETB' },
  { id: 3, patient_id: 3, appointment_id: 3, amount: 15400.00, status: 'unpaid', issued_date: '2026-04-15T16:30:00Z', currency: 'ETB' },
  { id: 4, patient_id: 4, appointment_id: 4, amount: 450.00, status: 'paid', issued_date: '2026-04-16T12:15:00Z', currency: 'ETB' },
  { id: 5, patient_id: 5, appointment_id: 5, amount: 1200.00, status: 'unpaid', issued_date: '2026-04-14T10:00:00Z', currency: 'ETB' },
];

// ==========================================
// SECURITY LAYER (JWT & RBAC Middleware)
// ==========================================
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function requireRole(roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
    }
    next();
  };
}

// ==========================================
// APPLICATION LAYER (API Endpoints)
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user.id, role: user.role, name: user.name } });
  } catch (err: any) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failure', details: err.message });
  }
});

// Patients (CRUD)
app.get('/api/patients', authenticateToken, requireRole(['admin', 'receptionist', 'doctor']), (req, res) => {
  res.json(patients);
});

app.post('/api/patients', authenticateToken, requireRole(['admin', 'receptionist']), (req, res) => {
  const newPatient = {
    id: patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

app.put('/api/patients/:id', authenticateToken, requireRole(['admin', 'receptionist']), (req, res) => {
  const patientId = parseInt(req.params.id);
  const patientIndex = patients.findIndex(p => p.id === patientId);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Update only allowed demographic fields
  const { first_name, last_name, dob, contact, address } = req.body;
  patients[patientIndex] = {
    ...patients[patientIndex],
    first_name: first_name || patients[patientIndex].first_name,
    last_name: last_name || patients[patientIndex].last_name,
    dob: dob || patients[patientIndex].dob,
    contact: contact || patients[patientIndex].contact,
    address: address || patients[patientIndex].address,
  };

  res.json(patients[patientIndex]);
});

app.get('/api/patients/:id/history', authenticateToken, requireRole(['admin', 'receptionist', 'doctor']), (req, res) => {
  const patientId = parseInt(req.params.id);
  const patient = patients.find(p => p.id === patientId);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const patientAppointments = appointments.filter(a => a.patient_id === patientId);
  const patientRecords = medical_records.filter(r => r.patient_id === patientId);
  const patientBilling = billing.filter(b => b.patient_id === patientId);

  res.json({
    patient,
    appointments: patientAppointments,
    records: patientRecords,
    billing: patientBilling
  });
});

// Appointments
app.get('/api/appointments', authenticateToken, (req: any, res: any) => {
  let result = appointments;
  if (req.user.role === 'doctor') {
    result = appointments.filter(a => a.doctor_id === req.user.id);
  }
  res.json(result);
});

app.post('/api/appointments', authenticateToken, requireRole(['admin', 'receptionist']), (req, res) => {
  const newAppt = {
    id: appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
    ...req.body,
    status: 'scheduled'
  };
  appointments.push(newAppt);
  res.status(201).json(newAppt);
});

app.put('/api/appointments/:id/status', authenticateToken, requireRole(['admin', 'receptionist', 'doctor']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appt = appointments.find(a => a.id === parseInt(id));
  if (appt) {
    appt.status = status;
    res.json(appt);
  } else {
    res.status(404).send('Not found');
  }
});

// Medical Records (EMR)
app.get('/api/records', authenticateToken, requireRole(['admin', 'doctor', 'receptionist']), (req, res) => {
  res.json(medical_records);
});

app.post('/api/records', authenticateToken, requireRole(['doctor']), (req: any, res: any) => {
  const newRecord = {
    id: medical_records.length ? Math.max(...medical_records.map(r => r.id)) + 1 : 1,
    doctor_id: req.user.id,
    created_at: new Date().toISOString(),
    ...req.body
  };
  medical_records.push(newRecord);
  
  // Auto-generate bill upon diagnosis if requested
  const billingAmount = req.body.generateBillAmount;
  if (billingAmount) {
    billing.push({
      id: billing.length ? Math.max(...billing.map(b => b.id)) + 1 : 1,
      patient_id: newRecord.patient_id,
      appointment_id: newRecord.appointment_id,
      amount: parseFloat(billingAmount),
      status: 'unpaid',
      issued_date: new Date().toISOString(),
      currency: 'ETB'
    });
  }
  
  res.status(201).json(newRecord);
});

// Billing
app.get('/api/billing', authenticateToken, requireRole(['admin', 'receptionist']), (req, res) => {
  res.json(billing);
});

app.put('/api/billing/:id/pay', authenticateToken, requireRole(['admin', 'receptionist']), (req, res) => {
  const { id } = req.params;
  const bill = billing.find(b => b.id === parseInt(id));
  if (bill) {
    bill.status = 'paid';
    res.json(bill);
  } else {
    res.status(404).send('Not found');
  }
});

// System Documentation Payload (Data Dictionary & Decomposition)
app.get('/api/docs/architecture', (req, res) => {
  res.json({
    decomposition: {
      presentation: "React.js Dashboards. Role-specific views (Admin, Doctor, Receptionist) with React Router & TailwindCSS.",
      application: "Node.js/Express handling Business Logic via REST APIs. JWT Auth & RBAC Middleware enforce security.",
      data: "Mocks simulating PostgreSQL 3NF. Tables: Users, Patients, Appointments, Medical_Records, Billing."
    },
    dataDictionary: [
      { table: 'Users', columns: 'id (PK), name (VARCHAR), role (ENUM), username (VARCHAR), password (HASH)' },
      { table: 'Patients', columns: 'id (PK), first_name, last_name, dob, gender, contact, blood_group, allergies, status' },
      { table: 'Appointments', columns: 'id (PK), patient_id (FK), doctor_id (FK), date, status, notes' },
      { table: 'Medical_Records', columns: 'id (PK), patient_id (FK), doctor_id (FK), clinical_history (JSON), diagnosis, prescription' },
      { table: 'Billing', columns: 'id (PK), patient_id, amount (DECIMAL), status, currency (ETB)' }
    ],
    flow: [
      "1. Receptionist logs in > Creates Patient > Book Appointment.",
      "2. Doctor logs in > Views Appointments > Conducts consult > Creates Medical Record (EMR).",
      "3. Billing automated via EMR completion > Receptionist collects payment."
    ]
  });
});

// ==========================================
// VITE MIDDLEWARE (PRESENTATION LAYER)
// ==========================================
// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server execution error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message, stack: err.stack });
});

export default app;
