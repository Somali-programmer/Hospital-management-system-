import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthProfile {
  id: string;
  uid: string;
  name: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'pharmacist' | 'laboratorian';
  username?: string;
  email: string;
}

interface AuthContextType {
  user: any | null;
  profile: AuthProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  login: async () => {},
  logout: async () => {}
});

const DEFAULT_PROFILES: Record<string, AuthProfile> = {
  'admin1': { id: 'U001', uid: 'U001', name: 'Alice Admin', role: 'admin', username: 'admin1', email: 'admin@ahis.com' },
  'doctor1': { id: 'U002', uid: 'U002', name: 'Dr. Bob Smith', role: 'doctor', username: 'doctor1', email: 'doctor@ahis.com' },
  'rec1': { id: 'U003', uid: 'U003', name: 'Carol Reception', role: 'receptionist', username: 'rec1', email: 'receptionist@ahis.com' },
  'pharm1': { id: 'U004', uid: 'U004', name: 'David Pharmacy', role: 'pharmacist', username: 'pharm1', email: 'pharm@ahis.com' },
  'lab1': { id: 'U005', uid: 'U005', name: 'Eve Lab', role: 'laboratorian', username: 'lab1', email: 'lab@ahis.com' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Check local storage for session
    const savedProfile = localStorage.getItem('ahis_session');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
    setIsAuthReady(true);
  }, []);

  const login = async (username: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userProfile = DEFAULT_PROFILES[username] || DEFAULT_PROFILES['admin1'];
    setProfile(userProfile);
    localStorage.setItem('ahis_session', JSON.stringify(userProfile));
    setLoading(false);
  };

  const logout = async () => {
    setProfile(null);
    localStorage.removeItem('ahis_session');
  };

  return (
    <AuthContext.Provider value={{ user: profile, profile, loading, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
