import api from '../api/axios';

const userService = {
  getCurrentUser: async () => {
    // Profile can fall back to the cached authenticated user if this optional
    // refresh endpoint is temporarily unavailable.
    return await api.get('/api/users/me', { skipAuthRedirect: true });
  },
  
  updateProfile: async (userData) => {
    return await api.put('/api/users/profile', userData);
  },

  getUserSettings: async () => {
    return await api.get('/api/users/settings');
  }
};

export default userService;
