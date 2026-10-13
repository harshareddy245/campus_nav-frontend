import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campusnav_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('campusnav_token');
      const storedUser = localStorage.getItem('campusnav_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem('campusnav_token');
          localStorage.removeItem('campusnav_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('campusnav_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('campusnav_auth_expired', handleAuthExpired);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const data = await authApi.login({ usernameOrEmail, password });
    const authUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
      fullName: data.fullName,
    };
    localStorage.setItem('campusnav_token', data.accessToken);
    localStorage.setItem('campusnav_user', JSON.stringify(authUser));
    setToken(data.accessToken);
    setUser(authUser);
    return authUser;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    const authUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
      fullName: data.fullName,
    };
    localStorage.setItem('campusnav_token', data.accessToken);
    localStorage.setItem('campusnav_user', JSON.stringify(authUser));
    setToken(data.accessToken);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem('campusnav_token');
    localStorage.removeItem('campusnav_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;
  const isFaculty = user?.roles?.includes('ROLE_FACULTY') || false;
  const isStudent = user?.roles?.includes('ROLE_STUDENT') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isFaculty,
        isStudent,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
