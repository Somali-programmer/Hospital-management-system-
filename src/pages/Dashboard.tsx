import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import ReceptionistDashboard from '../components/dashboards/ReceptionistDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
          Signed in to your workspace as:
          <span className="font-bold text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
            {user.role}
          </span>
        </p>
      </div>

      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'doctor' && <DoctorDashboard />}
      {user.role === 'receptionist' && <ReceptionistDashboard />}
    </div>
  );
}
