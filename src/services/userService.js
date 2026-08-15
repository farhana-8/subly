import api from '../api/axios';

const userService = {
  getCurrentUser: async () => {
    // The backend exposes the authenticated profile at /api/auth/me.
    return await api.get('/api/auth/me', { skipAuthRedirect: true });
  },
};

export default userService;

