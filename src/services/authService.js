import api from '../api/axios';

const authService = {
  login: async (credentials) => {
    // credentials = { email, password }
    return await api.post('/api/auth/login', credentials);
  },
  
  register: async (userData) => {
    // userData = { name, email, password, etc }
    return await api.post('/api/auth/register', userData);
  },

  verifyEmail: async (token) => {
    return await api.get(`/api/auth/verify-email?token=${token}`);
  },

  forgotPassword: async (email) => {
    return await api.post('/api/auth/forgot-password', { email });
  },

  resetPassword: async (data) => {
    // data = { token, password }
    return await api.post('/api/auth/reset-password', data);
  }
};

export default authService;
