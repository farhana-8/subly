import api from '../api/axios';

const subscriptionService = {
  getCurrentSubscription: async (config = {}) => {
    return await api.get('/api/subscriptions/current', config);
  },
  


  createSubscription: async (planId, autoRenew = false, config = {}) => {
    return await api.post('/api/subscriptions', { planId, autoRenew }, config);
  },

  pauseSubscription: async (id, config = {}) => {
    return await api.post(`/api/subscriptions/${id}/pause`, {}, config);
  },

  resumeSubscription: async (id, config = {}) => {
    return await api.post(`/api/subscriptions/${id}/resume`, {}, config);
  },

  cancelSubscription: async (id, config = {}) => {
    return await api.post(`/api/subscriptions/${id}/cancel`, {}, config);
  },
};

export default subscriptionService;
