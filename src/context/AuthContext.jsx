import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Demo users for the prototype
const DEMO_USERS = [
  {
    id: 'usr-001',
    name: 'Inspector Meera Sharma',
    email: 'meera@mha.gov.in',
    password: 'admin123',
    role: 'national_admin',
    designation: 'Senior Intelligence Analyst',
    unit: 'MHA — I4C National Command',
    avatar: 'MS',
    clearanceLevel: 'TOP SECRET',
  },
  {
    id: 'usr-002',
    name: 'Analyst Ravi Kumar',
    email: 'ravi@cybercell.gov.in',
    password: 'admin123',
    role: 'state_officer',
    designation: 'Cyber Crime Cell Officer',
    unit: 'Maharashtra Police — Cyber Cell',
    avatar: 'RK',
    clearanceLevel: 'CONFIDENTIAL',
  },
  {
    id: 'usr-003',
    name: 'Teller Priya Menon',
    email: 'priya@sbi.co.in',
    password: 'admin123',
    role: 'bank_operator',
    designation: 'Branch Operations Manager',
    unit: 'State Bank of India — Mumbai HQ',
    avatar: 'PM',
    clearanceLevel: 'INTERNAL',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      setIsLoading(false);
      return { success: true, user: safeUser };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid credentials. Use any demo account with password: admin123' };
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'state_officer',
      designation: userData.designation || 'Field Officer',
      unit: userData.unit || 'Assigned on onboarding',
      avatar: userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      clearanceLevel: 'INTERNAL',
    };

    setUser(newUser);
    setIsLoading(false);
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
