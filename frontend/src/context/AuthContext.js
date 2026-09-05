import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisansetu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kisansetu_token');
    if (token) {
      API.get('/auth/profile').then(res => { setUser(res.data); setLoading(false); }).catch(() => { localStorage.removeItem('kisansetu_token'); setLoading(false); });
    } else { setLoading(false); }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('kisansetu_token', data.token);
    setUser(data.user);
    toast.success('Welcome back to KisanSetu!');
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('kisansetu_token', data.token);
    setUser(data.user);
    toast.success('Welcome to KisanSetu!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('kisansetu_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
