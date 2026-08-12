import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Optionally verify token with backend
          // const response = await api.get('/api/users/me');
          // setUser(response.data);
          // localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // Backend typically returns { jwt, user } or { accessToken, user }
      // We check common field names to be robust
      const token = response.data.jwt || response.data.token || response.data.accessToken || response.data.data?.token;
      const user = response.data.user || response.data.data?.user;
      
      if (!token) {
        throw new Error('Authentication failed: No token received from server.');
      }

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/api/users/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
