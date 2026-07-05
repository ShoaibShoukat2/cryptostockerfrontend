import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);
// new
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await userAPI.getProfile();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [logout]);

  const login = useCallback(async (username, password) => {
    const { data } = await authAPI.login(username, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    const profileRes = await userAPI.getProfile();
    const userData = profileRes.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await userAPI.getProfile();
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const isAdmin = user?.user?.is_staff;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
