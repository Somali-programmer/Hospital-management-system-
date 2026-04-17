import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('admin1');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login detail error:", err);
      setError("Invalid login simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Nexus AHIS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Automated Healthcare Information System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In Securely'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Demo Credentials</h4>
            <div className="space-y-2 text-sm text-gray-600 font-mono">
              <div className="flex justify-between hover:bg-gray-50 px-2 py-1 rounded cursor-pointer transition-colors" onClick={() => setUsername('admin1')}>
                <span><span className="font-semibold text-indigo-600">Admin:</span> admin1</span>
                <span>password</span>
              </div>
              <div className="flex justify-between hover:bg-gray-50 px-2 py-1 rounded cursor-pointer transition-colors" onClick={() => setUsername('doctor1')}>
                <span><span className="font-semibold text-green-600">Doctor:</span> doctor1</span>
                <span>password</span>
              </div>
              <div className="flex justify-between hover:bg-gray-50 px-2 py-1 rounded cursor-pointer transition-colors" onClick={() => setUsername('rec1')}>
                <span><span className="font-semibold text-blue-600">Reception:</span> rec1</span>
                <span>password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
