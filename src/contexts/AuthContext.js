import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(res => {
          setCurrentUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setCurrentUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setCurrentUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates);
      setCurrentUser(res.data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      isAdmin: currentUser?.isAdmin || false,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};