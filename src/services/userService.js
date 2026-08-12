import api from '../api/axios';

const userService = {
  getCurrentUser: async () => {
    // This should match the backend endpoint for the authenticated user
    return await api.get('/api/users/me');
  },
  
  updateProfile: async (userData) => {
    return await api.put('/api/users/profile', userData);
  },

  getUserSettings: async () => {
    return await api.get('/api/users/settings');
  }
};

export default userService;
