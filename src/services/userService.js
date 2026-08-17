import api from '../api/axios';

const userService = {
  getCurrentUser: async () => {
    return await api.get('/api/auth/me', { skipAuthRedirect: true });
  },
  updateProfile: async (data) => {
    return await api.put('/api/auth/profile', data);
  }
};

export default userService;
