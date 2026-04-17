import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Docs from './pages/Docs.tsx';
import Patients from './pages/Patients.tsx';
import Placeholder from './pages/Placeholder.tsx';

// --- PROTECTED ROUTE ---
function RequireAuth({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.token || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// --- APP COMPONENT ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<RequireAuth roles={['admin']}><Docs /></RequireAuth>} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Placeholder title="Clinic Appointments" />} />
          <Route path="/billing" element={<RequireAuth roles={['admin', 'receptionist']}><Placeholder title="Financial Billing" /></RequireAuth>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
