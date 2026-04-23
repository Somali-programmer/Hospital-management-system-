import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Loader2, Hospital } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login detail error:", err);
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-xl shadow-lg shadow-primary-500/20">
            <Hospital className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          FYP HMS
        </h2>
        <div className="mt-2 flex justify-center">
          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-full tracking-wider border border-slate-200">
            Cloud Integrated • Production Ready
          </span>
        </div>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          FYP Hospital Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-xl py-2.5 px-3 border transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block w-full sm:text-sm border-slate-200 rounded-xl py-2.5 px-3 border transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl font-bold border border-red-100 flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Haramaya University<br />
                College of Computing and Informatics
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                Note: This system requires a cloud account. Please authenticate with the credentials provided by your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
