import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import ReceptionistDashboard from '../components/dashboards/ReceptionistDashboard';

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back, {profile.name}</h1>
        <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
          Signed in to your workspace as:
          <span className="font-bold text-xs bg-primary-50 text-blue-700 px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
            {profile.role}
          </span>
        </p>
      </div>

      {profile.role === 'admin' && <AdminDashboard />}
      {profile.role === 'doctor' && <DoctorDashboard />}
      {profile.role === 'receptionist' && <ReceptionistDashboard />}
    </div>
  );
}
