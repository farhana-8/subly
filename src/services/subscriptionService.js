import api from '../api/axios';

const subscriptionService = {
  getCurrentSubscription: async (config = {}) => {
    return await api.get('/api/subscriptions/current', config);
  },
  
  getSubscriptionHistory: async (config = {}) => {
    return await api.get('/api/subscriptions', config);
  },

  createSubscription: async (planId, config = {}) => {
    return await api.post('/api/subscriptions', { planId }, config);
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
