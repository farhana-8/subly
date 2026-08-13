import api from '../api/axios';

const authService = {
  login: async (credentials) => {
    // credentials = { email, password }
    return await api.post('/api/auth/login', credentials);
  },
  
  register: async (registerData) => {
    // registerData = { firstName, lastName, email, password }
    return await api.post('/api/auth/register', registerData);
  },

  verifyEmail: async (token) => {
    return await api.post('/api/auth/verify-email', { token });
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
