import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loginApi, signupApi, getProfileApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await getProfileApi();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (err) {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const res = await loginApi(email, password);
      if (res.success && res.token) {
        localStorage.setItem('auth_token', res.token);
        setUser(res.user);
        setIsLoading(false);
        return { success: true, user: res.user };
      }
      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const res = await signupApi(userData);
      if (res.success && res.token) {
        localStorage.setItem('auth_token', res.token);
        setUser(res.user);
        setIsLoading(false);
        return { success: true, user: res.user };
      }
      setIsLoading(false);
      return { success: false, error: 'Signup failed' };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Signup failed' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  // Method to manually update user state when profile is edited
  const updateUserState = useCallback((newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
