import api from '../api/axios';

const planService = {
  getPlans: async () => {
    return await api.get('/api/plans');
  },
  
  getPlanById: async (id) => {
    return await api.get(`/api/plans/${id}`);
  }
};

export default planService;
