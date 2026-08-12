import api from '../api/axios';

const subscriptionService = {
  getCurrentSubscription: async () => {
    return await api.get('/api/subscriptions/current');
  },
  
  getSubscriptionHistory: async () => {
    return await api.get('/api/subscriptions/history');
  },

  createSubscription: async (planId) => {
    return await api.post('/api/subscriptions', { planId });
  },

  pauseSubscription: async (id) => {
    return await api.post(`/api/subscriptions/${id}/pause`);
  },

  resumeSubscription: async (id) => {
    return await api.post(`/api/subscriptions/${id}/resume`);
  },

  cancelSubscription: async (id) => {
    return await api.post(`/api/subscriptions/${id}/cancel`);
  },

  upgradeSubscription: async (id, newPlanId) => {
    return await api.post(`/api/subscriptions/${id}/upgrade`, { newPlanId });
  }
};

export default subscriptionService;
