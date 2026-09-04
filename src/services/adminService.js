import api from '../api/axios';

const adminService = {
  // User Management
  getAllUsers: async () => {
    return await api.get('/api/admin/users');
  },

  // Plan Management
  getAllPlans: async () => {
    return await api.get('/api/admin/plans');
  },
  getHiddenPlans: async () => {
    return await api.get('/api/admin/plans/hidden');
  },
  createPlan: async (planData) => {
    return await api.post('/api/admin/plans', planData);
  },
  updatePlan: async (id, planData) => {
    return await api.put(`/api/admin/plans/${id}`, planData);
  },
  hidePlan: async (id) => {
    return await api.delete(`/api/admin/plans/${id}`);
  },
  restorePlan: async (id) => {
    return await api.put(`/api/admin/plans/${id}/reactivate`);
  },
  deletePlan: async (id) => {
    return await api.delete(`/api/admin/plans/${id}`);
  },

  // Payment Management
  getAllPayments: async () => {
    return await api.get('/api/admin/payments');
  },
  getRevenue: async () => {
    return await api.get('/api/admin/payments/revenue');
  },
  refundPayment: async (id) => {
    return await api.post(`/api/admin/payments/${id}/refund`);
  }
};

export default adminService;
