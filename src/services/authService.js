import api from '../api/axios';

const authService = {
  // ============================================================
  // NORMAL LOGIN
  // ============================================================
  login: async (credentials) => {
    return api.post('/api/auth/login', credentials);
  },

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================
  googleLogin: async (credential) => {
    return api.post('/api/auth/google', {
      credential,
    });
  },

  // ============================================================
  // REGISTER
  // ============================================================
  register: async (data) => {
    return api.post('/api/auth/register', data);
  },

  // ============================================================
  // VERIFY EMAIL
  // ============================================================
  verifyEmail: async (data) => {
    return api.post('/api/auth/verify-email', data);
  },

  // ============================================================
  // RESEND VERIFICATION
  // ============================================================
  resendVerification: async (data) => {
    return api.post('/api/auth/resend-verification', data);
  },

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================
  forgotPassword: async (email) => {
    return api.post('/api/auth/forgot-password', {
      email: email.trim().toLowerCase(),
    });
  },

  // ============================================================
  // RESET PASSWORD
  // ============================================================
  resetPassword: async (data) => {
    return api.post('/api/auth/reset-password', data);
  },
};

export default authService;