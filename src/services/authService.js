import api from '../api/axios';

const authService = {

  login: async (credentials) => {
    return api.post(
      '/api/auth/login',
      credentials
    );
  },

  googleLogin: async (credential) => {
    return api.post(
      '/api/auth/google',
      {
        credential,
      }
    );
  },

  register: async (data) => {
    return api.post(
      '/api/auth/register',
      data
    );
  },

  verifyEmail: async (data) => {
    return api.post(
      '/api/auth/verify-email',
      data
    );
  },

  resendVerification: async (data) => {
    return api.post(
      '/api/auth/resend-verification',
      data
    );
  },

  forgotPassword: async (email) => {
    return api.post(
      '/api/auth/forgot-password',
      {
        email: email.trim().toLowerCase(),
      }
    );
  },

  resetPassword: async (data) => {
    return api.post(
      '/api/auth/reset-password',
      data
    );
  },

};

export default authService;