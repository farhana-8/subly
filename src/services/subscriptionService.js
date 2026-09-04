import api from '../api/axios';

const subscriptionService = {
  /**
   * Returns the user's latest subscription.
   *
   * Can return ACTIVE, PAUSED, CANCELLED or EXPIRED.
   */
  getCurrentSubscription: async (config = {}) => {
    return await api.get('/api/subscriptions/current', config);
  },

  /**
   * Creates a new subscription.
   */
  createSubscription: async (planId, autoRenew = false, config = {}) => {
    return await api.post(
      '/api/subscriptions',
      {
        planId,
        autoRenew,
      },
      config
    );
  },

  /**
   * Pauses an active subscription.
   */
  pauseSubscription: async (id, config = {}) => {
    return await api.post(
      `/api/subscriptions/${id}/pause`,
      {},
      config
    );
  },

  /**
   * Resumes a paused subscription.
   */
  resumeSubscription: async (id, config = {}) => {
    return await api.post(
      `/api/subscriptions/${id}/resume`,
      {},
      config
    );
  },

  /**
   * Cancels a subscription.
   */
  cancelSubscription: async (id, config = {}) => {
    return await api.post(
      `/api/subscriptions/${id}/cancel`,
      {},
      config
    );
  },
};

export default subscriptionService;